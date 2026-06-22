/*
# Merge hero slides into page_heroes system

1. Changes to page_heroes table:
- Add `is_carousel` (boolean, default false) - whether this page uses multiple rotating slides
- Add `slide_interval` (integer, default 6000) - milliseconds between slide transitions
- Add `image_width` (integer) - recommended image width
- Add `image_height` (integer) - recommended image height
- Add `animation_speed` (integer, default 1000) - transition duration in ms

2. Data Migration:
- Copy hero_slides data into page_heroes format (home page gets carousel=true)
- Update home page to use carousel mode

3. No duplicate data:
- hero_slides table remains for backward compatibility during transition
- All new management goes through page_heroes
*/

-- Add new columns to page_heroes
ALTER TABLE page_heroes 
ADD COLUMN IF NOT EXISTS is_carousel boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS slide_interval integer NOT NULL DEFAULT 6000,
ADD COLUMN IF NOT EXISTS image_width integer DEFAULT 1920,
ADD COLUMN IF NOT EXISTS image_height integer DEFAULT 1080,
ADD COLUMN IF NOT EXISTS animation_speed integer NOT NULL DEFAULT 1000;

-- Update home page to be carousel
UPDATE page_heroes SET is_carousel = true, slide_interval = 6000, animation_speed = 1000 WHERE page_id = 'home';

-- Update other pages to not be carousel
UPDATE page_heroes SET is_carousel = false WHERE page_id != 'home';