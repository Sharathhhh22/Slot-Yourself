ALTER TABLE doctors ADD COLUMN IF NOT EXISTS specialty VARCHAR(255);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);

-- Fill in default values for existing doctors so they don't appear blank
UPDATE doctors SET specialty = 'General Physician', experience_years = 10 WHERE specialty IS NULL;
UPDATE doctors SET clinic_id = (SELECT id FROM clinics LIMIT 1) WHERE clinic_id IS NULL;
