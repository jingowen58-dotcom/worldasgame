import Link from "next/link";
import { getCopy } from "@/lib/copy";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { readLocale } from "@/lib/read-locale";

const sections = ["profile", "security", "orders", "settings"] as const;

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);

  return (
    <div>
      <h1 className="text-4xl">{copy.account.title}</h1>
      <AccountNav locale={locale} copy={copy} />
      <div className="mt-8">{children}</div>
    </div>
  );
}

function AccountNav({ locale, copy }: { locale: Locale; copy: Copy }) {
  return (
    <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist">
      {sections.map((section) => (
        <Link key={section} href={`/${locale}/account/${section}`}>
          {copy.account[section]}
        </Link>
      ))}
    </nav>
  );
}
