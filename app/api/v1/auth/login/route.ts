import { login } from "@/server/auth";
import { recordEvent } from "@/server/analytics";
import { apiError, apiOk, guard } from "@/server/http";
import { openSession } from "@/server/session";

export async function POST(request: Request) {
  const blocked = guard(request, "login");
  if (blocked) return blocked;
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  if (!body) return apiError("INVALID_BODY", "Request body must be JSON.", 400);
  const result = await login(body.email ?? "", body.password ?? "");
  if (!result.ok) {
    const status = result.code === "EMAIL_NOT_VERIFIED" || result.code === "ACCOUNT_CLOSED" ? 403 : 401;
    return apiError(result.code, messageFor(result.code), status);
  }
  await openSession(result.userId);
  await recordEvent({ type: "login_completed", userId: result.userId });
  return apiOk({ status: "logged_in" });
}

function messageFor(code: string) {
  if (code === "EMAIL_NOT_VERIFIED") return "Verify your email before logging in.";
  if (code === "ACCOUNT_CLOSED") return "This account is closed.";
  return "Email or password is incorrect.";
}
