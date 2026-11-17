"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|zh)/, "") || "";

  return (
    <div className="flex gap-3 text-sm">
      {locales.map((item) => {
        const active = item === locale;
        return (
          <Link
            key={item}
            href={`/${item}${rest}`}
            hrefLang={item === "zh" ? "zh-CN" : "en"}
            aria-current={active ? "true" : undefined}
            className={active ? "text-paper" : "text-mist"}
          >
            {item === "en" ? "EN" : "中文"}
          </Link>
        );
      })}
    </div>
  );
}
