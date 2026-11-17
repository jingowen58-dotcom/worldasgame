import { cookies } from "next/headers";
import { hashSecret, id, newSecret } from "@/server/ids";
import { query } from "@/server/db";

const cookieName = "wag_session";
const maxAge = 60 * 60 * 24 * 30;

export type CurrentUser = {
  id: string;
  email: string;
  status: string;
  displayName: string | null;
  locale: string;
  timezone: string | null;
  deletionRequested: boolean;
};

export async function openSession(userId: string) {
  const secret = newSecret();
  await query(
    `INSERT INTO user_sessions (id, user_id, token_hash, expires_at)
     VALUES ($1, $2, $3, now() + interval '30 days')`,
    [id(), userId, secret.hash],
  );
  const jar = await cookies();
  jar.set(cookieName, secret.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function closeSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) {
    await query(
      `UPDATE user_sessions SET revoked_at = now()
       WHERE token_hash = $1 AND revoked_at IS NULL`,
      [hashSecret(token)],
    );
  }
  jar.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function currentUser(): Promise<CurrentUser | null> {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (!token) return null;
  const rows = await query<{
    id: string;
    email: string;
    status: string;
    display_name: string | null;
    locale: string;
    timezone: string | null;
  }>(
    `SELECT users.id, users.email, users.status, user_profiles.display_name,
            user_profiles.locale, user_profiles.timezone
     FROM user_sessions
     JOIN users ON users.id = user_sessions.user_id
     JOIN user_profiles ON user_profiles.user_id = users.id
     WHERE user_sessions.token_hash = $1
       AND user_sessions.revoked_at IS NULL
       AND user_sessions.expires_at > now()
       AND users.deleted_at IS NULL`,
    [hashSecret(token)],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    displayName: row.display_name,
    locale: row.locale,
    timezone: row.timezone,
    deletionRequested: row.status === "deletion_requested",
  };
}
