import type { Locale } from "@/lib/i18n";
import { recordEvent } from "@/server/analytics";
import { query, transaction } from "@/server/db";
import { id } from "@/server/ids";
import { sendMail } from "@/server/mail";
import { formatMinor } from "@/server/money";

export type CatalogItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  currency: string;
  amountMinor: number;
  price: string;
  owned: boolean;
};

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  currency: string;
  amount_minor: string | number;
};

function amountOf(value: string | number) {
  return typeof value === "number" ? value : Number(value);
}

async function owns(userId: string | null, productId: string) {
  if (!userId) return false;
  const rows = await query<{ id: string }>(
    `SELECT id FROM entitlements
     WHERE user_id = $1 AND product_id = $2 AND status = 'active'`,
    [userId, productId],
  );
  return Boolean(rows[0]);
}

export async function publishedProduct(slug: string, locale: Locale, userId: string | null) {
  const rows = await query<ProductRow>(
    `SELECT products.id, products.slug, product_translations.title, product_translations.description,
            product_prices.currency, product_prices.amount_minor
     FROM products
     JOIN product_translations ON product_translations.product_id = products.id AND product_translations.locale = $2
     JOIN product_prices ON product_prices.product_id = products.id
       AND product_prices.currency = products.default_currency
       AND product_prices.active = true
     WHERE products.slug = $1 AND products.status = 'published'`,
    [slug, locale],
  );
  const row = rows[0];
  if (!row) return null;
  const amountMinor = amountOf(row.amount_minor);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    currency: row.currency,
    amountMinor,
    price: formatMinor(amountMinor, row.currency, locale),
    owned: await owns(userId, row.id),
  } satisfies CatalogItem;
}

export async function createOrder(userId: string, productId: string, locale: Locale) {
  const rows = await query<ProductRow>(
    `SELECT products.id, products.slug, product_translations.title, product_translations.description,
            product_prices.currency, product_prices.amount_minor
     FROM products
     JOIN product_translations ON product_translations.product_id = products.id AND product_translations.locale = $2
     JOIN product_prices ON product_prices.product_id = products.id
       AND product_prices.currency = products.default_currency
       AND product_prices.active = true
     WHERE products.id = $1 AND products.status = 'published'`,
    [productId, locale],
  );
  const product = rows[0];
  if (!product) return { ok: false as const, code: "PRODUCT_NOT_FOUND" };
  if (await owns(userId, product.id)) return { ok: false as const, code: "ALREADY_OWNED" };

  const pending = await query<{ id: string; order_no: string }>(
    `SELECT orders.id, orders.order_no
     FROM orders
     JOIN order_items ON order_items.order_id = orders.id
     WHERE orders.user_id = $1
       AND orders.status IN ('PENDING', 'PAYMENT_PROCESSING')
       AND order_items.product_id = $2
     ORDER BY orders.created_at DESC
     LIMIT 1`,
    [userId, product.id],
  );
  if (pending[0]) return { ok: true as const, orderId: pending[0].id, orderNo: pending[0].order_no, created: false };

  const amountMinor = amountOf(product.amount_minor);
  const orderId = id();
  const orderNo = `WG-${orderId.slice(0, 8).toUpperCase()}`;
  await transaction(async (tx) => {
    await tx(
      `INSERT INTO orders (id, order_no, user_id, status, currency, subtotal_minor, discount_minor, total_minor)
       VALUES ($1, $2, $3, 'PENDING', $4, $5, 0, $5)`,
      [orderId, orderNo, userId, product.currency, amountMinor],
    );
    await tx(
      `INSERT INTO order_items (id, order_id, product_id, product_title_snapshot, quantity, unit_amount_minor, total_amount_minor)
       VALUES ($1, $2, $3, $4, 1, $5, $5)`,
      [id(), orderId, product.id, product.title, amountMinor],
    );
  });
  return { ok: true as const, orderId, orderNo, created: true };
}

