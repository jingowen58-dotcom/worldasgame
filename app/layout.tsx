import type { Metadata } from "next";
import { headers } from "next/headers";
import { htmlLang, isLocale } from "@/lib/i18n";
import { getCopy } from "@/lib/copy";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: "Stories don't just happen on screen. They happen in your world.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerList = await headers();
  const requested = headerList.get("x-locale") ?? "en";
  const locale = isLocale(requested) ? requested : "en";
  const copy = getCopy(locale);

  return (
    <html lang={htmlLang(locale)}>
      <body className="bg-ink text-paper antialiased">
        <span className="sr-only">{copy.meta.title}</span>
        {children}
      </body>
    </html>
  );
}
