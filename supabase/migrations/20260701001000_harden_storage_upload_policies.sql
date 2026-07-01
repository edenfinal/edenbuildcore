-- Harden storage writes.
-- The frontend uploads through the upload-image Edge Function, which uses the
-- service role key. Public users should only read site assets, not write/delete
-- directly with the anon key.

DROP POLICY IF EXISTS "site-assets_insert" ON storage.objects;
DROP POLICY IF EXISTS "site-assets_update" ON storage.objects;
DROP POLICY IF EXISTS "site-assets_delete" ON storage.objects;
DROP POLICY IF EXISTS "Anon upload access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Anon update access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Anon delete access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Upload access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Update access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Delete access for site-assets" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "site-assets_select" ON storage.objects;
CREATE POLICY "Public read access for site-assets"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-assets');
