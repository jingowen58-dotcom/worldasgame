import Link from "next/link";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function SiteHeader({
  locale,
  copy,
  signedIn,
}: {
  locale: Locale;
  copy: Copy;
  signedIn: boolean;
}) {
  const href = (path: string) => `/${locale}${path}`;
  const links = [
    [href("/discover"), copy.nav.discover],
    [href("/worlds/first-story"), copy.nav.explore],
    [href("/about"), copy.nav.about],
  ] as const;

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#070b16]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href={href("")} className="flex items-center gap-2 text-sm font-semibold tracking-[0.18em]">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#8d6bff] to-[#5ee7ff] text-[11px] text-white">
            ✦
          </span>
          WORLD AS GAME
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-sm text-mist">
          {links.map(([path, label]) => (
            <Link key={label} href={path} className="hover:text-paper">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <Link
            href={signedIn ? href("/account") : href("/login")}
            className="rounded-full border border-[#7d6bff] px-4 py-1.5 text-sm text-paper"
          >
            {signedIn ? copy.nav.account : copy.nav.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
