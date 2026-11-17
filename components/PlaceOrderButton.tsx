"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function PlaceOrderButton({
  productId,
  locale,
  copy,
}: {
  productId: string;
  locale: Locale;
  copy: Copy;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function place() {
    setMessage("");
    const response = await fetch("/api/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, locale }),
    });
    const json = (await response.json().catch(() => null)) as { success: boolean; error?: { code?: string } } | null;
    if (!json?.success) {
      setMessage(json?.error?.code === "ALREADY_OWNED" ? copy.commerce.inLibrary : copy.auth.errors.generic);
      return;
    }
    router.push(`/${locale}/checkout`);
    router.refresh();
  }

  return (
    <div className="mt-6">
      <button type="button" onClick={place} className="btn-glow rounded-full px-5 py-3 text-sm text-white">
        {copy.commerce.placeOrder}
      </button>
      {message ? <p className="mt-3 text-sm text-mist">{message}</p> : null}
    </div>
  );
}
