import { resetPassword } from "@/server/auth";
import { apiError, apiOk, guard } from "@/server/http";

export async function POST(request: Request) {
  const blocked = guard(request, "reset");
  if (blocked) return blocked;
  const body = (await request.json().catch(() => null)) as { token?: string; password?: string } | null;
  if (!body) return apiError("INVALID_BODY", "Request body must be JSON.", 400);
  const result = await resetPassword(body.token ?? "", body.password ?? "");
  if (!result.ok) {
    const message =
      result.code === "PASSWORD_TOO_SHORT" ? "Use at least 8 characters." : "This reset link is no longer valid.";
    return apiError(result.code, message, 400);
  }
  return apiOk({ status: "reset" });
}
