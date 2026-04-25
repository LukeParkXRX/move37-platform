-- ═══════════════════════════════════════════════════════
-- Migration 008: Enabler RLS for booked startup profiles
-- ═══════════════════════════════════════════════════════
-- 문제: Enabler 대시보드에서 매칭 요청 카드를 렌더할 때
-- bookings → users → startup_profiles 임베드 조인이 빈 값으로 떨어짐.
-- 원인: startup_profiles의 SELECT RLS가 본인/super_admin/org_admin만
-- 허용하고 enabler는 차단됨.
--
-- 해결: enabler는 자기에게 booking이 있는 startup에 한해 profile SELECT 허용.
-- 단, role은 자유롭게 변경 가능하므로 user_id가 booking.enabler_id에
-- 직접 일치하는지로 판정 (enabler 역할 검증은 booking 자체로 충분).
--
-- 참고: PostgreSQL은 같은 테이블에 여러 SELECT 정책을 OR로 병합하므로
-- 기존 startup_select_own 정책은 그대로 두고 신규 정책만 추가.
-- ═══════════════════════════════════════════════════════

CREATE POLICY "startup_select_via_booking"
  ON startup_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.startup_id = startup_profiles.user_id
        AND bookings.enabler_id = auth.uid()
    )
  );
