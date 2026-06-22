/*
# Create page_heroes table for per-page hero configuration

1. New Tables
- `page_heroes`: Stores hero configuration for each page
  - `id` (uuid, primary key)
  - `page_id` (text, not null) - unique identifier for the page (e.g., 'home', 'about', 'services')
  - `title` (text) - hero main heading
  - `subtitle` (text) - hero subheading
  - `description` (text) - hero description text
  - `background_image_url` (text) - hero background image
  - `overlay_opacity` (float, default 0.7) - overlay darkness
  - `text_alignment` (text, default 'center') - text alignment
  - `button_text` (text) - CTA button text
  - `button_link` (text) - CTA button link
  - `show_button` (boolean, default true) - whether to show the button
  - `height` (text, default 'large') - hero height: small, medium, large, full
  - `text_color` (text, default '#ffffff') - text color
  - `overlay_color` (text, default '#030810') - overlay gradient color
  - `is_active` (boolean, default true) - whether hero is visible
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

2. Security
- Enable RLS on `page_heroes`.
- Allow anon + authenticated CRUD since this is a single-tenant admin-managed app.
*/

CREATE TABLE IF NOT EXISTS page_heroes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL UNIQUE,
  title text,
  subtitle text,
  description text,
  background_image_url text,
  overlay_opacity float NOT NULL DEFAULT 0.7,
  text_alignment text NOT NULL DEFAULT 'center',
  button_text text,
  button_link text,
  show_button boolean NOT NULL DEFAULT true,
  height text NOT NULL DEFAULT 'large',
  text_color text NOT NULL DEFAULT '#ffffff',
  overlay_color text NOT NULL DEFAULT '#030810',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_heroes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_page_heroes" ON page_heroes;
CREATE POLICY "anon_select_page_heroes" ON page_heroes FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_page_heroes" ON page_heroes;
CREATE POLICY "anon_insert_page_heroes" ON page_heroes FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_page_heroes" ON page_heroes;
CREATE POLICY "anon_update_page_heroes" ON page_heroes FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_page_heroes" ON page_heroes;
CREATE POLICY "anon_delete_page_heroes" ON page_heroes FOR DELETE
TO anon, authenticated USING (true);