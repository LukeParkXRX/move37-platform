-- Add optional contact_email for users who want to receive notifications
-- at an address different from their Google auth email.
-- users.email = auth email (locked to Google identity)
-- users.contact_email = alternate inbox (optional, editable)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS contact_email TEXT;

COMMENT ON COLUMN public.users.contact_email
  IS 'Optional alternate email for notifications. Defaults to auth email if null.';
