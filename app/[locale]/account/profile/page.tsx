import Link from "next/link";
import { ProfileForm } from "@/components/AccountControls";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";
import { currentUser } from "@/server/session";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
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

  return (
    <div>
      <p className="text-sm text-mist">{user.email}</p>
      <ProfileForm
        copy={copy}
        locale={locale}
        displayName={user.displayName ?? ""}
        timezone={user.timezone ?? ""}
        mode="profile"
      />
    </div>
  );
}
