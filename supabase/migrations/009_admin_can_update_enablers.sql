-- ═══════════════════════════════════════════════════════
-- Migration 009: Super admin can update enabler_profiles
-- ═══════════════════════════════════════════════════════
-- 문제: enabler_update_own 정책이 본인만 UPDATE 허용 →
-- super_admin이 /admin/enablers에서 status를 바꾸려 해도
-- 0 row affected로 silently 실패함.
--
-- 해결: super_admin role을 가진 사용자는 모든 enabler_profiles
-- 를 UPDATE 할 수 있도록 별도 정책 추가.
--
-- 같은 테이블에 여러 UPDATE 정책은 PostgreSQL이 OR로 병합.
-- ═══════════════════════════════════════════════════════

CREATE POLICY "enabler_update_super_admin"
  ON enabler_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role = 'super_admin'
    )
  );