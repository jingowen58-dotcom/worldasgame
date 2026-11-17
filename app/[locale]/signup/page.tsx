import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { CinematicSplit } from "@/components/CinematicSplit";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);

  return (
    <CinematicSplit>
      <div>
        <AuthForm mode="signup" locale={locale} copy={copy} />
        <p className="mt-6 text-sm text-mist">
          <Link href={`/${locale}/login`}>{copy.auth.hasAccount}</Link>
        </p>
      </div>
    </CinematicSplit>
  );
}
