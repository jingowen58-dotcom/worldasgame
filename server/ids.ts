import { createHash, randomBytes, randomUUID } from "node:crypto";

export function id() {
  return randomUUID();
}

export function newSecret() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashSecret(token) };
}

export function hashSecret(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function passwordProblem(password: string) {
  if (password.length < 8) return "PASSWORD_TOO_SHORT";
  if (password.length > 128) return "PASSWORD_TOO_LONG";
  return null;
}
