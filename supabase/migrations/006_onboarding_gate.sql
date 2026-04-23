-- 006_onboarding_gate.sql
-- 목적: "auth.users 생성"과 "role 선택(온보딩 완료)"을 분리
--
-- Before: handle_new_user 트리거가 role을 'startup'으로 자동 배정 + startup_profiles 행 자동 생성
--         → Google OAuth 가입자가 역할 선택 화면을 건너뛰고 바로 /my(스타트업 대시보드)로 랜딩
--
-- After:  트리거는 users에 email, full_name만 INSERT (role = NULL).
--         profiles 테이블 행은 온보딩에서 사용자가 role을 선택할 때 생성.
--         callback 라우트가 role IS NULL이면 /onboarding/role로 분기.
--
-- 호환성: 기존 유저(이미 role이 세팅된 사용자)는 영향 없음. 신규 가입자만 새 플로우.

-- 1) role을 nullable로 변경
ALTER TABLE public.users
  ALTER COLUMN role DROP NOT NULL;

-- 2) handle_new_user 트리거 재작성 — 최소 INSERT만
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- users 행만 최소 필드로. role과 profiles는 온보딩에서 사용자 선택으로 생성.
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- auth.users 생성은 막지 않되 이슈는 로그로 남김
  RAISE WARNING 'handle_new_user failed: % %', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$;

-- supabase_auth_admin 권한은 003에서 이미 GRANT됨. 재적용 불필요.
