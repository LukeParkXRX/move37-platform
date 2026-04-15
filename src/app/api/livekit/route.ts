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

    // Validate booking access if room follows session pattern
    const sessionMatch = roomName.match(/^session-(.+)$/);
    if (sessionMatch) {
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

      if (booking.startup_id !== user.id && booking.enabler_id !== user.id) {
        // Allow super_admin too
        const { data: adminCheckRaw } = await supabase.from("users").select("role").eq("id", user.id).single();
        const adminCheck = adminCheckRaw as { role: string } | null;
        if (adminCheck?.role !== "super_admin") {
          return NextResponse.json({ error: "Not a participant of this session" }, { status: 403 });
        }
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
