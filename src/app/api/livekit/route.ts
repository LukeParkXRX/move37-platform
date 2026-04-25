import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get("roomName");

    if (!roomName) {
      return NextResponse.json({ error: "roomName is required" }, { status: 400 });
    }

    // Get user profile for display name
    const { data: profile } = await supabase.from("users").select("full_name").eq("id", user.id).single();
    const participantName = (profile as { full_name?: string } | null)?.full_name || user.email || "Participant";

    // 화상 세션은 반드시 예약(booking)에 묶여 있어야 함. room 명은 session-{bookingId} 형식 강제.
    // super_admin은 운영/지원 목적의 임의 room 접근 허용.
    const { data: callerRaw } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    const callerRole = (callerRaw as { role: string | null } | null)?.role;
    const isSuperAdmin = callerRole === "super_admin";

    const sessionMatch = roomName.match(/^session-(.+)$/);
    if (!sessionMatch) {
      if (!isSuperAdmin) {
        return NextResponse.json(
          { error: "Meeting rooms must be linked to a booking" },
          { status: 403 },
        );
      }
    } else {
      const bookingId = sessionMatch[1];
      const { data: bookingRaw } = await supabase
        .from("bookings")
        .select("startup_id, enabler_id, status")
        .eq("id", bookingId)
        .single();

      const booking = bookingRaw as { startup_id: string; enabler_id: string; status: string } | null;

      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      const isParticipant = booking.startup_id === user.id || booking.enabler_id === user.id;
      if (!isParticipant && !isSuperAdmin) {
        return NextResponse.json({ error: "Not a participant of this session" }, { status: 403 });
      }

      if (!["pending", "confirmed"].includes(booking.status)) {
        return NextResponse.json({ error: "Session is not active" }, { status: 400 });
      }
    }

    const livekitUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "LiveKit not configured" }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.id,
      name: participantName,
      ttl: "1h",
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      serverUrl: livekitUrl,
      roomName,
      participantToken: token,
      participantName,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
