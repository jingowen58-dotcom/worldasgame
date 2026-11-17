"use client";

import { usePathname } from "next/navigation";
import { getCopy } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";

export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "en";
  const locale = isLocale(segment) ? segment : "en";
  const copy = getCopy(locale);

  return (
    <section className="max-w-xl">
      <h1 className="text-3xl">{copy.error.title}</h1>
      <p className="mt-4 leading-7 text-mist">{copy.error.body}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-action px-5 py-3 text-sm text-ink"
      >
        {copy.error.retry}
      </button>
    </section>
  );
}
