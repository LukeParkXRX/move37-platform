-- Fix: handle_new_user trigger was failing with "Database error saving new user"
-- Root causes:
--   1. Function didn't SET search_path=public, so supabase_auth_admin role couldn't resolve table/type names
--   2. supabase_auth_admin lacked INSERT on public.users, startup_profiles, enabler_profiles
--   3. Silent failure blocked auth.users insert entirely
-- Fix applied:
--   - SET search_path=public
--   - Fully qualify table names (public.users, etc.)
--   - EXCEPTION WHEN OTHERS → log warning but don't block auth signup
--   - GRANT necessary permissions to supabase_auth_admin

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'startup'::public.user_role)
  );

  IF COALESCE((NEW.raw_user_meta_data->>'role'), 'startup') = 'startup' THEN
    INSERT INTO public.startup_profiles (user_id) VALUES (NEW.id);
  ELSIF (NEW.raw_user_meta_data->>'role') = 'enabler' THEN
    INSERT INTO public.enabler_profiles (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed: % %', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT, SELECT ON public.users TO supabase_auth_admin;
GRANT INSERT, SELECT ON public.startup_profiles TO supabase_auth_admin;
GRANT INSERT, SELECT ON public.enabler_profiles TO supabase_auth_admin;
