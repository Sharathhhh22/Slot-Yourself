-- 1. Get the legacy table out of the way
ALTER TABLE IF EXISTS appointments RENAME TO appointments_legacy;

-- 2. Create the proper appointments table with UUIDs and the correct column names
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  clinic_id UUID REFERENCES clinics(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('held', 'confirmed', 'cancelled', 'completed')),
  held_until TIMESTAMPTZ,
  patient_name TEXT,
  patient_phone TEXT,
  reason TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  dob DATE,
  consent_given BOOLEAN DEFAULT false,
  ticket_number SERIAL,
  payment_mode VARCHAR(50) DEFAULT 'offline',
  transaction_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Safety Index
DROP INDEX IF EXISTS idx_unique_active_slot;
CREATE UNIQUE INDEX idx_unique_active_slot 
ON appointments (doctor_id, appointment_date, appointment_time) 
WHERE status IN ('confirmed', 'held');

-- 4. Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

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

-- 5. RPC for checking taken slots
CREATE OR REPLACE FUNCTION get_taken_slots(p_doctor_id UUID, p_date DATE)
RETURNS TABLE("time" TIME) AS $$
BEGIN
  RETURN QUERY
  SELECT a.appointment_time
  FROM appointments a
  WHERE a.doctor_id = p_doctor_id 
    AND a.appointment_date = p_date
    AND (a.status = 'confirmed' OR (a.status = 'held' AND a.held_until > NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Realtime
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
