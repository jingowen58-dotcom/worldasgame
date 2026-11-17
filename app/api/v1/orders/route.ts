import { isLocale } from "@/lib/i18n";
import { recordEvent } from "@/server/analytics";
import { createOrder } from "@/server/commerce";
import { apiError, apiOk, guard } from "@/server/http";
import { currentUser } from "@/server/session";

export async function POST(request: Request) {
  const blocked = guard(request, "order");
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user || user.status === "deletion_requested") {
    return apiError("UNAUTHENTICATED", "Log in to continue.", 401);
  }
  const body = (await request.json().catch(() => null)) as { productId?: string; locale?: string } | null;
  if (!body?.productId) return apiError("INVALID_BODY", "Choose a product.", 400);
  const requested = body.locale ?? "en";
  const locale = isLocale(requested) ? requested : "en";
  const result = await createOrder(user.id, body.productId, locale);
  if (!result.ok) {
    const status = result.code === "ALREADY_OWNED" ? 409 : 404;
    return apiError(result.code, result.code, status);
  }
  if (result.created) {
    await recordEvent({
      type: "order_created",
      userId: user.id,
      metadata: { orderId: result.orderId, orderNo: result.orderNo, productId: body.productId },
    });
  }
  return apiOk({ orderId: result.orderId, orderNo: result.orderNo });
}
