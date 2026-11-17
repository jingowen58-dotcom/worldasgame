"use client";

import { useState, type FormEvent } from "react";
import type { Copy } from "@/lib/copy";

export function AdminForms({
  copy,
  products,
}: {
  copy: Copy;
  products: { id: string; slug: string; title: string }[];
}) {
  const [productMessage, setProductMessage] = useState("");
  const [grantMessage, setGrantMessage] = useState("");

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/v1/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.get("slug"),
        titleEn: form.get("titleEn"),
        titleZh: form.get("titleZh"),
        descriptionEn: form.get("descriptionEn"),
        descriptionZh: form.get("descriptionZh"),
        amountMinor: Number(form.get("amountMinor")),
      }),
    });
    const json = (await response.json().catch(() => null)) as { success: boolean } | null;
    setProductMessage(json?.success ? copy.admin.saved : copy.auth.errors.generic);
    if (json?.success) window.location.assign("/admin");
  }

  async function grant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/v1/admin/entitlements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        productId: form.get("productId"),
        reason: form.get("reason"),
      }),
    });
    const json = (await response.json().catch(() => null)) as {
      success: boolean;
      data?: { already?: boolean };
    } | null;
    if (!json?.success) setGrantMessage(copy.auth.errors.generic);
    else setGrantMessage(json.data?.already ? copy.admin.already : copy.admin.granted);
  }

  return (
    <div className="mt-10 space-y-12">
      <form onSubmit={publish} className="max-w-lg space-y-3">
        <h2 className="text-2xl">{copy.admin.publish}</h2>
        <input name="slug" defaultValue="first-story" required className="w-full rounded-xl border border-line bg-ink px-3 py-3" />
        <input name="titleEn" defaultValue="First story" required className="w-full rounded-xl border border-line bg-ink px-3 py-3" />
        <input name="titleZh" defaultValue="第一部故事" required className="w-full rounded-xl border border-line bg-ink px-3 py-3" />
        <textarea name="descriptionEn" defaultValue="Season unlock. The story is not playable yet." className="w-full rounded-xl border border-line bg-ink px-3 py-3" />
        <textarea name="descriptionZh" defaultValue="整季解锁。故事还不能游玩。" className="w-full rounded-xl border border-line bg-ink px-3 py-3" />
        <input name="amountMinor" type="number" min={0} step={1} defaultValue={999} required className="w-full rounded-xl border border-line bg-ink px-3 py-3" />
        <button type="submit" className="rounded-full bg-action px-5 py-3 text-sm text-ink">
          {copy.admin.publish}
        </button>
        {productMessage ? <p className="text-sm text-mist">{productMessage}</p> : null}
      </form>

      <form onSubmit={grant} className="max-w-lg space-y-3">
        <h2 className="text-2xl">{copy.admin.grant}</h2>
        <input name="email" type="email" required placeholder="email" className="w-full rounded-xl border border-line bg-ink px-3 py-3" />
        <select name="productId" required className="w-full rounded-xl border border-line bg-ink px-3 py-3">
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
        <input name="reason" required placeholder={copy.admin.reason} className="w-full rounded-xl border border-line bg-ink px-3 py-3" />
        <button type="submit" className="rounded-full bg-action px-5 py-3 text-sm text-ink" disabled={products.length === 0}>
          {copy.admin.grant}
        </button>
        {grantMessage ? <p className="text-sm text-mist">{grantMessage}</p> : null}
      </form>
    </div>
  );
}
