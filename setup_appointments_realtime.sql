-- Create the appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  clinic_id UUID REFERENCES clinics(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('held', 'confirmed', 'cancelled', 'completed')),
  held_until TIMESTAMPTZ,
  patient_name TEXT,
  patient_phone TEXT,
  reason TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  dob DATE,
  consent_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop the index if it exists to recreate it cleanly
DROP INDEX IF EXISTS idx_unique_active_slot;

-- Create a partial unique index to guarantee slot safety
-- Two people CANNOT hold or book the same slot at the same time.
-- A slot is considered "active" if it's confirmed, OR if it's held and the hold hasn't expired.
CREATE UNIQUE INDEX idx_unique_active_slot 
ON appointments (doctor_id, date, time) 
WHERE status = 'confirmed' OR (status = 'held' AND held_until > NOW());

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Patients can view their own appointments" ON appointments;
CREATE POLICY "Patients can view their own appointments"
ON appointments FOR SELECT
USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Patients can insert their own appointments" ON appointments;
CREATE POLICY "Patients can insert their own appointments"
ON appointments FOR INSERT
WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Patients can update their own held appointments" ON appointments;
CREATE POLICY "Patients can update their own held appointments"
ON appointments FOR UPDATE
USING (auth.uid() = patient_id AND status = 'held');

-- Create RPC to securely fetch taken slots without exposing patient details
CREATE OR REPLACE FUNCTION get_taken_slots(p_doctor_id UUID, p_date DATE)
RETURNS TABLE(time TIME) AS $$
BEGIN
  RETURN QUERY
  SELECT a.time
  FROM appointments a
  WHERE a.doctor_id = p_doctor_id 
    AND a.date = p_date
    AND (a.status = 'confirmed' OR (a.status = 'held' AND a.held_until > NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Turn on Realtime for the appointments table!
-- This is critical for the UI to instantly gray out slots that others take.
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- Cleanup function to automatically release expired holds (can be run periodically or via pg_cron)
-- Though the Unique Index inherently ignores expired holds anyway!
CREATE OR REPLACE FUNCTION release_expired_holds()
RETURNS void AS $$
BEGIN
  UPDATE appointments
  SET status = 'cancelled'
  WHERE status = 'held' AND held_until <= NOW();
END;
$$ LANGUAGE plpgsql;
