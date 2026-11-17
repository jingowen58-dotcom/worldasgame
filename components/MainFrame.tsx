"use client";

import { usePathname } from "next/navigation";

export function MainFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const bare = /^\/(en|zh)(\/(discover|login|signup|worlds\/[^/]+))?$/.test(path);
  if (bare) return <div className="flex-1">{children}</div>;
  return <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14">{children}</div>;
}
