import { requestPasswordReset } from "@/server/auth";
import { apiError, apiOk, guard } from "@/server/http";
import { isLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const blocked = guard(request, "forgot");
  if (blocked) return blocked;
  const body = (await request.json().catch(() => null)) as { email?: string; locale?: string } | null;
  if (!body) return apiError("INVALID_BODY", "Request body must be JSON.", 400);
  const requested = body.locale ?? "en";
  const locale = isLocale(requested) ? requested : "en";
  const result = await requestPasswordReset(body.email ?? "", locale);
  return apiOk({ status: "accepted", devLink: result.ok ? (result.devLink ?? null) : null });
}
