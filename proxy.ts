import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "zh"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/manifest")
  ) {
    return NextResponse.next();
  }

  const segment = pathname.split("/")[1] ?? "";
  if (!locales.includes(segment)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", segment);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
