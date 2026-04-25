/**
 * 테스트 데이터 클리어 스크립트
 * 실행: bun run scripts/clear-test-data.ts [--yes]
 *
 * --yes 플래그 없으면 삭제 전 confirm 프롬프트 표시.
 * is_test=true인 users + organizations 삭제 (CASCADE로 관련 데이터 자동 정리).
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

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function fail(msg: string, err: unknown): never {
  console.error(`실패: ${msg}`, err);
  process.exit(1);
}

// ─── confirm 프롬프트 ────────────────────────────────────────────────────────

async function confirm(): Promise<boolean> {
  process.stdout.write("테스트 데이터를 모두 삭제하시겠습니까? (y/n): ");
  return new Promise((resolve) => {
    process.stdin.setEncoding("utf8");
    process.stdin.once("data", (chunk) => {
      const answer = String(chunk).trim().toLowerCase();
      resolve(answer === "y" || answer === "yes");
    });
  });
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

async function main() {
  const autoYes = process.argv.includes("--yes");

  if (!autoYes) {
    const ok = await confirm();
    if (!ok) {
      console.log("취소됨.");
      process.exit(0);
    }
  }

  console.log("\n=== 테스트 데이터 삭제 시작 ===\n");

  // 1. is_test=true 유저 목록 조회 (auth 삭제를 위해 id 수집)
  const { data: testUsers, error: usersSelectErr } = await supabase
    .from("users")
    .select("id")
    .eq("is_test", true);
  if (usersSelectErr) fail("users 조회 실패", usersSelectErr);

  const testUserIds = (testUsers ?? []).map((u) => u.id);
  console.log(`[1/3] 삭제 대상 테스트 유저: ${testUserIds.length}명`);

  // 2. public.users 삭제 (CASCADE로 profiles, bookings 등 자동 삭제)
  //    auth.users는 별도로 admin API로 삭제
  let deletedUsers = 0;
  if (testUserIds.length > 0) {
    const { error: usersDeleteErr } = await supabase
      .from("users")
      .delete()
      .eq("is_test", true);
    if (usersDeleteErr) fail("users DELETE 실패", usersDeleteErr);
    deletedUsers = testUserIds.length;

    // auth.users 삭제
    for (const uid of testUserIds) {
      const { error: authDeleteErr } = await supabase.auth.admin.deleteUser(uid);
      if (authDeleteErr) {
        console.warn(`  경고: auth 유저 삭제 실패 (${uid}):`, authDeleteErr.message);
      }
    }
    console.log(`[2/3] public.users + auth.users ${deletedUsers}건 삭제 완료`);
  } else {
    console.log("[2/3] 삭제할 테스트 유저 없음");
  }

  // 3. is_test=true 조직 삭제
  const { data: deletedOrgs, error: orgsDeleteErr } = await supabase
    .from("organizations")
    .delete()
    .eq("is_test", true)
    .select("id");
  if (orgsDeleteErr) fail("organizations DELETE 실패", orgsDeleteErr);
  const deletedOrgCount = (deletedOrgs ?? []).length;
  console.log(`[3/3] organizations ${deletedOrgCount}건 삭제 완료`);

  console.log("\n=== 삭제 완료 ===");
  console.log(`유저: ${deletedUsers}건, 조직: ${deletedOrgCount}건 삭제됨`);
}

main().catch((err) => {
  console.error("예상치 못한 오류:", err);
  process.exit(1);
});
