import type { Locale } from "@/lib/i18n";
import { query, transaction } from "@/server/db";
import { hashSecret, id, newSecret, normalizeEmail, passwordProblem } from "@/server/ids";
import { appUrl, sendMail } from "@/server/mail";
import { hashPassword, verifyPassword } from "@/server/password";

type AuthResult =
  | { ok: true; devLink?: string; userId?: string; created?: boolean }
  | { ok: false; code: string };

function devLink(delivered: boolean, link: string) {
  if (delivered || process.env.NODE_ENV === "production") return undefined;
  return link;
}

async function saveToken(userId: string, purpose: "verify" | "reset", hours: number) {
  const secret = newSecret();
  await query(
    `INSERT INTO email_tokens (id, user_id, purpose, token_hash, expires_at)
     VALUES ($1, $2, $3, $4, now() + ($5 * interval '1 hour'))`,
    [id(), userId, purpose, secret.hash, hours],
  );
  return secret.token;
}

export async function signup(emailInput: string, password: string, locale: Locale): Promise<AuthResult> {
  const email = normalizeEmail(emailInput);
  const passwordCode = passwordProblem(password);
  if (!email) return { ok: false, code: "INVALID_EMAIL" };
  if (passwordCode) return { ok: false, code: passwordCode };

  const existing = await query<{ id: string; email_verified_at: string | null }>(
    `SELECT id, email_verified_at FROM users
     WHERE lower(email) = $1 AND deleted_at IS NULL`,
    [email],
  );
  if (existing[0]?.email_verified_at) return { ok: false, code: "ACCOUNT_EXISTS" };

  const passwordHash = await hashPassword(password);
  const userId = existing[0]?.id ?? id();

  await transaction(async (tx) => {
    if (!existing[0]) {
      await tx(
        `INSERT INTO users (id, email, status) VALUES ($1, $2, 'pending')`,
        [userId, email],
      );
      await tx(
        `INSERT INTO auth_accounts (id, user_id, provider, provider_user_id, password_hash)
         VALUES ($1, $2, 'email', $3, $4)`,
        [id(), userId, email, passwordHash],
      );
      await tx(
        `INSERT INTO user_profiles (user_id, locale) VALUES ($1, $2)`,
        [userId, locale],
      );
    } else {
      await tx(
        `UPDATE auth_accounts SET password_hash = $2
         WHERE user_id = $1 AND provider = 'email'`,
        [userId, passwordHash],
      );
    }
  });

  const token = await saveToken(userId, "verify", 24);
  const link = `${appUrl()}/${locale}/verify-email?token=${token}`;
  const sent = await sendMail({
    to: email,
    userId,
    template: "verify-email",
    subject: locale === "zh" ? "验证你的 World As Game 邮箱" : "Verify your World As Game email",
    text:
      locale === "zh"
        ? `打开这个链接验证邮箱：\n${link}\n链接 24 小时内有效。`
        : `Verify your email:\n${link}\nThis link expires in 24 hours.`,
  });
  return { ok: true, devLink: devLink(sent.delivered, link), userId, created: !existing[0] };
}

export async function verifyEmail(token: string) {
  if (!token) return { ok: false as const, code: "INVALID_TOKEN" };
  const rows = await query<{ id: string; user_id: string }>(
    `SELECT id, user_id FROM email_tokens
     WHERE token_hash = $1 AND purpose = 'verify' AND used_at IS NULL AND expires_at > now()`,
    [hashSecret(token)],
  );
  const row = rows[0];
  if (!row) return { ok: false as const, code: "INVALID_TOKEN" };
  await transaction(async (tx) => {
    await tx(`UPDATE email_tokens SET used_at = now() WHERE id = $1`, [row.id]);
    await tx(
      `UPDATE users
       SET email_verified_at = now(), status = 'active', updated_at = now()
       WHERE id = $1 AND status <> 'deletion_requested'`,
      [row.user_id],
    );
  });
  return { ok: true as const };
}

