import { query } from "@/server/db";
import { id } from "@/server/ids";

type ErrorType = "api_failed" | "payment_failed" | "mail_failed";

export async function recordError(input: { type: ErrorType; code: string; message: string }) {
  try {
    await query(
      `INSERT INTO error_logs (id, error_type, code, message)
       VALUES ($1, $2, $3, $4)`,
      [id(), input.type, input.code.slice(0, 80), input.message.replace(/\s+/g, " ").trim().slice(0, 200)],
    );
  } catch (error) {
    console.error(error);
  }
}

export async function listErrors() {
  return query<{ id: string; error_type: string; code: string; message: string; created_at: string }>(
    `SELECT id, error_type, code, message, created_at
     FROM error_logs
     ORDER BY created_at DESC
     LIMIT 50`,
  );
}
