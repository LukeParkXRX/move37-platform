import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data, error } = await db.from("bookings").select("*").eq("id", id).single();
    if (error) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ booking: data });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // 권한 검증: booking 조회 후 startup_id 또는 enabler_id 일치 확인
    const { data: booking, error: bookingError } = await db
      .from("bookings")
      .select("id, startup_id, enabler_id, status")
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isStartup = booking.startup_id === user.id;
    const isEnabler = booking.enabler_id === user.id;

    if (!isStartup && !isEnabler) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, cancel_reason } = body as { status: string; cancel_reason?: string };

    if (status === "confirmed") {
      // Enabler만 수락 가능
      if (!isEnabler) {
        return NextResponse.json({ error: "Forbidden: Enabler만 수락할 수 있습니다" }, { status: 403 });
      }
      const { data, error } = await db
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ booking: data });
    }

    if (status === "cancelled") {
      // pending 또는 confirmed 상태만 취소 가능
      if (booking.status !== "pending" && booking.status !== "confirmed") {
        return NextResponse.json(
          { error: `취소할 수 없는 상태입니다: ${booking.status}` },
          { status: 400 },
        );
      }
      const reason = cancel_reason || "예약 취소";
      const { error: rpcError } = await db.rpc("release_credits", {
        p_booking_id: id,
        p_reason: reason,
      });
      if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 });

      const { data, error: updateError } = await db
        .from("bookings")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancel_reason: reason,
        })
        .eq("id", id)
        .select()
        .single();
      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
      return NextResponse.json({ booking: data });
    }

    if (status === "completed") {
      const { error } = await db.rpc("confirm_credits", { p_booking_id: id });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      const { data } = await db.from("bookings").select("*").eq("id", id).single();
      return NextResponse.json({ booking: data });
    }

    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const body = await request.json().catch(() => ({}));
    const reason = (body as Record<string, string>).reason || "사용자 취소";

    const { error } = await db.rpc("release_credits", { p_booking_id: id, p_reason: reason });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data } = await db.from("bookings").select("*").eq("id", id).single();
    return NextResponse.json({ booking: data });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
