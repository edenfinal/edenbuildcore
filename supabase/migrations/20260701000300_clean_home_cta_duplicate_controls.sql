UPDATE page_content
SET content_value = ''
WHERE page_id = 'home'
  AND section_key = 'cta'
  AND content_key = 'secondary_button_link'
  AND content_value = '/contact';
