"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function ProfileForm({
  copy,
  locale,
  displayName,
  timezone,
  mode,
}: {
  copy: Copy;
  locale: Locale;
  displayName: string;
  timezone: string;
  mode: "profile" | "settings";
}) {
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/v1/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.get("displayName"),
        timezone: form.get("timezone"),
        locale: form.get("locale") || locale,
      }),
    });
    const json = (await response.json()) as { success: boolean; error?: { code?: string } };
    setMessage(json.success ? copy.auth.saved : (copy.auth.errors[json.error?.code ?? "generic"] ?? copy.auth.errors.generic));
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
      {mode === "profile" ? (
        <label className="block text-sm text-mist">
          {copy.auth.displayName}
          <input
            name="displayName"
            defaultValue={displayName}
            maxLength={40}
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-3 text-paper"
          />
        </label>
      ) : (
        <>
          <label className="block text-sm text-mist">
            {copy.nav.account}
            <select
              name="locale"
              defaultValue={locale}
              className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-3 text-paper"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </label>
          <label className="block text-sm text-mist">
            {copy.auth.timezone}
            <input
              name="timezone"
              defaultValue={timezone}
              placeholder="America/New_York"
              className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-3 text-paper"
            />
          </label>
        </>
      )}
      <button type="submit" className="rounded-full bg-action px-5 py-3 text-sm text-ink">
        {copy.auth.save}
      </button>
      {message ? <p className="text-sm text-mist">{message}</p> : null}
    </form>
  );
}

export function SecurityActions({ copy, locale }: { copy: Copy; locale: Locale }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function logout() {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push(`/${locale}/login`);
    router.refresh();
  }

  async function remove() {
    const response = await fetch("/api/v1/me", { method: "DELETE" });
    const json = (await response.json()) as { success: boolean };
    if (json.success) {
      router.push(`/${locale}/login?deleted=1`);
      router.refresh();
    } else setMessage(copy.auth.errors.generic);
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button type="button" onClick={logout} className="rounded-full bg-action px-5 py-3 text-sm text-ink">
        {copy.auth.logout}
      </button>
      <button type="button" onClick={remove} className="rounded-full border border-line px-5 py-3 text-sm">
        {copy.auth.deleteAccount}
      </button>
      {message ? <p className="w-full text-sm text-mist">{message}</p> : null}
    </div>
  );
}
