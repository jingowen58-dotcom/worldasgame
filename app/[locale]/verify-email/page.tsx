import Link from "next/link";
import { verifyEmail } from "@/server/auth";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const locale = await readLocale(params);
  const { token } = await searchParams;
  const copy = getCopy(locale);
  const result = token ? await verifyEmail(token) : { ok: false as const };

  return (
    <section className="max-w-xl">
      <h1 className="text-3xl">{result.ok ? copy.auth.verified : copy.auth.verifyFailed}</h1>
      <Link href={`/${locale}/login`} className="mt-6 inline-block text-sm text-action">
        {copy.auth.loginTitle}
      </Link>
    </section>
  );
}
