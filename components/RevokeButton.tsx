"use client";

import { useState } from "react";

export function RevokeButton({
  entitlementId,
  label,
}: {
  entitlementId: string;
  label: string;
}) {
  const [message, setMessage] = useState("");

  async function revoke() {
    const reason = window.prompt("Reason for revoking access");
    if (!reason?.trim()) return;
    const response = await fetch("/api/v1/admin/entitlements/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entitlementId, reason }),
    });
    const json = (await response.json().catch(() => null)) as { success: boolean } | null;
    setMessage(json?.success ? label : "Could not revoke.");
    if (json?.success) window.location.assign("/admin");
  }

  return (
    <button type="button" onClick={revoke} className="rounded-full border border-white/20 px-3 py-1.5 text-xs">
      {message || label}
    </button>
  );
}
