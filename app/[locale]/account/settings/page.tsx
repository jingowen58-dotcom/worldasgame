import Link from "next/link";
import { ProfileForm } from "@/components/AccountControls";
import { getCopy } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { readLocale } from "@/lib/read-locale";
import { currentUser } from "@/server/session";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  const user = await currentUser();
  if (!user) {
    return (
      <p className="text-mist">
        {copy.account.signedOut}{" "}
        <Link className="text-action" href={`/${locale}/login`}>
          {copy.auth.loginTitle}
        </Link>
      </p>
    );
  }
  const preference = isLocale(user.locale) ? user.locale : locale;

  return (
    <ProfileForm
      copy={copy}
      locale={preference}
      displayName={user.displayName ?? ""}
      timezone={user.timezone ?? ""}
      mode="settings"
    />
  );
}
