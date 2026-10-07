-- Create a table to track patient medical records
CREATE TABLE IF NOT EXISTS patient_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;

-- Patients can see their own records
CREATE POLICY "Patients can view own records" ON patient_records
    FOR SELECT USING (auth.uid() = patient_id);

-- Patients can insert their own records
CREATE POLICY "Patients can insert own records" ON patient_records
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Admins and staff can view all records
CREATE POLICY "Admins can view all records" ON patient_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' OR profiles.role = 'staff' OR profiles.role = 'doctor')
        )
    );

-- IMPORTANT: You must also create a Storage Bucket in Supabase!
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Click "New Bucket"
-- 3. Name it EXACTLY: medical_records
-- 4. Set it as "Public" (for ease of use, or private if you configure signed URLs)