export async function libraryFor(userId: string, locale: Locale) {
  const owned = await query<{ title: string; slug: string }>(
    `SELECT product_translations.title, products.slug
     FROM entitlements
     JOIN products ON products.id = entitlements.product_id
     JOIN product_translations ON product_translations.product_id = products.id AND product_translations.locale = $2
     WHERE entitlements.user_id = $1 AND entitlements.status = 'active'
     ORDER BY entitlements.created_at DESC`,
    [userId, locale],
  );
  const pending = await query<{
    id: string;
    order_no: string;
    status: string;
    title: string;
    total_minor: string | number;
    currency: string;
  }>(
    `SELECT orders.id, orders.order_no, orders.status, order_items.product_title_snapshot AS title,
            orders.total_minor, orders.currency
     FROM orders
     JOIN order_items ON order_items.order_id = orders.id
     WHERE orders.user_id = $1 AND orders.status IN ('PENDING', 'PAYMENT_PROCESSING')
       AND NOT EXISTS (
         SELECT 1 FROM entitlements
         WHERE entitlements.user_id = orders.user_id
           AND entitlements.product_id = order_items.product_id
           AND entitlements.status = 'active'
       )
     ORDER BY orders.created_at DESC`,
    [userId],
  );
  return {
    owned,
    pending: pending.map((row) => ({
      orderId: row.id,
      orderNo: row.order_no,
      status: row.status,
      title: row.title,
      price: formatMinor(amountOf(row.total_minor), row.currency, locale),
    })),
  };
}

export async function saveProduct(
  actorId: string,
  input: {
    slug: string;
    titleEn: string;
    titleZh: string;
    descriptionEn: string;
    descriptionZh: string;
    amountMinor: number;
  },
) {
  const slug = input.slug.trim().toLowerCase();
  if (!/^[a-z0-9-]{3,48}$/.test(slug)) return { ok: false as const, code: "INVALID_SLUG" };
  if (!input.titleEn.trim() || !input.titleZh.trim()) return { ok: false as const, code: "TITLE_REQUIRED" };
  if (!Number.isInteger(input.amountMinor) || input.amountMinor < 0) return { ok: false as const, code: "INVALID_PRICE" };

  const existing = await query<{ id: string; status: string }>(`SELECT id, status FROM products WHERE slug = $1`, [slug]);
  const productId = existing[0]?.id ?? id();
  const currentPrice = existing[0]
    ? await query<{ amount_minor: string | number }>(
        `SELECT amount_minor FROM product_prices
         WHERE product_id = $1 AND currency = 'USD' AND active = true`,
        [productId],
      )
    : [];
  const previousMinor = currentPrice[0] ? Number(currentPrice[0].amount_minor) : null;
  const publishing = !existing[0] || existing[0].status !== "published";
  const priceChanged = previousMinor !== null && previousMinor !== input.amountMinor;
  await transaction(async (tx) => {
    if (!existing[0]) {
      await tx(
        `INSERT INTO products (id, slug, product_type, status, default_currency)
         VALUES ($1, $2, 'ONE_TIME', 'published', 'USD')`,
        [productId, slug],
      );
    } else {
      await tx(
        `UPDATE products SET status = 'published', updated_at = now() WHERE id = $1`,
        [productId],
      );
    }
    for (const [locale, title, description] of [
      ["en", input.titleEn.trim(), input.descriptionEn.trim()],
      ["zh", input.titleZh.trim(), input.descriptionZh.trim()],
    ] as const) {
      await tx(
        `INSERT INTO product_translations (id, product_id, locale, title, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (product_id, locale)
         DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description`,
        [id(), productId, locale, title, description],
      );
    }
    await tx(
      `UPDATE product_prices SET active = false WHERE product_id = $1 AND currency = 'USD' AND active = true`,
      [productId],
    );
    await tx(
      `INSERT INTO product_prices (id, product_id, currency, amount_minor, active)
       VALUES ($1, $2, 'USD', $3, true)`,
      [id(), productId, input.amountMinor],
    );
    if (publishing) {
      await tx(
        `INSERT INTO admin_audit_logs (id, actor_id, action, target_type, target_id, reason)
         VALUES ($1, $2, 'product.published', 'product', $3, $4)`,
        [id(), actorId, productId, formatMinor(input.amountMinor, "USD", "en")],
      );
    }
    if (priceChanged && previousMinor !== null) {
      await tx(
        `INSERT INTO admin_audit_logs (id, actor_id, action, target_type, target_id, reason)
         VALUES ($1, $2, 'price.changed', 'product', $3, $4)`,
        [
          id(),
          actorId,
          productId,
          `${formatMinor(previousMinor, "USD", "en")} → ${formatMinor(input.amountMinor, "USD", "en")}`,
        ],
      );
    }
  });
  return { ok: true as const, productId };
}

