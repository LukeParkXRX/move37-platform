/**
 * 테스트 데이터 시드 스크립트
 * 실행: bun run scripts/seed-test-data.ts
 *
 * 전제조건: migration 007_test_data_flag.sql 이 Supabase 콘솔에서 적용된 상태여야 함.
 * Idempotent: 이미 존재하는 이메일은 createUser 스킵, UPDATE만 수행.
 */

import { createClient } from "@supabase/supabase-js";

// ─── 환경 변수 ───────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "오류: NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경 변수가 없습니다."
  );
  process.exit(1);
}

// ─── Admin 클라이언트 (서비스 롤) ────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── 상수 ────────────────────────────────────────────────────────────────────

const PASSWORD = "Test!GetItDone2026";
const TOTAL_STEPS = 8;

function step(n: number, msg: string) {
  console.log(`[${n}/${TOTAL_STEPS}] ${msg}`);
}

function fail(msg: string, err: unknown): never {
  console.error(`실패: ${msg}`, err);
  process.exit(1);
}

// ─── 기존 auth 유저 맵 로드 ───────────────────────────────────────────────────

async function loadExistingEmails(): Promise<Map<string, string>> {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) fail("auth.admin.listUsers 실패", error);
  const map = new Map<string, string>();
  for (const u of data.users) {
    if (u.email) map.set(u.email, u.id);
  }
  return map;
}

// ─── auth 유저 생성 또는 기존 ID 반환 ────────────────────────────────────────

