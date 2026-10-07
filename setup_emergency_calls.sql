-- Add emergency toggle to doctors
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS emergency_calls_enabled BOOLEAN DEFAULT true;

-- Create emergency call log table
CREATE TABLE IF NOT EXISTS emergency_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  appointment_id UUID REFERENCES appointments(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('initiated', 'connected', 'failed', 'no_answer', 'completed')),
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: We NEVER store phone numbers in this table, per PRD privacy requirements.

-- RLS Policies
ALTER TABLE emergency_calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients view their own emergency calls" ON emergency_calls;
CREATE POLICY "Patients view their own emergency calls"
ON emergency_calls FOR SELECT
USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Doctors view calls to them" ON emergency_calls;
CREATE POLICY "Doctors view calls to them"
ON emergency_calls FOR SELECT
USING (auth.uid() = doctor_id);
