"use client";

import { useState } from "react";
import type { Copy } from "@/lib/copy";

export function PayPalButton({ orderId, label }: { orderId: string; label: string }) {
  const [message, setMessage] = useState("");

  async function pay() {
    setMessage("");
    const response = await fetch(`/api/v1/orders/${orderId}/pay`, { method: "POST" });
    const json = (await response.json().catch(() => null)) as {
      success: boolean;
      data?: { url?: string };
    } | null;
    if (!json?.success || !json.data?.url) {
      setMessage("PayPal could not be opened.");
      return;
    }
    window.location.assign(json.data.url);
  }

  return (
    <div className="mt-6">
      <button type="button" onClick={pay} className="btn-glow rounded-full px-5 py-3 text-sm text-white">
        {label}
      </button>
      {message ? <p className="mt-3 text-sm text-mist">{message}</p> : null}
    </div>
  );
}
