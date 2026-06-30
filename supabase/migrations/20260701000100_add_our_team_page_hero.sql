INSERT INTO page_heroes (
  page_id,
  title,
  line_two,
  subtitle,
  description,
  background_image_url,
  overlay_opacity,
  text_alignment,
  height,
  button_text,
  button_link,
  show_button,
  is_active,
  is_carousel,
  slide_interval,
  animation_speed,
  order_index
)
SELECT
  'our-team',
  'Meet the',
  'Team Behind Excellence',
  'Our People',
  'Dedicated professionals who bring skill, passion, and commitment to every project we undertake.',
  '',
  0.75,
  'center',
  'large',
  '',
  '',
  false,
  true,
  false,
  6000,
  1000,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM page_heroes WHERE page_id = 'our-team'
);
