import { query } from "@/server/db";
import { id } from "@/server/ids";

const allowedMetadata = ["orderId", "orderNo", "productId"] as const;

type EventType =
  | "signup_completed"
  | "login_completed"
  | "order_created"
  | "payment_started"
  | "payment_confirmed";

export async function recordEvent(input: {
  type: EventType;
  userId?: string | null;
  metadata?: Partial<Record<(typeof allowedMetadata)[number], string>>;
}) {
  try {
    const metadata = input.metadata
      ? JSON.stringify(
          Object.fromEntries(
            allowedMetadata.flatMap((key) => (input.metadata?.[key] ? [[key, input.metadata[key]]] : [])),
          ),
        )
      : null;
    await query(
      `INSERT INTO analytics_events (id, event_type, user_id, source, metadata)
       VALUES ($1, $2, $3, 'web', $4)`,
      [id(), input.type, input.userId ?? null, metadata === "{}" ? null : metadata],
    );
  } catch (error) {
    console.error(error);
  }
}

export async function listEvents() {
  return query<{
    event_type: string;
    email: string | null;
    metadata: string | null;
    created_at: string;
  }>(
    `SELECT analytics_events.event_type, users.email, analytics_events.metadata, analytics_events.created_at
     FROM analytics_events
     LEFT JOIN users ON users.id = analytics_events.user_id
     ORDER BY analytics_events.created_at DESC
     LIMIT 50`,
  );
}

export function orderNoFromMetadata(metadata: string | null) {
  if (!metadata) return "";
  try {
    const parsed = JSON.parse(metadata) as { orderNo?: string };
    return parsed.orderNo ?? "";
  } catch {
    return "";
  }
}