async function upsertAuthUser(
  email: string,
  fullName: string,
  existingEmails: Map<string, string>
): Promise<string> {
  const existing = existingEmails.get(email);
  if (existing) {
    console.log(`  → 이미 존재: ${email} (${existing}), createUser 스킵`);
    return existing;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error) fail(`createUser 실패: ${email}`, error);
  return data.user.id;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Get It Done Work 테스트 데이터 시드 시작 ===\n");

  // 1. 기존 유저 목록 로드
  step(1, "기존 auth 유저 목록 로드...");
  const existingEmails = await loadExistingEmails();
  console.log(`  → 기존 유저 ${existingEmails.size}명 확인`);

  // ─── 2. Test Sandbox 조직 생성 ─────────────────────────────────────────────
  step(2, "Test Sandbox 조직 생성/확인...");
  const { data: existingOrg, error: orgSelectErr } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", "test-sandbox")
    .maybeSingle();
  if (orgSelectErr) fail("조직 조회 실패", orgSelectErr);

  let orgId: string;
  if (existingOrg) {
    orgId = existingOrg.id;
    console.log(`  → 이미 존재: org_id=${orgId}`);
  } else {
    const { data: newOrg, error: orgInsertErr } = await supabase
      .from("organizations")
      .insert({
        name: "Test Sandbox",
        slug: "test-sandbox",
        program_name: "Test Program",
        invite_code: "TEST-SBOX",
        is_test: true,
        total_credits: 0, // 크레딧은 Step 7에서 함수로 지급
      })
      .select("id")
      .single();
    if (orgInsertErr) fail("조직 INSERT 실패", orgInsertErr);
    orgId = newOrg.id;
    console.log(`  → 생성 완료: org_id=${orgId}`);
  }

  // ─── 3. 테스트 유저 8명 (+ 이네이블러 4명) auth 생성 ────────────────────────
  step(3, "테스트 유저 auth 계정 생성...");

  const userDefs = [
    { email: "test.superadmin.01@getitdonework.test", fullName: "Test Super Admin" },
    { email: "test.orgadmin.01@getitdonework.test", fullName: "Test Org Admin" },
    { email: "test.startup.01@getitdonework.test", fullName: "Test Startup Alpha" },
    { email: "test.startup.02@getitdonework.test", fullName: "Test Startup Beta" },
    { email: "test.startup.03@getitdonework.test", fullName: "Test Startup Gamma" },
    { email: "test.enabler.01@getitdonework.test", fullName: "Test Enabler SaaS" },
    { email: "test.enabler.02@getitdonework.test", fullName: "Test Enabler Fintech" },
    { email: "test.enabler.03@getitdonework.test", fullName: "Test Enabler Healthcare" },
    { email: "test.enabler.04@getitdonework.test", fullName: "Test Enabler Pending" },
  ] as const;

  const ids: Record<string, string> = {};
  for (const def of userDefs) {
    ids[def.email] = await upsertAuthUser(def.email, def.fullName, existingEmails);
  }
  console.log(`  → 총 ${Object.keys(ids).length}명 처리 완료`);

  // ─── 4. public.users 업데이트 (트리거가 기본값만 세팅, role/is_test/org_id 덮어씀) ──
  step(4, "public.users 역할·플래그 업데이트...");

  const superAdminId = ids["test.superadmin.01@getitdonework.test"];
  const orgAdminId = ids["test.orgadmin.01@getitdonework.test"];
  const startup01Id = ids["test.startup.01@getitdonework.test"];
  const startup02Id = ids["test.startup.02@getitdonework.test"];
  const startup03Id = ids["test.startup.03@getitdonework.test"];
  const enabler01Id = ids["test.enabler.01@getitdonework.test"];
  const enabler02Id = ids["test.enabler.02@getitdonework.test"];
  const enabler03Id = ids["test.enabler.03@getitdonework.test"];
  const enabler04Id = ids["test.enabler.04@getitdonework.test"];

  const userUpdates = [
    { id: superAdminId, role: "super_admin", is_test: true, org_id: null, full_name: "Test Super Admin" },
    { id: orgAdminId, role: "org_admin", is_test: true, org_id: orgId, full_name: "Test Org Admin" },
    { id: startup01Id, role: "startup", is_test: true, org_id: null, full_name: "Test Startup Alpha" },
    { id: startup02Id, role: "startup", is_test: true, org_id: null, full_name: "Test Startup Beta" },
    { id: startup03Id, role: "startup", is_test: true, org_id: null, full_name: "Test Startup Gamma" },
    { id: enabler01Id, role: "enabler", is_test: true, org_id: null, full_name: "Test Enabler SaaS" },
    { id: enabler02Id, role: "enabler", is_test: true, org_id: null, full_name: "Test Enabler Fintech" },
    { id: enabler03Id, role: "enabler", is_test: true, org_id: null, full_name: "Test Enabler Healthcare" },
    { id: enabler04Id, role: "enabler", is_test: true, org_id: null, full_name: "Test Enabler Pending" },
  ];

  for (const u of userUpdates) {
    const { error } = await supabase
      .from("users")
      .update({ role: u.role, is_test: u.is_test, org_id: u.org_id, full_name: u.full_name })
      .eq("id", u.id);
    if (error) fail(`users UPDATE 실패: ${u.id}`, error);
  }
  console.log("  → 완료");

  // ─── 5. 프로파일 생성 (startup_profiles, enabler_profiles) ──────────────────
  step(5, "startup_profiles / enabler_profiles UPSERT...");

  // startup_profiles
  const startupProfiles = [
    {
      user_id: startup01Id,
      company_name: "Alpha B2B",
      industry: ["B2B SaaS"],
      stage: "Seed",
      us_goal: "Expand B2B SaaS GTM",
      credit_balance: 100,
      org_id: orgId,
    },
    {
      user_id: startup02Id,
      company_name: "Beta Fintech",
      industry: ["Fintech"],
      stage: "Series A",
      us_goal: "Raise US round",
      credit_balance: 50,
      org_id: null,
    },
    {
      user_id: startup03Id,
      company_name: "Gamma Health",
      industry: ["Healthcare"],
      stage: "Series B",
      us_goal: "FDA + US launch",
      credit_balance: 80,
      org_id: orgId,
    },
  ];

  for (const sp of startupProfiles) {
    const { error } = await supabase
      .from("startup_profiles")
      .upsert(sp, { onConflict: "user_id" });
    if (error) fail(`startup_profiles UPSERT 실패: ${sp.user_id}`, error);
  }

  // enabler_profiles
  const enablerProfiles = [
    {
      user_id: enabler01Id,
      university: "Stanford GSB",
      degree_type: "MBA '24",
      specialties: ["B2B SaaS", "Go-to-Market", "Partnerships"],
      location: "San Francisco, CA",
      bio: "Test enabler for B2B SaaS scenarios.",
      credit_rate: 2,
      badge_level: "top_rated",
      status: "approved",
      rating: 4.8,
      session_count: 20,
      enabler_score: 90,
    },
    {
      user_id: enabler02Id,
      university: "Wharton",
      degree_type: "MBA '23",
      specialties: ["Fintech", "Fundraising", "IR Strategy"],
      location: "New York, NY",
      bio: "Test enabler for Fintech scenarios.",
      credit_rate: 3,
      badge_level: "top_rated",
      status: "approved",
      rating: 4.7,
      session_count: 15,
      enabler_score: 88,
    },
    {
      user_id: enabler03Id,
      university: "Columbia Business",
      degree_type: "MBA '24",
      specialties: ["Healthcare", "Regulatory", "BD"],
      location: "Boston, MA",
      bio: "Test enabler for Healthcare scenarios.",
      credit_rate: 2,
      badge_level: "verified",
      status: "approved",
      rating: 4.6,
      session_count: 10,
      enabler_score: 85,
    },
    {
      user_id: enabler04Id,
      university: "MIT Sloan",
      degree_type: "MBA '25",
      specialties: ["AI/DeepTech", "Product Strategy"],
      location: "Cambridge, MA",
      bio: "Pending enabler for approval UI tests.",
      credit_rate: 3,
      badge_level: "rising_star",
      status: "pending",
      rating: 0,
      session_count: 0,
      enabler_score: 0,
    },
  ];

  for (const ep of enablerProfiles) {
    const { error } = await supabase
      .from("enabler_profiles")
      .upsert(ep, { onConflict: "user_id" });
    if (error) fail(`enabler_profiles UPSERT 실패: ${ep.user_id}`, error);
  }
  console.log("  → 완료");

  // ─── 6. 예약 4건 INSERT ───────────────────────────────────────────────────────
  step(6, "bookings INSERT...");

  const now = new Date();
  const dayMs = 86400 * 1000;

  const bookingDefs = [
    {
      key: "pending",
      startup_id: startup01Id,
      enabler_id: enabler01Id,
      type: "chemistry",
      status: "pending",
      scheduled_at: new Date(now.getTime() + 3 * dayMs).toISOString(),
      credits_amount: 0,
      brief: "첫 만남 테스트",
    },
    {
      key: "confirmed",
      startup_id: startup02Id,
      enabler_id: enabler02Id,
      type: "standard",
      status: "confirmed",
      scheduled_at: new Date(now.getTime() + 7 * dayMs).toISOString(),
      credits_amount: 3,
      brief: "IR 전략 상담",
    },
    {
      key: "completed",
      startup_id: startup03Id,
      enabler_id: enabler03Id,
      type: "standard",
      status: "completed",
      scheduled_at: new Date(now.getTime() - 14 * dayMs).toISOString(),
      credits_amount: 2,
      brief: "FDA 규제 검토",
      completed_at: new Date(now.getTime() - 13 * dayMs).toISOString(),
    },
    {
      key: "cancelled",
      startup_id: startup01Id,
      enabler_id: enabler02Id,
      type: "standard",
      status: "cancelled",
      scheduled_at: new Date(now.getTime() - 5 * dayMs).toISOString(),
      credits_amount: 3,
      brief: "취소된 세션",
      cancelled_at: new Date(now.getTime() - 6 * dayMs).toISOString(),
      cancel_reason: "일정 변경",
    },
  ];

  // 기존 테스트 예약 확인 (startup_id 기준)
  const { data: existingBookings, error: bookingSelectErr } = await supabase
    .from("bookings")
    .select("id, startup_id, enabler_id, status")
    .in("startup_id", [startup01Id, startup02Id, startup03Id]);
  if (bookingSelectErr) fail("bookings 조회 실패", bookingSelectErr);

  const bookingIds: Record<string, string> = {};

  for (const bd of bookingDefs) {
    const { key, ...row } = bd;
    const already = existingBookings?.find(
      (b) => b.startup_id === row.startup_id && b.enabler_id === row.enabler_id && b.status === row.status
    );
    if (already) {
      console.log(`  → 이미 존재: booking(${key}), id=${already.id}`);
      bookingIds[key] = already.id;
    } else {
      const { data: newBooking, error: bookingInsertErr } = await supabase
        .from("bookings")
        .insert(row)
        .select("id")
        .single();
      if (bookingInsertErr) fail(`booking INSERT 실패: ${key}`, bookingInsertErr);
      bookingIds[key] = newBooking.id;
      console.log(`  → 생성: booking(${key}), id=${newBooking.id}`);
    }
  }

  // ─── 7. 크레딧 트랜잭션 INSERT ───────────────────────────────────────────────
  step(7, "credit_transactions INSERT...");

  // 기존 크레딧 TX 확인 (중복 방지: org_id + tx_type + description)
  const { data: existingTx, error: txSelectErr } = await supabase
    .from("credit_transactions")
    .select("id, tx_type, description, org_id, startup_id")
    .eq("org_id", orgId);
  if (txSelectErr) fail("credit_transactions 조회 실패", txSelectErr);

  const hasTx = (txType: string, description: string) =>
    existingTx?.some((t) => t.tx_type === txType && t.description === description) ?? false;

  // 7-1. purchase: Sandbox 조직에 +1000
  if (!hasTx("purchase", "테스트 시드 초기 지급")) {
    const { error } = await supabase.rpc("grant_credits_to_org", {
      p_org_id: orgId,
      p_amount: 1000,
      p_description: "테스트 시드 초기 지급",
    });
    if (error) fail("grant_credits_to_org 실패", error);
    console.log("  → purchase +1000 완료");
  } else {
    console.log("  → purchase 이미 존재, 스킵");
  }

  // 7-2. allocate: Sandbox → startup.01 +100
  if (!hasTx("allocate", "Alpha B2B 크레딧 배분")) {
    const { error } = await supabase.rpc("allocate_credits_to_startup", {
      p_org_id: orgId,
      p_startup_id: startup01Id,
      p_amount: 100,
      p_description: "Alpha B2B 크레딧 배분",
    });
    if (error) fail("allocate startup01 실패", error);
    console.log("  → allocate startup01 +100 완료");
  } else {
    console.log("  → allocate startup01 이미 존재, 스킵");
  }

  // 7-3. allocate: Sandbox → startup.03 +80
  if (!hasTx("allocate", "Gamma Health 크레딧 배분")) {
    const { error } = await supabase.rpc("allocate_credits_to_startup", {
      p_org_id: orgId,
      p_startup_id: startup03Id,
      p_amount: 80,
      p_description: "Gamma Health 크레딧 배분",
    });
    if (error) fail("allocate startup03 실패", error);
    console.log("  → allocate startup03 +80 완료");
  } else {
    console.log("  → allocate startup03 이미 존재, 스킵");
  }

  // 7-4. use: startup03 completed booking -2 (balance_after=78)
  const hasTxStartup03Use = existingTx?.some(
    (t) => t.tx_type === "use" && t.startup_id === startup03Id
  ) ?? false;
  if (!hasTxStartup03Use) {
    const { error } = await supabase.from("credit_transactions").insert({
      tx_type: "use",
      amount: 2,
      startup_id: startup03Id,
      booking_id: bookingIds["completed"],
      description: "FDA 규제 검토 세션 사용",
      balance_after: 78,
    });
    if (error) fail("credit_transactions use INSERT 실패", error);
    console.log("  → use -2 (startup03) 완료");
  } else {
    console.log("  → use startup03 이미 존재, 스킵");
  }

  // 7-5. hold: startup02 confirmed booking -3 (balance_after=47)
  const hasTxStartup02Hold = existingTx?.some(
    (t) => t.tx_type === "hold" && t.startup_id === startup02Id
  ) ?? false;
  if (!hasTxStartup02Hold) {
    const { error } = await supabase.from("credit_transactions").insert({
      tx_type: "hold",
      amount: 3,
      startup_id: startup02Id,
      booking_id: bookingIds["confirmed"],
      description: "IR 전략 상담 크레딧 홀드",
      balance_after: 47,
    });
    if (error) fail("credit_transactions hold INSERT 실패", error);
    console.log("  → hold -3 (startup02) 완료");
  } else {
    console.log("  → hold startup02 이미 존재, 스킵");
  }

  // ─── 8. 완료 보고 ──────────────────────────────────────────────────────────
  step(8, "완료 검증...");
  console.log("\n=== 시드 완료 ===");
  console.log(`조직 ID  : ${orgId}`);
  console.log("계정 목록:");
  for (const [email, id] of Object.entries(ids)) {
    console.log(`  ${email} → ${id}`);
  }
}

main().catch((err) => {
  console.error("예상치 못한 오류:", err);
  process.exit(1);
});
