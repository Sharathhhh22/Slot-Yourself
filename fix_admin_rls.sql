-- Fix Clinics
DROP POLICY IF EXISTS "Admins can manage clinics" ON clinics;
CREATE POLICY "Admins can manage clinics" ON clinics FOR ALL TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'))
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'));

-- Fix Departments
DROP POLICY IF EXISTS "Admins can manage departments" ON departments;
CREATE POLICY "Admins can manage departments" ON departments FOR ALL TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'))
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'));

-- Fix Doctors
DROP POLICY IF EXISTS "Admins can manage doctors" ON doctors;
CREATE POLICY "Admins can manage doctors" ON doctors FOR ALL TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'))
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'));

-- Make sure patients can read them
DROP POLICY IF EXISTS "Public can view active clinics" ON clinics;
CREATE POLICY "Public can view active clinics" ON clinics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active departments" ON departments;
CREATE POLICY "Public can view active departments" ON departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active doctors" ON doctors;
CREATE POLICY "Public can view active doctors" ON doctors FOR SELECT USING (true);
