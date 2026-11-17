import { randomUUID } from "node:crypto";
import { recordError } from "@/server/errors";
import { allowRequest, requestAddress } from "@/server/rate-limit";

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  return new URL(origin).host === host;
}

export function apiOk(data: unknown, status = 200) {
  return Response.json({ success: true, data, error: null, request_id: randomUUID() }, { status });
}

export function guard(request: Request, bucket: string) {
  if (!sameOrigin(request)) return apiError("FORBIDDEN", "Request origin was rejected.", 403);
  if (!allowRequest(`${bucket}:${requestAddress(request)}`)) {
    return apiError("RATE_LIMITED", "Too many attempts. Try again later.", 429);
  }
  return null;
}

export function apiError(code: string, message: string, status: number, kind?: "payment") {
  if (kind === "payment" || status >= 500) {
    void recordError({
      type: kind === "payment" ? "payment_failed" : "api_failed",
      code,
      message,
    });
  }
  return Response.json(
    { success: false, data: null, error: { code, message }, request_id: randomUUID() },
    { status },
  );
}
