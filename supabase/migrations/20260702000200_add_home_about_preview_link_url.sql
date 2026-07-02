INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'home', 'about_preview', 'link_url', '/about', 'text'
WHERE NOT EXISTS (
  SELECT 1
  FROM page_content
  WHERE page_id = 'home'
    AND section_key = 'about_preview'
    AND content_key = 'link_url'
);
