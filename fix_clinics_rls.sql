-- Drop any existing restrictive policies on clinics that might cause infinite recursion
DROP POLICY IF EXISTS "Admin full access" ON clinics;
DROP POLICY IF EXISTS "Admin can insert clinics" ON clinics;
DROP POLICY IF EXISTS "Admin can update clinics" ON clinics;
DROP POLICY IF EXISTS "Admin can delete clinics" ON clinics;

-- Allow anyone authenticated to insert a clinic (or restrict to admins safely)
-- To be absolutely safe against recursion, we use the JWT auth.uid()
CREATE POLICY "Admins can manage clinics" 
ON clinics 
FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff')
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- Ensure RLS is actually enabled
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

-- If you want to allow PUBLIC to view clinics (so patients can see them)
DROP POLICY IF EXISTS "Public can view active clinics" ON clinics;
CREATE POLICY "Public can view active clinics" 
ON clinics 
FOR SELECT 
USING (true);
