import { recordError } from "@/server/errors";
import { id } from "@/server/ids";
import { query } from "@/server/db";

type MailInput = {
  to: string;
  subject: string;
  text: string;
  userId: string | null;
  template: string;
};

export async function sendMail(input: MailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  let status = "logged";

  if (apiKey && from) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [input.to],
          subject: input.subject,
          text: input.text,
        }),
      });
      status = response.ok ? "sent" : "failed";
    } catch (error) {
      console.error(error);
      status = "failed";
    }
  } else {
    console.info(`[mail:${input.template}] ${input.to}\n${input.text}`);
  }

  await query(
    `INSERT INTO email_logs (id, user_id, template, to_address, status)
     VALUES ($1, $2, $3, $4, $5)`,
    [id(), input.userId, input.template, input.to, status],
  );
  if (status === "failed") {
    await recordError({
      type: "mail_failed",
      code: input.template,
      message: "The mail provider did not accept this message.",
    });
  }

  return { delivered: status === "sent" };
}

export async function listEmailLogs() {
  return query<{ template: string; to_address: string; status: string; created_at: string }>(
    `SELECT template, to_address, status, created_at
     FROM email_logs
     ORDER BY created_at DESC
     LIMIT 30`,
  );
}

export function appUrl() {
  return process.env.APP_URL || "http://127.0.0.1:3000";
}
