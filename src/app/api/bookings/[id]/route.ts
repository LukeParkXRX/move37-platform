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
    const body = await request.json();
    const { status } = body;

    if (status === "confirmed") {
      const { data, error } = await db.from("bookings").update({ status: "confirmed" }).eq("id", id).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
