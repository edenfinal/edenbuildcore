-- Drop old upload policy and recreate with proper WITH CHECK
DROP POLICY IF EXISTS "Anon upload access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access for site-assets" ON storage.objects;

-- Allow both anon and authenticated to upload to site-assets
CREATE POLICY "Upload access for site-assets"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'site-assets');

-- Allow both anon and authenticated to update in site-assets
DROP POLICY IF EXISTS "Anon update access for site-assets" ON storage.objects;
CREATE POLICY "Update access for site-assets"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

-- Allow both anon and authenticated to delete from site-assets
DROP POLICY IF EXISTS "Anon delete access for site-assets" ON storage.objects;
CREATE POLICY "Delete access for site-assets"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'site-assets');
