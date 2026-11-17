import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { CinematicSplit } from "@/components/CinematicSplit";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reset?: string; deleted?: string }>;
}) {
  const locale = await readLocale(params);
  const query = await searchParams;
  const copy = getCopy(locale);
  const note = query.deleted ? copy.auth.deletionDone : query.reset ? copy.auth.resetDone : "";

  return (
    <CinematicSplit>
      <div>
        {note ? <p className="text-sm text-mist">{note}</p> : null}
        <AuthForm mode="login" locale={locale} copy={copy} />
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist">
          <Link href={`/${locale}/forgot-password`}>{copy.auth.forgotLink}</Link>
          <Link href={`/${locale}/signup`}>{copy.auth.noAccount}</Link>
        </p>
      </div>
    </CinematicSplit>
  );
}
