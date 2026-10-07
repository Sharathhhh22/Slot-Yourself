-- Add profile_id to link doctors to auth users
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id);

-- Optional: Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_doctors_profile_id ON doctors(profile_id);
