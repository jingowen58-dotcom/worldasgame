import { isAdminEmail } from "@/server/admin";
import { grantEntitlement } from "@/server/commerce";
import { apiError, apiOk, guard } from "@/server/http";
import { currentUser } from "@/server/session";

export async function POST(request: Request) {
  const blocked = guard(request, "admin-grant");
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user || !isAdminEmail(user.email)) return apiError("FORBIDDEN", "Admin only.", 403);
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    productId?: string;
    reason?: string;
  } | null;
  if (!body?.email || !body.productId || !body.reason?.trim()) {
    return apiError("INVALID_BODY", "Email, product, and reason are required.", 400);
  }
  const result = await grantEntitlement(user.id, body.email, body.productId, body.reason);
  if (!result.ok) return apiError(result.code, result.code, 404);
  return apiOk({ entitlementId: result.entitlementId, already: result.already });
}
