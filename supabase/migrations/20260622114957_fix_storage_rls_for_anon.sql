-- Fix storage RLS policies to allow anonymous access
-- The app uses custom admin auth (sessionStorage), not Supabase Auth
-- so users are anon role, not authenticated

-- Drop existing policies that require authenticated role
DROP POLICY IF EXISTS "site-assets_select" ON storage.objects;
DROP POLICY IF EXISTS "site-assets_insert" ON storage.objects;
DROP POLICY IF EXISTS "site-assets_update" ON storage.objects;
DROP POLICY IF EXISTS "site-assets_delete" ON storage.objects;

-- Create new policies that allow anon access to site-assets bucket
CREATE POLICY "site-assets_select" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'site-assets');
CREATE POLICY "site-assets_insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'site-assets');
CREATE POLICY "site-assets_update" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'site-assets');
CREATE POLICY "site-assets_delete" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'site-assets');