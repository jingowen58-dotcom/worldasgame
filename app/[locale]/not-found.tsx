"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCopy } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";

export default function LocaleNotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "en";
  const locale = isLocale(segment) ? segment : "en";
  const copy = getCopy(locale);

  return (
    <section className="max-w-xl">
      <h1 className="text-3xl">{copy.world.missingTitle}</h1>
      <p className="mt-4 leading-7 text-mist">{copy.world.missingBody}</p>
      <Link href={`/${locale}`} className="mt-6 inline-block text-sm text-action">
        {copy.common.backHome}
      </Link>
    </section>
  );
}
