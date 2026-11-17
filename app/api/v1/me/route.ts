import { requestDeletion, updateProfile } from "@/server/auth";
import { apiError, apiOk, guard } from "@/server/http";
import { closeSession, currentUser } from "@/server/session";

export async function GET() {
  const user = await currentUser();
  if (!user) return apiError("UNAUTHENTICATED", "Log in to continue.", 401);
  return apiOk({
    email: user.email,
    displayName: user.displayName,
    locale: user.locale,
    timezone: user.timezone,
    deletionRequested: user.deletionRequested,
  });
}

export async function PATCH(request: Request) {
  const blocked = guard(request, "profile");
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user) return apiError("UNAUTHENTICATED", "Log in to continue.", 401);
  const body = (await request.json().catch(() => null)) as {
    displayName?: string;
    locale?: string;
    timezone?: string;
  } | null;
  if (!body) return apiError("INVALID_BODY", "Request body must be JSON.", 400);
  const result = await updateProfile(user.id, body);
  if (!result.ok) return apiError(result.code, "Name is too long.", 400);
  return apiOk({ status: "saved" });
}

export async function DELETE(request: Request) {
  const blocked = guard(request, "delete");
  if (blocked) return blocked;
  const user = await currentUser();
  if (!user) return apiError("UNAUTHENTICATED", "Log in to continue.", 401);
  await requestDeletion(user.id);
  await closeSession();
  return apiOk({ status: "deletion_requested" });
}
