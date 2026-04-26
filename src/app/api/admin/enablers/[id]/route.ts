import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // API 레벨 권한 검증 (layout 가드와 별개로 이중 확인)
    const { data: profile } = await db
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // body: { status: "approved" | "pending" | "suspended" }
    // reason은 받지만 별도 컬럼 없음 — 심사 이력 테이블 신설 전까진 client memory에만 보관.
    const body = await request.json();
    const { status } = body as { status: string };

    if (!["approved", "pending", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await db
      .from("enabler_profiles")
      .update({ status })
      .eq("user_id", id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data || data.length === 0) {
      // RLS 차단 또는 대상 미존재 → silent fail 방지
      return NextResponse.json(
        { error: "변경할 수 없습니다. 권한 또는 대상 확인 필요" },
        { status: 403 },
      );
    }
    return NextResponse.json({ enabler: data[0] });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