export async function login(emailInput: string, password: string) {
  const email = normalizeEmail(emailInput);
  if (!email || !password) return { ok: false as const, code: "INVALID_LOGIN" };
  const rows = await query<{
    id: string;
    email_verified_at: string | null;
    password_hash: string | null;
    status: string;
  }>(
    `SELECT users.id, users.email_verified_at, users.status, auth_accounts.password_hash
     FROM users
     JOIN auth_accounts ON auth_accounts.user_id = users.id AND auth_accounts.provider = 'email'
     WHERE lower(users.email) = $1 AND users.deleted_at IS NULL`,
    [email],
  );
  const user = rows[0];
  if (!user?.password_hash || !(await verifyPassword(user.password_hash, password))) {
    return { ok: false as const, code: "INVALID_LOGIN" };
  }
  if (!user.email_verified_at) return { ok: false as const, code: "EMAIL_NOT_VERIFIED" };
  if (user.status === "deletion_requested") return { ok: false as const, code: "ACCOUNT_CLOSED" };
  return { ok: true as const, userId: user.id };
}

export async function requestPasswordReset(emailInput: string, locale: Locale): Promise<AuthResult> {
  const email = normalizeEmail(emailInput);
  if (!email) return { ok: true };
  const rows = await query<{ id: string; email_verified_at: string | null }>(
    `SELECT id, email_verified_at FROM users
     WHERE lower(email) = $1 AND deleted_at IS NULL`,
    [email],
  );
  const user = rows[0];
  if (!user?.email_verified_at) return { ok: true };
  const token = await saveToken(user.id, "reset", 1);
  const link = `${appUrl()}/${locale}/reset-password?token=${token}`;
  const sent = await sendMail({
    to: email,
    userId: user.id,
    template: "reset-password",
    subject: locale === "zh" ? "重置 World As Game 密码" : "Reset your World As Game password",
    text:
      locale === "zh"
        ? `打开这个链接重置密码：\n${link}\n链接 1 小时内有效。`
        : `Reset your password:\n${link}\nThis link expires in 1 hour.`,
  });
  return { ok: true, devLink: devLink(sent.delivered, link) };
}

export async function resetPassword(token: string, password: string) {
  const passwordCode = passwordProblem(password);
  if (!token) return { ok: false as const, code: "INVALID_TOKEN" };
  if (passwordCode) return { ok: false as const, code: passwordCode };
  const rows = await query<{ id: string; user_id: string }>(
    `SELECT id, user_id FROM email_tokens
     WHERE token_hash = $1 AND purpose = 'reset' AND used_at IS NULL AND expires_at > now()`,
    [hashSecret(token)],
  );
  const row = rows[0];
  if (!row) return { ok: false as const, code: "INVALID_TOKEN" };
  const passwordHash = await hashPassword(password);
  await transaction(async (tx) => {
    await tx(`UPDATE email_tokens SET used_at = now() WHERE id = $1`, [row.id]);
    await tx(
      `UPDATE auth_accounts SET password_hash = $2
       WHERE user_id = $1 AND provider = 'email'`,
      [row.user_id, passwordHash],
    );
    await tx(
      `UPDATE user_sessions SET revoked_at = now()
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [row.user_id],
    );
  });
  return { ok: true as const };
}

export async function updateProfile(
  userId: string,
  input: { displayName?: string; locale?: string; timezone?: string },
) {
  const displayName = input.displayName?.trim() ?? "";
  if (displayName.length > 40) return { ok: false as const, code: "NAME_TOO_LONG" };
  const locale = input.locale === "zh" || input.locale === "en" ? input.locale : null;
  const timezone = input.timezone?.trim().slice(0, 64) ?? "";
  await query(
    `UPDATE user_profiles
     SET display_name = $2,
         locale = COALESCE($3, locale),
         timezone = NULLIF($4, ''),
         updated_at = now()
     WHERE user_id = $1`,
    [userId, displayName || null, locale, timezone],
  );
  return { ok: true as const };
}

export async function requestDeletion(userId: string) {
  const open = await query<{ id: string }>(
    `SELECT id FROM deletion_requests WHERE user_id = $1 AND status = 'pending'`,
    [userId],
  );
  if (!open[0]) {
    await query(
      `INSERT INTO deletion_requests (id, user_id, status) VALUES ($1, $2, 'pending')`,
      [id(), userId],
    );
  }
  await query(
    `UPDATE users SET status = 'deletion_requested', updated_at = now() WHERE id = $1`,
    [userId],
  );
  await query(
    `UPDATE user_sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId],
  );
}
