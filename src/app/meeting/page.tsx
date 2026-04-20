"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MeetingLobby() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleJoinRoom = () => {
    if (!roomName.trim() || !userName.trim()) return;
    const encoded = encodeURIComponent(roomName.trim());
    router.push(`/meeting/${encoded}?name=${encodeURIComponent(userName.trim())}`);
  };

  const handleCreateRoom = () => {
    if (!userName.trim()) return;
    setIsCreating(true);
    const id = `room-${Date.now().toString(36)}`;
    router.push(`/meeting/${id}?name=${encodeURIComponent(userName.trim())}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-black)",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
          paddingRight: "20px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              fontWeight: 700,
              fontSize: "14px",
              backgroundColor: "var(--color-accent)",
              color: "oklch(0.1 0 0)",
              fontFamily: "var(--font-display)",
            }}
          >
            M
          </span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            Get It Done
          </span>
        </Link>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "420px", margin: "0 auto" }}>
          {/* 타이틀 */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                marginBottom: "16px",
                backgroundColor: "var(--color-accent-dim)",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 8-6 4 6 4V8Z" />
                <rect x="2" y="6" width="14" height="12" rx="2" />
              </svg>
            </div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
                margin: "0 0 8px 0",
              }}
            >
              화상 미팅
            </h1>
            <p style={{ color: "var(--color-dim)", fontSize: "15px", margin: 0 }}>
              Enabler와 실시간으로 만나 프로젝트를 논의하세요
            </p>
          </div>

          {/* 입력 폼 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* 이름 */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "var(--color-dim)",
                  marginBottom: "6px",
                }}
              >
                이름
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="표시될 이름을 입력하세요"
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  backgroundColor: "var(--color-card)",
                  border: `1px solid ${focusedField === "name" ? "var(--color-accent)" : "var(--color-border)"}`,
                  color: "var(--color-text)",
                  fontFamily: "var(--font-body)",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {/* 새 미팅 만들기 */}
            <button
              onClick={handleCreateRoom}
              disabled={!userName.trim()}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: userName.trim() ? "pointer" : "not-allowed",
                backgroundColor: "var(--color-accent)",
                color: "oklch(0.1 0 0)",
                fontFamily: "var(--font-display)",
                opacity: userName.trim() ? 1 : 0.4,
                transition: "opacity 0.2s",
              }}
            >
              {isCreating ? "입장 중..." : "새 미팅 만들기"}
            </button>

            {/* 구분선 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                margin: "4px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
              <span style={{ fontSize: "12px", color: "var(--color-dim)", whiteSpace: "nowrap" }}>
                또는 기존 미팅 참가
              </span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
            </div>

            {/* 미팅 코드 */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "var(--color-dim)",
                  marginBottom: "6px",
                }}
              >
                미팅 코드
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="미팅 코드를 입력하세요"
                onFocus={() => setFocusedField("room")}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJoinRoom();
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  backgroundColor: "var(--color-card)",
                  border: `1px solid ${focusedField === "room" ? "var(--color-accent)" : "var(--color-border)"}`,
                  color: "var(--color-text)",
                  fontFamily: "var(--font-body)",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {/* 미팅 참가 */}
            <button
              onClick={handleJoinRoom}
              disabled={!roomName.trim() || !userName.trim()}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: roomName.trim() && userName.trim() ? "pointer" : "not-allowed",
                backgroundColor: "transparent",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
                opacity: roomName.trim() && userName.trim() ? 1 : 0.4,
                transition: "border-color 0.2s, opacity 0.2s",
              }}
            >
              미팅 참가
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