export async function grantEntitlement(actorId: string, email: string, productId: string, reason: string) {
  const users = await query<{ id: string }>(
    `SELECT id FROM users WHERE lower(email) = $1 AND deleted_at IS NULL AND email_verified_at IS NOT NULL`,
    [email.trim().toLowerCase()],
  );
  const user = users[0];
  if (!user) return { ok: false as const, code: "USER_NOT_FOUND" };
  const products = await query<{ id: string }>(`SELECT id FROM products WHERE id = $1 AND status = 'published'`, [
    productId,
  ]);
  if (!products[0]) return { ok: false as const, code: "PRODUCT_NOT_FOUND" };
  const existing = await query<{ id: string }>(
    `SELECT id FROM entitlements WHERE user_id = $1 AND product_id = $2 AND status = 'active'`,
    [user.id, productId],
  );
  if (existing[0]) return { ok: true as const, entitlementId: existing[0].id, already: true };

  const entitlementId = id();
  await transaction(async (tx) => {
    await tx(
      `INSERT INTO entitlements (id, user_id, product_id, entitlement_type, status)
       VALUES ($1, $2, $3, 'ONE_TIME', 'active')`,
      [entitlementId, user.id, productId],
    );
    await tx(
      `INSERT INTO admin_audit_logs (id, actor_id, action, target_type, target_id, reason)
       VALUES ($1, $2, 'entitlement.grant', 'entitlement', $3, $4)`,
      [id(), actorId, entitlementId, reason.trim().slice(0, 200)],
    );
  });
  return { ok: true as const, entitlementId, already: false };
}

export async function listAuditLogs() {
  return query<{
    id: string;
    action: string;
    reason: string | null;
    created_at: string;
    actor_email: string;
    order_no: string | null;
    target_email: string | null;
    product_slug: string | null;
  }>(
    `SELECT admin_audit_logs.id, admin_audit_logs.action, admin_audit_logs.reason, admin_audit_logs.created_at,
            actors.email AS actor_email, orders.order_no, holders.email AS target_email, products.slug AS product_slug
     FROM admin_audit_logs
     JOIN users AS actors ON actors.id = admin_audit_logs.actor_id
     LEFT JOIN orders ON admin_audit_logs.target_type = 'order' AND orders.id = admin_audit_logs.target_id
     LEFT JOIN entitlements ON admin_audit_logs.target_type = 'entitlement' AND entitlements.id = admin_audit_logs.target_id
     LEFT JOIN users AS holders ON holders.id = entitlements.user_id
     LEFT JOIN products ON admin_audit_logs.target_type = 'product' AND products.id = admin_audit_logs.target_id
     ORDER BY admin_audit_logs.created_at DESC
     LIMIT 50`,
  );
}

