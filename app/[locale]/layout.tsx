import { MainFrame } from "@/components/MainFrame";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getCopy } from "@/lib/copy";
import { readLocale } from "@/lib/read-locale";
import { currentUser } from "@/server/session";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const copy = getCopy(locale);
  const user = await currentUser().catch(() => null);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} copy={copy} signedIn={Boolean(user)} />
      <MainFrame>{children}</MainFrame>
      <SiteFooter locale={locale} copy={copy} />
    </div>
  );
}
