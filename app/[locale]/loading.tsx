"use client";

import { usePathname } from "next/navigation";
import { getCopy } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";

export default function Loading() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "en";
  const locale = isLocale(segment) ? segment : "en";
  const copy = getCopy(locale);

  return (
    <div className="animate-pulse space-y-4" aria-live="polite">
      <p className="text-sm text-mist">{copy.loading}</p>
      <div className="h-8 w-2/3 rounded bg-panel" />
      <div className="h-24 rounded-2xl bg-panel" />
    </div>
  );
}
