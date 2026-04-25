import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ROLE_HOME } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/db/types";
import { MeetingRoom } from "./MeetingRoom";

interface PageProps {
  params: Promise<{ roomName: string }>;
  searchParams: Promise<{ name?: string }>;
}

/**
 * 화상 세션 페이지 — 서버측 1차 가드.
 *
 * 세션은 예약(booking)이 있을 때만 입장 가능. room 명은 `session-{bookingId}` 형식 강제.
 * super_admin은 운영/지원 목적으로 임의 room 진입 허용.
 * /api/livekit이 토큰 발급 단계에서도 동일 검증 (defense in depth).
 */
export default async function MeetingRoomPage({ params, searchParams }: PageProps) {
  const { roomName: rawRoom } = await params;
  const { name } = await searchParams;
  const roomName = decodeURIComponent(rawRoom);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/meeting/${rawRoom}`)}`);
  }

  const { data: callerRaw } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single<{ role: UserRole | null }>();
  const callerRole = callerRaw?.role ?? null;

  if (!callerRole) {
    redirect("/onboarding/role");
  }

  const isSuperAdmin = callerRole === "super_admin";
  const sessionMatch = roomName.match(/^session-(.+)$/);

  if (!sessionMatch) {
    if (!isSuperAdmin) {
      redirect(ROLE_HOME[callerRole]);
    }
  } else {
    const bookingId = sessionMatch[1];
    const { data: bookingRaw } = await supabase
      .from("bookings")
      .select("startup_id, enabler_id, status")
      .eq("id", bookingId)
      .single<{ startup_id: string; enabler_id: string; status: string }>();

    if (!bookingRaw) redirect(ROLE_HOME[callerRole]);

    const isParticipant =
      bookingRaw!.startup_id === user.id || bookingRaw!.enabler_id === user.id;
    if (!isParticipant && !isSuperAdmin) {
      redirect(ROLE_HOME[callerRole]);
    }

    if (!["pending", "confirmed"].includes(bookingRaw!.status)) {
      redirect(ROLE_HOME[callerRole]);
    }
  }

  return <MeetingRoom roomName={roomName} participantName={name ?? "Guest"} />;
}
