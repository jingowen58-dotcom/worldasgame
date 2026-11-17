import { signup } from "@/server/auth";
import { recordEvent } from "@/server/analytics";
import { apiError, apiOk, guard } from "@/server/http";
import { isLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const blocked = guard(request, "signup");
  if (blocked) return blocked;
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
    locale?: string;
  } | null;
  if (!body) return apiError("INVALID_BODY", "Request body must be JSON.", 400);
  const requested = body.locale ?? "en";
  const locale = isLocale(requested) ? requested : "en";
  let result: Awaited<ReturnType<typeof signup>>;
  try {
    result = await signup(body.email ?? "", body.password ?? "", locale);
  } catch (error) {
    console.error(error);
    return apiError("SERVER", "Could not create the account.", 500);
  }
  if (!result.ok) return apiError(result.code, messageFor(result.code), statusFor(result.code));
  if (result.created && result.userId) {
    await recordEvent({ type: "signup_completed", userId: result.userId });
  }
  return apiOk({ status: "verification_sent", devLink: result.devLink ?? null });
}

function statusFor(code: string) {
  if (code === "ACCOUNT_EXISTS") return 409;
  return 400;
}

function messageFor(code: string) {
  if (code === "ACCOUNT_EXISTS") return "An account with this email already exists.";
  if (code === "INVALID_EMAIL") return "Enter a valid email address.";
  if (code === "PASSWORD_TOO_SHORT") return "Use at least 8 characters.";
  return "Check the password and try again.";
}
