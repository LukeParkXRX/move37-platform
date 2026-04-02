"use client";

import { useEffect, useState, useCallback } from "react";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import Link from "next/link";

interface ConnectionDetails {
  serverUrl: string;
  participantToken: string;
  roomName: string;
  participantName: string;
}

interface MeetingRoomProps {
  roomName: string;
  participantName: string;
}

export function MeetingRoom({ roomName, participantName }: MeetingRoomProps) {
  const [connection, setConnection] = useState<ConnectionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/meeting/${encodeURIComponent(roomName)}`
    : "";

  const handleCopyInvite = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = inviteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [inviteUrl]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(
          `/api/livekit?roomName=${encodeURIComponent(roomName)}&participantName=${encodeURIComponent(participantName)}`
        );
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "연결에 실패했습니다.");
          return;
        }
        const data: ConnectionDetails = await res.json();
        setConnection(data);
      } catch {
        setError("서버에 연결할 수 없습니다.");
      }
    };
    fetchToken();
  }, [roomName, participantName]);

  const handleDisconnected = useCallback(() => {
    window.location.href = "/meeting";
  }, []);

  // 에러 상태
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-black)" }}
      >
        <div className="text-center space-y-4 max-w-sm px-5">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{ backgroundColor: "oklch(0.63 0.2 25 / 0.1)" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-red)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
          >
            연결 실패
          </h2>
          <p className="text-sm" style={{ color: "var(--color-dim)" }}>
            {error}
          </p>
          <Link
            href="/meeting"
            className="inline-block mt-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-opacity duration-200"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "oklch(0.1 0 0)",
              fontFamily: "var(--font-display)",
            }}
          >
            로비로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (!connection) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-black)" }}
      >
        <div className="text-center space-y-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto"
            style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--color-dim)" }}>
            미팅에 연결하는 중...
          </p>
        </div>
      </div>
    );
  }

  // 미팅룸
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-black)" }}>
      {/* 초대 링크 바 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "10px 20px",
          backgroundColor: "var(--color-dark)",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "13px", color: "var(--color-dim)" }}>
          초대 링크:
        </span>
        <code
          style={{
            fontSize: "13px",
            color: "var(--color-text)",
            backgroundColor: "var(--color-card)",
            padding: "4px 12px",
            borderRadius: "6px",
            border: "1px solid var(--color-border)",
            maxWidth: "400px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {inviteUrl}
        </code>
        <button
          onClick={handleCopyInvite}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            backgroundColor: copied ? "var(--color-green)" : "var(--color-accent)",
            color: "oklch(0.1 0 0)",
            fontFamily: "var(--font-display)",
            transition: "background-color 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "복사됨!" : "링크 복사"}
        </button>
      </div>

      {/* LiveKit 미팅 */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <LiveKitRoom
          token={connection.participantToken}
          serverUrl={connection.serverUrl}
          video={true}
          audio={true}
          onDisconnected={handleDisconnected}
          style={{ height: "100%" }}
          data-lk-theme="default"
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
}
