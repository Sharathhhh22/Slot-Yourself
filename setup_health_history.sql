CREATE TABLE IF NOT EXISTS health_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  dob DATE,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE health_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients can manage their own health history" ON health_history;
CREATE POLICY "Patients can manage their own health history"
ON health_history FOR ALL
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);
