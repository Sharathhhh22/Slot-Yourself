-- Add clinic_id to doctors table to support multi-clinic grouping
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);

-- Assign existing doctors to the first available clinic (if any)
UPDATE doctors
SET clinic_id = (SELECT id FROM clinics LIMIT 1)
WHERE clinic_id IS NULL;
