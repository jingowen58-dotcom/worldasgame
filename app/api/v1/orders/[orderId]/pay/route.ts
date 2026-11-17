import { beginPayment } from "@/server/commerce";
import { apiError, apiOk, guard } from "@/server/http";
import { paypalPaymentLink } from "@/server/paypal";
import { currentUser } from "@/server/session";

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const blocked = guard(request, "pay");
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user) return apiError("UNAUTHENTICATED", "Log in to continue.", 401);
  const link = paypalPaymentLink();
  if (!link) return apiError("PAYPAL_UNAVAILABLE", "PayPal is not configured.", 503, "payment");
  const { orderId } = await context.params;
  const result = await beginPayment(user.id, orderId);
  if (!result.ok) {
    const status = result.code === "ORDER_NOT_FOUND" ? 404 : 409;
    return apiError(result.code, result.code, status, result.code === "ALREADY_PAID" ? undefined : "payment");
  }
  return apiOk({ url: link });
}
