import { isAdminEmail } from "@/server/admin";
import { saveProduct } from "@/server/commerce";
import { apiError, apiOk, guard } from "@/server/http";
import { currentUser } from "@/server/session";

export async function POST(request: Request) {
  const blocked = guard(request, "admin-product");
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user || !isAdminEmail(user.email)) return apiError("FORBIDDEN", "Admin only.", 403);
  const body = (await request.json().catch(() => null)) as {
    slug?: string;
    titleEn?: string;
    titleZh?: string;
    descriptionEn?: string;
    descriptionZh?: string;
    amountMinor?: number;
  } | null;
  if (!body) return apiError("INVALID_BODY", "Request body must be JSON.", 400);
  const result = await saveProduct(user.id, {
    slug: body.slug ?? "",
    titleEn: body.titleEn ?? "",
    titleZh: body.titleZh ?? "",
    descriptionEn: body.descriptionEn ?? "",
    descriptionZh: body.descriptionZh ?? "",
    amountMinor: Number(body.amountMinor),
  });
  if (!result.ok) return apiError(result.code, result.code, 400);
  return apiOk({ productId: result.productId });
}
