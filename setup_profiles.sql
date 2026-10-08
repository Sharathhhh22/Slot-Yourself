-- 1. Create a function to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    new.id, 
    'patient',
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. IMMEDIATELY FIX EXISTING USERS!
-- If you already signed up, your profile is missing! This fixes it instantly:
INSERT INTO public.profiles (id, role, full_name)
SELECT id, 'patient', COALESCE(raw_user_meta_data->>'full_name', 'Patient')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
