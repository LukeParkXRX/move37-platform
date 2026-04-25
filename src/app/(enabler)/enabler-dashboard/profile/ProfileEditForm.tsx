"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface ProfileInitial {
  full_name: string;
  avatar_url: string;
  university: string;
  degree_type: string;
  specialties: string[];
  location: string;
  bio: string;
  credit_rate: number;
}

interface Props {
  initial: ProfileInitial;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-dim)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "var(--color-black)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  padding: "10px 12px",
  color: "var(--color-text)",
  fontSize: "14px",
  fontFamily: "var(--font-body)",
  boxSizing: "border-box",
  outline: "none",
};

const fieldStyle: React.CSSProperties = {
  marginBottom: "20px",
};

export function ProfileEditForm({ initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(initial.full_name);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatar_url);
  const [university, setUniversity] = useState(initial.university);
  const [degreeType, setDegreeType] = useState(initial.degree_type);
  const [specialtiesRaw, setSpecialtiesRaw] = useState(initial.specialties.join(", "));
  const [location, setLocation] = useState(initial.location);
  const [bio, setBio] = useState(initial.bio);
  const [creditRate, setCreditRate] = useState(initial.credit_rate);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSave() {
    if (!fullName.trim()) {
      showToast("error", "이름을 입력해주세요.");
      return;
    }
    if (!Number.isInteger(creditRate) || creditRate < 1) {
      showToast("error", "시간당 크레딧은 1 이상의 정수여야 합니다.");
      return;
    }

    const specialties = specialtiesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      try {
        const [usersRes, enablerRes] = await Promise.all([
          fetch("/api/users/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: fullName, avatar_url: avatarUrl || null }),
          }),
          fetch("/api/users/me/enabler", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ university, degree_type: degreeType, specialties, location, bio, credit_rate: creditRate }),
          }),
        ]);

        const usersData = await usersRes.json() as { error?: string };
        const enablerData = await enablerRes.json() as { error?: string };

        if (!usersRes.ok || !enablerRes.ok) {
          showToast("error", usersData.error ?? enablerData.error ?? "저장 중 오류가 발생했습니다.");
          return;
        }

        showToast("success", "프로필이 저장되었습니다.");
      } catch {
        showToast("error", "네트워크 오류가 발생했습니다.");
      }
    });
  }

  return (
    <>
      {/* 토스트 */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 9999,
          backgroundColor: toast.type === "success" ? "var(--color-accent)" : "var(--color-red, #ef4444)",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "10px",
          fontSize: "14px",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}>
          {toast.message}
        </div>
      )}

      {/* 사진 영역 */}
      <div style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "var(--color-border)",
          overflow: "hidden",
          flexShrink: 0,
          border: "2px solid var(--color-border)",
        }}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="프로필 사진"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-dim)",
              fontSize: "24px",
            }}>
              {fullName?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={labelStyle}>프로필 사진 URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>
      </div>

      {/* 기본 정보 카드 */}
      <div style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "16px",
      }}>
        <p style={{
          fontSize: "13px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: "20px",
        }}>기본 정보</p>

        <div style={fieldStyle}>
          <label style={labelStyle}>이름</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="홍길동"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>위치</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="San Francisco, CA"
            style={inputStyle}
          />
        </div>

        <div style={{ ...fieldStyle, marginBottom: 0 }}>
          <label style={labelStyle}>소개 <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(최대 500자)</span></label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={5}
            placeholder="스타트업에게 소개할 경험과 전문성을 작성해주세요."
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
          <p style={{ fontSize: "11px", color: "var(--color-dim)", marginTop: "4px", textAlign: "right" }}>
            {bio.length} / 500
          </p>
        </div>
      </div>

      {/* 학력 & 전문 분야 카드 */}
      <div style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "16px",
      }}>
        <p style={{
          fontSize: "13px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: "20px",
        }}>학력 &amp; 전문 분야</p>

        <div style={fieldStyle}>
          <label style={labelStyle}>학교</label>
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="Harvard Business School"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>학위</label>
          <input
            type="text"
            value={degreeType}
            onChange={(e) => setDegreeType(e.target.value)}
            placeholder="MBA '25"
            style={inputStyle}
          />
        </div>

        <div style={{ ...fieldStyle, marginBottom: 0 }}>
          <label style={labelStyle}>전문 분야 <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(콤마로 구분)</span></label>
          <input
            type="text"
            value={specialtiesRaw}
            onChange={(e) => setSpecialtiesRaw(e.target.value)}
            placeholder="예: B2B SaaS, Fintech, Marketing"
            style={inputStyle}
          />
        </div>
      </div>

      {/* 요율 카드 */}
      <div style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "32px",
      }}>
        <p style={{
          fontSize: "13px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: "20px",
        }}>요율</p>

        <div style={{ ...fieldStyle, marginBottom: 0 }}>
          <label style={labelStyle}>시간당 크레딧</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="number"
              value={creditRate}
              onChange={(e) => setCreditRate(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min={1}
              step={1}
              style={{ ...inputStyle, width: "120px" }}
            />
            <span style={{ color: "var(--color-dim)", fontSize: "14px" }}>C / 시간</span>
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}>
        <button
          onClick={handleSave}
          disabled={isPending}
          style={{
            flex: 1,
            minWidth: "140px",
            backgroundColor: isPending ? "var(--color-border)" : "var(--color-accent)",
            color: isPending ? "var(--color-dim)" : "#000",
            border: "none",
            borderRadius: "10px",
            padding: "14px 24px",
            fontSize: "14px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            cursor: isPending ? "not-allowed" : "pointer",
            transition: "opacity 0.15s",
          }}
        >
          {isPending ? "저장 중…" : "저장하기"}
        </button>
        <button
          onClick={() => router.push("/enabler-dashboard")}
          disabled={isPending}
          style={{
            flex: 1,
            minWidth: "140px",
            backgroundColor: "transparent",
            color: "var(--color-dim)",
            border: "1px solid var(--color-border)",
            borderRadius: "10px",
            padding: "14px 24px",
            fontSize: "14px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          취소
        </button>
      </div>
    </>
  );
}
