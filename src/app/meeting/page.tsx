"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MeetingLobby() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

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
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-black)" }}
    >
      {/* 헤더 */}
      <header
        className="h-14 flex items-center px-5 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "oklch(0.1 0 0)",
              fontFamily: "var(--font-display)",
            }}
          >
            M
          </span>
          <span
            className="text-[16px] font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            Move 37
          </span>
        </Link>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* 타이틀 */}
          <div className="text-center space-y-2">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ backgroundColor: "var(--color-accent-dim)" }}
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
              className="text-3xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              화상 미팅
            </h1>
            <p style={{ color: "var(--color-dim)", fontSize: "15px" }}>
              Enabler와 실시간으로 만나 프로젝트를 논의하세요
            </p>
          </div>

          {/* 입력 폼 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                className="block text-sm"
                style={{ color: "var(--color-dim)" }}
              >
                이름
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="표시될 이름을 입력하세요"
                className="w-full px-4 py-3 rounded-xl text-[15px] outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              />
            </div>

            {/* 새 미팅 만들기 */}
            <button
              onClick={handleCreateRoom}
              disabled={!userName.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-[15px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "oklch(0.1 0 0)",
                fontFamily: "var(--font-display)",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {isCreating ? "입장 중..." : "새 미팅 만들기"}
            </button>

            {/* 구분선 */}
            <div className="flex items-center gap-4">
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "var(--color-border)" }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--color-dim)" }}
              >
                또는 기존 미팅 참가
              </span>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "var(--color-border)" }}
              />
            </div>

            {/* 기존 방 입장 */}
            <div className="space-y-2">
              <label
                className="block text-sm"
                style={{ color: "var(--color-dim)" }}
              >
                미팅 코드
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="미팅 코드를 입력하세요"
                className="w-full px-4 py-3 rounded-xl text-[15px] outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJoinRoom();
                }}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={!roomName.trim() || !userName.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-[15px] border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.borderColor = "var(--color-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
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
