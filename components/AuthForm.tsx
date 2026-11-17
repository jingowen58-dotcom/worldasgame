"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

type Mode = "login" | "signup" | "forgot" | "reset";

const paths: Record<Mode, string> = {
  login: "/api/v1/auth/login",
  signup: "/api/v1/auth/signup",
  forgot: "/api/v1/auth/forgot",
  reset: "/api/v1/auth/reset",
};

export function AuthForm({
  mode,
  locale,
  copy,
  token,
}: {
  mode: Mode;
  locale: Locale;
  copy: Copy;
  token?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setDevLink(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch(paths[mode], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        token,
        locale,
      }),
    });
    const json = (await response.json().catch(() => null)) as {
      success: boolean;
      data?: { devLink?: string | null };
      error?: { code?: string };
    } | null;
    if (!json) {
      setPending(false);
      setMessage(copy.auth.errors.generic);
      return;
    }
    setPending(false);
    if (!json.success) {
      const code = json.error?.code ?? "generic";
      setMessage(copy.auth.errors[code] ?? copy.auth.errors.generic);
      return;
    }
    if (mode === "login") {
      router.push(`/${locale}/account`);
      router.refresh();
      return;
    }
    if (mode === "reset") {
      router.push(`/${locale}/login?reset=1`);
      router.refresh();
      return;
    }
    setDevLink(json.data?.devLink ?? null);
    setMessage(mode === "forgot" ? copy.auth.forgotSent : copy.auth.sent);
  }

  const title =
    mode === "login"
      ? copy.auth.loginTitle
      : mode === "signup"
        ? copy.auth.signupTitle
        : mode === "reset"
          ? copy.auth.resetTitle
          : copy.auth.forgotTitle;
  const action =
    mode === "login"
      ? copy.auth.submitLogin
      : mode === "signup"
        ? copy.auth.submitSignup
        : mode === "reset"
          ? copy.auth.save
          : copy.auth.sendReset;

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
      <h1 className="text-3xl">{title}</h1>
      {mode !== "reset" ? (
        <label className="block text-sm text-mist">
          {copy.auth.email}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-3 text-paper"
          />
        </label>
      ) : null}
      {mode !== "forgot" ? (
        <label className="block text-sm text-mist">
          {mode === "reset" ? copy.auth.newPassword : copy.auth.password}
          <input
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={8}
            required
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-3 text-paper"
          />
        </label>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="btn-glow rounded-full px-5 py-3 text-sm text-white disabled:opacity-50"
      >
        {action}
      </button>
      {message ? <p className="text-sm leading-6 text-mist">{message}</p> : null}
      {devLink ? (
        <p className="text-sm leading-6 text-mist">
          {copy.auth.devLink}{" "}
          <a className="text-action" href={devLink}>
            {devLink}
          </a>
        </p>
      ) : null}
    </form>
  );
}
