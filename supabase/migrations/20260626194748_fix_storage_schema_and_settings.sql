/*
# Fix Storage, Schema Mismatches, and Add Missing Settings

## Summary
This migration fixes multiple critical issues:
1. Creates the `site-assets` storage bucket (currently missing — all image uploads fail)
2. Adds storage RLS policies so anon/authenticated can upload and read files
3. Fixes `page_heroes` table — adds missing columns that the code expects (description, show_button, button_link, is_active, is_carousel, slide_interval, image_width, image_height, animation_speed, order_index)
4. Adds `company_start_year` to `site_settings` for auto-calculating experience years
5. Adds `logo_size` and `logo_scale` to `site_settings` for logo dimension control
6. Adds `founder_*` columns to `site_settings` for the About page founder section
7. Seeds default page_heroes rows for all pages if they don't exist
8. Updates existing page_heroes data to use new column names (button_url -> button_link)

## New Storage Bucket
- `site-assets` (public bucket for logos, hero images, gallery, CRUD uploads)

## Storage RLS Policies
- Allow anon + authenticated to READ all objects (public bucket)
- Allow anon + authenticated to INSERT/UPDATE/DELETE objects (admin panel uses anon key)

## Modified Tables
- `page_heroes`: adds description, show_button, button_link, is_active, is_carousel, slide_interval, image_width, image_height, animation_speed, order_index
- `site_settings`: adds company_start_year, logo_size, logo_scale, founder_name, founder_designation, founder_bio, founder_image_url, founder_message

## Security
- Storage bucket is public (readable by all)
- Storage write policies allow anon + authenticated (admin panel uses anon key)
- No changes to existing table RLS policies
*/

-- ═══════════════════════════════════════════════════
-- 1. CREATE STORAGE BUCKET
-- ═══════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 2. STORAGE RLS POLICIES
-- ═══════════════════════════════════════════════════
-- Allow everyone to read files (public bucket)
DROP POLICY IF EXISTS "Public read access for site-assets" ON storage.objects;
CREATE POLICY "Public read access for site-assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-assets');

-- Allow anon + authenticated to upload files
DROP POLICY IF EXISTS "Anon upload access for site-assets" ON storage.objects;
CREATE POLICY "Anon upload access for site-assets"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'site-assets');

-- Allow anon + authenticated to update files
DROP POLICY IF EXISTS "Anon update access for site-assets" ON storage.objects;
CREATE POLICY "Anon update access for site-assets"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'site-assets')
WITH CHECK (bucket_id = 'site-assets');

-- Allow anon + authenticated to delete files
DROP POLICY IF EXISTS "Anon delete access for site-assets" ON storage.objects;
CREATE POLICY "Anon delete access for site-assets"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'site-assets');

-- ═══════════════════════════════════════════════════
-- 3. FIX page_heroes TABLE - ADD MISSING COLUMNS
-- ═══════════════════════════════════════════════════
DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS description text DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS show_button boolean DEFAULT true;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS button_link text DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS is_carousel boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS slide_interval integer DEFAULT 6000;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS image_width integer DEFAULT 1920;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS image_height integer DEFAULT 1080;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS animation_speed integer DEFAULT 1000;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE page_heroes ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Migrate button_url data to button_link if button_link is empty
UPDATE page_heroes
SET button_link = button_url
WHERE (button_link IS NULL OR button_link = '') AND button_url IS NOT NULL AND button_url != '';

-- ═══════════════════════════════════════════════════
-- 4. ADD MISSING COLUMNS TO site_settings
-- ═══════════════════════════════════════════════════
DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS company_start_year integer DEFAULT 2008;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS logo_size varchar DEFAULT '64';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS logo_scale varchar DEFAULT 'auto';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Founder columns for About page
DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS founder_name varchar DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS founder_designation varchar DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS founder_bio text DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS founder_image_url text DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS founder_message text DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ═══════════════════════════════════════════════════
-- 5. SEED DEFAULT page_heroes IF MISSING
-- ═══════════════════════════════════════════════════
INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'home', 'Building Excellence', 'Eden Buildcore', 'Premier construction and engineering company delivering excellence.', '', 0.75, 'center', 'large', 'Explore Projects', '/projects', true, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'home');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'about', 'About Eden Buildcore', 'Our Story', 'Two decades of excellence in construction, engineering, and infrastructure development', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'about');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'services', 'Premium Construction & Engineering Services', 'What We Offer', 'Comprehensive construction solutions tailored to meet your unique requirements, delivered with excellence and precision.', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'services');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'projects', 'Featured Projects', 'Our Portfolio', 'Explore our portfolio of successfully completed construction and engineering projects across various sectors.', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'projects');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'gallery', 'Project Gallery', 'Our Gallery', 'Visual showcase of our completed projects, construction sites, and engineering achievements.', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'gallery');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'contact', 'Contact Us', 'Get In Touch', 'Ready to start your project? Reach out to us and let us discuss how we can bring your vision to life.', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'contact');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'careers', 'Career Opportunities', 'Join Our Team', 'Build your career with Eden Buildcore. Join a team of passionate professionals shaping the future of construction.', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'careers');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'blog', 'News & Insights', 'Our Blog', 'Stay updated with the latest trends, insights, and news from the construction industry.', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'blog');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'clients', 'Our Valued Clients', 'Trusted Partners', 'Proudly serving government agencies and private sector leaders across Pakistan with excellence and integrity.', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'clients');

INSERT INTO page_heroes (page_id, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, height, button_text, button_link, show_button, is_active, is_carousel, slide_interval, animation_speed, order_index)
SELECT 'certifications', 'Certifications & Registrations', 'Quality Assured', 'Our commitment to quality, safety, and excellence is validated by internationally recognized certifications.', '', 0.75, 'center', 'large', '', '', false, true, false, 6000, 1000, 0
WHERE NOT EXISTS (SELECT 1 FROM page_heroes WHERE page_id = 'certifications');

-- ═══════════════════════════════════════════════════
-- 6. UPDATE site_settings DEFAULTS
-- ═══════════════════════════════════════════════════
UPDATE site_settings
SET company_start_year = COALESCE(company_start_year, 2008),
    logo_size = COALESCE(logo_size, '64'),
    logo_scale = COALESCE(logo_scale, 'auto'),
    heading_font = COALESCE(NULLIF(heading_font, ''), 'Playfair Display, serif'),
    body_font = COALESCE(NULLIF(body_font, ''), 'Inter, sans-serif')
WHERE id IS NOT NULL;
