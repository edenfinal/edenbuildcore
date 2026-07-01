ALTER TABLE hero_slides
ADD COLUMN IF NOT EXISTS page_id text NOT NULL DEFAULT 'home';

CREATE INDEX IF NOT EXISTS idx_hero_slides_page_order
ON hero_slides (page_id, order_index);

UPDATE hero_slides
SET page_id = 'home'
WHERE page_id IS NULL OR page_id = '';
