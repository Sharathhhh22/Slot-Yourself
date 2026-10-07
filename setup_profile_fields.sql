-- Add missing profile columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies for avatars
-- Allow public viewing
CREATE POLICY "Public avatars are viewable by everyone." 
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar." 
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar." 
ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar." 
ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);
