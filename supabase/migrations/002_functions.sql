-- ═══════════════════════════════════════════════════════
-- FUNCTIONS: Credit operations (atomic transactions)
-- ═══════════════════════════════════════════════════════

-- Function: Grant credits to an organization (admin action)
CREATE OR REPLACE FUNCTION grant_credits_to_org(
  p_org_id UUID,
  p_amount INT,
  p_description TEXT DEFAULT '크레딧 구매'
) RETURNS credit_transactions AS $$
DECLARE
  v_tx credit_transactions;
  v_new_total INT;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  UPDATE organizations SET total_credits = total_credits + p_amount WHERE id = p_org_id
  RETURNING total_credits INTO v_new_total;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Organization not found';
  END IF;

  INSERT INTO credit_transactions (tx_type, amount, org_id, description, balance_after)
  VALUES ('purchase', p_amount, p_org_id, p_description, v_new_total)
  RETURNING * INTO v_tx;

  RETURN v_tx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Allocate credits from org to startup
CREATE OR REPLACE FUNCTION allocate_credits_to_startup(
  p_org_id UUID,
  p_startup_id UUID,
  p_amount INT,
  p_description TEXT DEFAULT '크레딧 배분'
) RETURNS credit_transactions AS $$
DECLARE
  v_tx credit_transactions;
  v_org_remaining INT;
  v_startup_balance INT;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Check org has enough credits
  SELECT total_credits - COALESCE(
    (SELECT SUM(amount) FROM credit_transactions WHERE org_id = p_org_id AND tx_type = 'allocate'), 0
  ) INTO v_org_remaining FROM organizations WHERE id = p_org_id;

  IF v_org_remaining < p_amount THEN
    RAISE EXCEPTION 'Insufficient organization credits (available: %)', v_org_remaining;
  END IF;

  -- Add to startup balance
  UPDATE startup_profiles SET credit_balance = credit_balance + p_amount WHERE user_id = p_startup_id
  RETURNING credit_balance INTO v_startup_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Startup profile not found';
  END IF;

  INSERT INTO credit_transactions (tx_type, amount, org_id, startup_id, description, balance_after)
  VALUES ('allocate', p_amount, p_org_id, p_startup_id, p_description, v_startup_balance)
  RETURNING * INTO v_tx;

  RETURN v_tx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Hold credits when booking is created
CREATE OR REPLACE FUNCTION hold_credits(
  p_booking_id UUID,
  p_startup_id UUID,
  p_enabler_id UUID,
  p_amount INT
) RETURNS credit_transactions AS $$
DECLARE
  v_tx credit_transactions;
  v_balance INT;
BEGIN
  IF p_amount <= 0 THEN RETURN NULL; END IF; -- chemistry calls are free

  -- Deduct from startup balance
  UPDATE startup_profiles SET credit_balance = credit_balance - p_amount
  WHERE user_id = p_startup_id AND credit_balance >= p_amount
  RETURNING credit_balance INTO v_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  INSERT INTO credit_transactions (tx_type, amount, startup_id, enabler_id, booking_id, description, balance_after)
  VALUES ('hold', -p_amount, p_startup_id, p_enabler_id, p_booking_id, '세션 예약 크레딧 홀드', v_balance)
  RETURNING * INTO v_tx;

  RETURN v_tx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Confirm credits (session completed)
CREATE OR REPLACE FUNCTION confirm_credits(
  p_booking_id UUID
) RETURNS credit_transactions AS $$
DECLARE
  v_tx credit_transactions;
  v_booking bookings;
BEGIN
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF v_booking.status != 'confirmed' THEN RAISE EXCEPTION 'Booking must be confirmed first'; END IF;

  INSERT INTO credit_transactions (tx_type, amount, startup_id, enabler_id, booking_id, description)
  VALUES ('confirm', -v_booking.credits_amount, v_booking.startup_id, v_booking.enabler_id, p_booking_id, '세션 완료 크레딧 확정')
  RETURNING * INTO v_tx;

  -- Update booking status
  UPDATE bookings SET status = 'completed', completed_at = now() WHERE id = p_booking_id;

  -- Update enabler stats
  UPDATE enabler_profiles SET session_count = session_count + 1 WHERE user_id = v_booking.enabler_id;

  RETURN v_tx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Release credits (booking cancelled)
CREATE OR REPLACE FUNCTION release_credits(
  p_booking_id UUID,
  p_reason TEXT DEFAULT '예약 취소'
) RETURNS credit_transactions AS $$
DECLARE
  v_tx credit_transactions;
  v_booking bookings;
  v_balance INT;
BEGIN
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF v_booking.credits_amount = 0 THEN RETURN NULL; END IF; -- nothing to release for free sessions

  -- Return credits to startup
  UPDATE startup_profiles SET credit_balance = credit_balance + v_booking.credits_amount
  WHERE user_id = v_booking.startup_id
  RETURNING credit_balance INTO v_balance;

  INSERT INTO credit_transactions (tx_type, amount, startup_id, enabler_id, booking_id, description, balance_after)
  VALUES ('release', v_booking.credits_amount, v_booking.startup_id, v_booking.enabler_id, p_booking_id, p_reason, v_balance)
  RETURNING * INTO v_tx;

  -- Update booking
  UPDATE bookings SET status = 'cancelled', cancelled_at = now(), cancel_reason = p_reason WHERE id = p_booking_id;

  RETURN v_tx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Handle user creation trigger (auto-create profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'startup')
  );

  IF COALESCE((NEW.raw_user_meta_data->>'role'), 'startup') = 'startup' THEN
    INSERT INTO startup_profiles (user_id) VALUES (NEW.id);
  ELSIF (NEW.raw_user_meta_data->>'role') = 'enabler' THEN
    INSERT INTO enabler_profiles (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create user profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: Update enabler rating (recalculate from reviews)
CREATE OR REPLACE FUNCTION update_enabler_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE enabler_profiles SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE target_id = NEW.target_id)
  WHERE user_id = NEW.target_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_enabler_rating();
