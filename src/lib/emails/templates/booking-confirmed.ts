import { baseEmail, textStyles, infoCard, highlightBox } from "./_layout";
import type { EmailPayload } from "./welcome";

export type SessionType = "Chemistry" | "Standard" | "Project";
export type BookingParticipantRole = "startup" | "enabler";

export type BookingConfirmedInput = {
  recipientName: string;
  recipientRole: BookingParticipantRole;
  counterpartName: string;
  sessionType: SessionType;
  sessionDatetime: string; // "2025년 5월 15일 (목) 오후 3:00"
  creditsCharged: number; // 0이면 무료 (Chemistry)
  livekitUrl: string;
  briefPreview?: string; // 사전 브리프 미리보기 (최대 200자)
  bookingId: string;
};

const SESSION_LABEL: Record<SessionType, string> = {
  Chemistry: "케미스트리 세션 (무료)",
  Standard: "스탠다드 세션",
  Project: "프로젝트 세션",
};

export function bookingConfirmedEmail(
  input: BookingConfirmedInput
): EmailPayload<BookingConfirmedInput> {
  const {
    recipientName,
    recipientRole,
    counterpartName,
    sessionType,
    sessionDatetime,
    creditsCharged,
    livekitUrl,
    briefPreview,
    bookingId,
  } = input;

  const isStartup = recipientRole === "startup";
  const counterpartLabel = isStartup ? "Enabler" : "스타트업";

  const subject = `예약 확정: ${counterpartName} ${counterpartLabel}와의 ${SESSION_LABEL[sessionType]}`;

  const children = `
    <h1 style="${textStyles.h1}">예약이 확정되었습니다.</h1>

    <p style="${textStyles.body}">
      ${recipientName}님, <strong>${counterpartName}</strong> ${counterpartLabel}와의 세션이 성공적으로 예약되었습니다.
      아래 정보를 확인하고, 세션 전에 준비를 마쳐주세요.
    </p>

    ${infoCard([
      { label: "세션 유형", value: SESSION_LABEL[sessionType] },
      { label: "상대방", value: `${counterpartName} (${counterpartLabel})` },
      { label: "일시", value: sessionDatetime },
      { label: "차감 크레딧", value: creditsCharged === 0 ? "무료" : `${creditsCharged} 크레딧` },
      { label: "예약 ID", value: bookingId },
    ])}

    ${briefPreview
      ? `<h2 style="${textStyles.h2}">사전 브리프 미리보기</h2>
         <p style="${textStyles.body}; background-color: #f9fafb; border-radius: 8px; padding: 14px 18px; font-size: 14px; color: #374151;">
           ${briefPreview}
         </p>`
      : ""}

    ${highlightBox(
      `<strong>세션 입장 링크</strong><br />
       세션 15분 전부터 입장 가능합니다. 세션 직전 리마인더 이메일을 별도 발송해 드립니다.<br /><br />
       <a href="${livekitUrl}" style="color: #5c7a00; font-weight: 700; word-break: break-all;">${livekitUrl}</a>`
    )}

    <p style="${textStyles.muted}; margin-top: 24px;">
      예약 취소 또는 일정 변경은 세션 24시간 전까지 가능합니다.
      <a href="https://getitdonework.com/refund" style="color: #6b7280; text-decoration: underline;">취소·환불 정책 보기</a>
    </p>
  `;

  const html = baseEmail({
    preheader: `${counterpartName} ${counterpartLabel}와의 ${SESSION_LABEL[sessionType]} — ${sessionDatetime}`,
    title: subject,
    children,
    ctaButton: {
      label: "세션 입장하기",
      href: livekitUrl,
    },
  });

  const text = `
예약 확정: ${counterpartName} ${counterpartLabel}와의 ${SESSION_LABEL[sessionType]}

${recipientName}님, 세션이 성공적으로 예약되었습니다.

세션 유형: ${SESSION_LABEL[sessionType]}
상대방: ${counterpartName} (${counterpartLabel})
일시: ${sessionDatetime}
차감 크레딧: ${creditsCharged === 0 ? "무료" : `${creditsCharged} 크레딧`}
예약 ID: ${bookingId}

${briefPreview ? `사전 브리프 미리보기:\n${briefPreview}\n` : ""}
세션 입장 링크: ${livekitUrl}

세션 15분 전 리마인더 이메일을 별도 발송해 드립니다.
취소·환불 정책: https://getitdonework.com/refund

---
Get It Done at Work
https://getitdonework.com
  `.trim();

  return { subject, html, text, props: input };
}