export async function listUsers() {
  return query<{
    email: string;
    status: string;
    entitlement_id: string | null;
    product_title: string | null;
  }>(
    `SELECT users.email, users.status, entitlements.id AS entitlement_id, product_translations.title AS product_title
     FROM users
     LEFT JOIN entitlements ON entitlements.user_id = users.id AND entitlements.status = 'active'
     LEFT JOIN product_translations ON product_translations.product_id = entitlements.product_id
       AND product_translations.locale = 'en'
     WHERE users.deleted_at IS NULL
     ORDER BY users.created_at DESC
     LIMIT 50`,
  );
}

export async function revokeEntitlement(actorId: string, entitlementId: string, reason: string) {
  const note = reason.trim().slice(0, 200);
  if (!note) return { ok: false as const, code: "REASON_REQUIRED" };
  const rows = await query<{ id: string; status: string }>(
    `SELECT id, status FROM entitlements WHERE id = $1`,
    [entitlementId],
  );
  const row = rows[0];
  if (!row) return { ok: false as const, code: "ENTITLEMENT_NOT_FOUND" };
  if (row.status !== "active") return { ok: true as const, already: true };
  const updated = await query<{ id: string }>(
    `UPDATE entitlements SET status = 'revoked' WHERE id = $1 AND status = 'active' RETURNING id`,
    [row.id],
  );
  if (!updated[0]) return { ok: true as const, already: true };
  await query(
    `INSERT INTO admin_audit_logs (id, actor_id, action, target_type, target_id, reason)
     VALUES ($1, $2, 'entitlement.revoke', 'entitlement', $3, $4)`,
    [id(), actorId, row.id, note],
  );
  return { ok: true as const, already: false };
}

export async function beginPayment(userId: string, orderId: string) {
  const rows = await query<{ id: string; status: string; order_no: string; product_id: string }>(
    `SELECT orders.id, orders.status, orders.order_no, order_items.product_id
     FROM orders
     JOIN order_items ON order_items.order_id = orders.id
     WHERE orders.id = $1 AND orders.user_id = $2`,
    [orderId, userId],
  );
  const order = rows[0];
  if (!order) return { ok: false as const, code: "ORDER_NOT_FOUND" };
  if (order.status === "PAID") return { ok: false as const, code: "ALREADY_PAID" };
  if (order.status !== "PENDING" && order.status !== "PAYMENT_PROCESSING") {
    return { ok: false as const, code: "ORDER_NOT_PAYABLE" };
  }
  if (order.status === "PENDING") {
    await query(
      `UPDATE orders SET status = 'PAYMENT_PROCESSING', updated_at = now()
       WHERE id = $1 AND status = 'PENDING'`,
      [order.id],
    );
    await recordEvent({
      type: "payment_started",
      userId,
      metadata: { orderId: order.id, orderNo: order.order_no, productId: order.product_id },
    });
  }
  return { ok: true as const, orderId: order.id };
}

