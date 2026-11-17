import { apiError, apiOk, guard } from "@/server/http";
import { closeSession } from "@/server/session";

export async function POST(request: Request) {
  const blocked = guard(request, "logout");
  if (blocked) return blocked;
  try {
    await closeSession();
  } catch (error) {
    console.error(error);
    return apiError("LOGOUT_FAILED", "Could not end the session.", 500);
  }
  return apiOk({ status: "logged_out" });
}
