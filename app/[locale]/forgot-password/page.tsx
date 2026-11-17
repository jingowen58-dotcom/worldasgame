import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);

  return (
    <div>
      <AuthForm mode="forgot" locale={locale} copy={copy} />
      <p className="mt-6 text-sm text-mist">
        <Link href={`/${locale}/login`}>{copy.auth.loginTitle}</Link>
      </p>
    </div>
  );
}
