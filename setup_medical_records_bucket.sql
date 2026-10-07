-- Create the medical_records storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical_records', 'medical_records', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own records
DROP POLICY IF EXISTS "Users can upload their own medical records" ON storage.objects;
CREATE POLICY "Users can upload their own medical records" 
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'medical_records' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own records
DROP POLICY IF EXISTS "Users can view their own medical records" ON storage.objects;
CREATE POLICY "Users can view their own medical records" 
ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'medical_records' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow doctors/admins to view records (if needed)
DROP POLICY IF EXISTS "Staff can view all medical records" ON storage.objects;
CREATE POLICY "Staff can view all medical records" 
ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'medical_records' AND (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'doctor')
  )
);

-- Allow users to delete their own records
DROP POLICY IF EXISTS "Users can delete their own medical records" ON storage.objects;
CREATE POLICY "Users can delete their own medical records" 
ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'medical_records' AND (storage.foldername(name))[1] = auth.uid()::text
);
