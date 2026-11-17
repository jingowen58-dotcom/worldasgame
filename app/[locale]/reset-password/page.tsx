import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const locale = await readLocale(params);
  const { token } = await searchParams;
  const copy = getCopy(locale);

  if (!token) {
    return (
      <section className="max-w-xl">
        <h1 className="text-3xl">{copy.auth.resetTitle}</h1>
        <p className="mt-4 text-mist">{copy.auth.verifyFailed}</p>
      </section>
    );
  }

  return (
    <div>
      <AuthForm mode="reset" locale={locale} copy={copy} token={token} />
      <p className="mt-6 text-sm text-mist">
        <Link href={`/${locale}/login`}>{copy.auth.loginTitle}</Link>
      </p>
    </div>
  );
}
