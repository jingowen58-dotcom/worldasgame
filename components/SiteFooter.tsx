import Link from "next/link";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export function SiteFooter({ locale, copy }: { locale: Locale; copy: Copy }) {
  const href = (path: string) => `/${locale}${path}`;
  const links = [
    [href("/privacy"), copy.footer.privacy],
    [href("/terms"), copy.footer.terms],
    [href("/refund-policy"), copy.footer.refund],
    [href("/help"), copy.nav.help],
  ] as const;

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#070b16]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-sm text-mist">
        <p>{site.domain}</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map(([path, label]) => (
            <Link key={path} href={path}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
