
ALTER TABLE page_heroes
  ADD COLUMN IF NOT EXISTS button2_text text,
  ADD COLUMN IF NOT EXISTS button2_link text,
  ADD COLUMN IF NOT EXISTS line_two text;

ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS button2_text text,
  ADD COLUMN IF NOT EXISTS button2_link text,
  ADD COLUMN IF NOT EXISTS line_two text;
