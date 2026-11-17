import { isAdminEmail } from "@/server/admin";
import { confirmOrderPaid } from "@/server/commerce";
import { apiError, apiOk, guard } from "@/server/http";
import { currentUser } from "@/server/session";

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const blocked = guard(request, "confirm-order");
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user || !isAdminEmail(user.email)) return apiError("FORBIDDEN", "Admin only.", 403);
  const body = (await request.json().catch(() => null)) as { reason?: string } | null;
  const { orderId } = await context.params;
  const result = await confirmOrderPaid(user.id, orderId, body?.reason ?? "");
  if (!result.ok) return apiError(result.code, result.code, result.code === "ORDER_NOT_FOUND" ? 404 : 400);
  return apiOk({ already: result.already });
}
