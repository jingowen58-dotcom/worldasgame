"use client";

import { useState } from "react";

export function ConfirmOrderButton({
  orderId,
  label,
  doneLabel,
}: {
  orderId: string;
  label: string;
  doneLabel: string;
}) {
  const [message, setMessage] = useState("");

  async function confirm() {
    const reason = window.prompt("Reason for confirming this PayPal payment");
    if (!reason?.trim()) return;
    const response = await fetch(`/api/v1/admin/orders/${orderId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const json = (await response.json().catch(() => null)) as {
      success: boolean;
      data?: { already?: boolean };
    } | null;
    if (!json?.success) {
      setMessage("Could not confirm.");
      return;
    }
    setMessage(json.data?.already ? doneLabel : label);
    window.location.assign("/admin");
  }

  return (
    <button type="button" onClick={confirm} className="rounded-full border border-white/20 px-3 py-1.5 text-xs">
      {message || label}
    </button>
  );
}