export async function confirmOrderPaid(actorId: string, orderId: string, reason: string) {
  const note = reason.trim().slice(0, 200);
  if (!note) return { ok: false as const, code: "REASON_REQUIRED" };
  const rows = await query<{ id: string; user_id: string; status: string; product_id: string; order_no: string }>(
    `SELECT orders.id, orders.user_id, orders.status, orders.order_no, order_items.product_id
     FROM orders
     JOIN order_items ON order_items.order_id = orders.id
     WHERE orders.id = $1`,
    [orderId],
  );
  const order = rows[0];
  if (!order) return { ok: false as const, code: "ORDER_NOT_FOUND" };
  if (order.status === "PAID") return { ok: true as const, already: true };

  const payable = order.status === "PENDING" || order.status === "PAYMENT_PROCESSING";
  if (!payable) return { ok: false as const, code: "ORDER_NOT_PAYABLE" };

  const existing = await query<{ id: string }>(
    `SELECT id FROM entitlements WHERE user_id = $1 AND product_id = $2 AND status = 'active'`,
    [order.user_id, order.product_id],
  );
  let paidNow = false;
  await transaction(async (tx) => {
    const updated = await tx<{ id: string }>(
      `UPDATE orders SET status = 'PAID', paid_at = now(), updated_at = now()
       WHERE id = $1 AND status IN ('PENDING', 'PAYMENT_PROCESSING')
       RETURNING id`,
      [order.id],
    );
    if (!updated[0]) return;
    paidNow = true;
    if (!existing[0]) {
      const entitlementId = id();
      await tx(
        `INSERT INTO entitlements (id, user_id, product_id, source_order_id, entitlement_type, status)
         VALUES ($1, $2, $3, $4, 'ONE_TIME', 'active')`,
        [entitlementId, order.user_id, order.product_id, order.id],
      );
    }
    await tx(
      `INSERT INTO admin_audit_logs (id, actor_id, action, target_type, target_id, reason)
       VALUES ($1, $2, 'order.paid', 'order', $3, $4)`,
      [id(), actorId, order.id, note],
    );
  });
  if (!paidNow) return { ok: true as const, already: true };

  const buyers = await query<{ email: string; locale: string }>(
    `SELECT users.email, user_profiles.locale
     FROM users
     JOIN user_profiles ON user_profiles.user_id = users.id
     WHERE users.id = $1`,
    [order.user_id],
  );
  const buyer = buyers[0];
  if (buyer?.email) {
    const zh = buyer.locale === "zh";
    await sendMail({
      to: buyer.email,
      userId: order.user_id,
      template: "payment-confirmation",
      subject: zh ? "World As Game 付款已确认" : "Your World As Game payment is confirmed",
      text: zh
        ? "你的付款已确认，故事已加入内容库。这一封信本身不是付款凭证。"
        : "Your payment is confirmed and the story is in your library. This email is not itself proof of payment.",
    }).catch((error: unknown) => {
      console.error(error);
    });
  }
  await recordEvent({
    type: "payment_confirmed",
    userId: order.user_id,
    metadata: { orderId: order.id, orderNo: order.order_no, productId: order.product_id },
  });
  return { ok: true as const, already: false };
}

export async function ordersForUser(userId: string, locale: Locale) {
  const rows = await query<{
    order_no: string;
    status: string;
    title: string;
    total_minor: string | number;
    currency: string;
  }>(
    `SELECT orders.order_no, orders.status, order_items.product_title_snapshot AS title,
            orders.total_minor, orders.currency
     FROM orders
     JOIN order_items ON order_items.order_id = orders.id
     WHERE orders.user_id = $1
     ORDER BY orders.created_at DESC`,
    [userId],
  );
  return rows.map((row) => ({
    orderNo: row.order_no,
    status: row.status,
    title: row.title,
    price: formatMinor(amountOf(row.total_minor), row.currency, locale),
  }));
}

export async function listOpenOrders() {
  return query<{
    id: string;
    order_no: string;
    status: string;
    email: string;
    title: string;
    total_minor: string | number;
    currency: string;
  }>(
    `SELECT orders.id, orders.order_no, orders.status, users.email,
            order_items.product_title_snapshot AS title, orders.total_minor, orders.currency
     FROM orders
     JOIN users ON users.id = orders.user_id
     JOIN order_items ON order_items.order_id = orders.id
     WHERE orders.status IN ('PENDING', 'PAYMENT_PROCESSING', 'PAID')
     ORDER BY orders.updated_at DESC
     LIMIT 50`,
  );
}
export async function listProducts() {
  return query<{ id: string; slug: string; title: string; amount_minor: string | number }>(
    `SELECT products.id, products.slug, product_translations.title, product_prices.amount_minor
     FROM products
     JOIN product_translations ON product_translations.product_id = products.id AND product_translations.locale = 'en'
     LEFT JOIN product_prices ON product_prices.product_id = products.id
       AND product_prices.currency = 'USD' AND product_prices.active = true
     WHERE products.status = 'published'
     ORDER BY products.created_at DESC`,
  );
}
