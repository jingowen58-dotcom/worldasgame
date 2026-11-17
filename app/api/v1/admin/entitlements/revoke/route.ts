import { isAdminEmail } from "@/server/admin";
import { revokeEntitlement } from "@/server/commerce";
import { apiError, apiOk, guard } from "@/server/http";
import { currentUser } from "@/server/session";

export async function POST(request: Request) {
  const blocked = guard(request, "revoke-entitlement");
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user || !isAdminEmail(user.email)) return apiError("FORBIDDEN", "Admin only.", 403);
  const body = (await request.json().catch(() => null)) as { entitlementId?: string; reason?: string } | null;
  if (!body?.entitlementId) return apiError("INVALID_BODY", "Choose an entitlement.", 400);
  const result = await revokeEntitlement(user.id, body.entitlementId, body.reason ?? "");
  if (!result.ok) return apiError(result.code, result.code, result.code === "ENTITLEMENT_NOT_FOUND" ? 404 : 400);
  return apiOk({ already: result.already });
}
