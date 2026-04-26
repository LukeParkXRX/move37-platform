import { Resend } from "resend";
import type { EmailPayload } from "./emails/templates";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://getitdonework.com";

export async function sendEmail(
  to: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: EmailPayload<any>
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resend) return { ok: false, error: "RESEND_API_KEY 미설정" };
  try {
    const { error } = await resend.emails.send({
      from: `Get It Done at Work <${FROM}>`,
      to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "알 수 없는 오류" };
  }
}
