INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'contact', 'form', 'warning_title', 'Inquiry Saved', 'text'
WHERE NOT EXISTS (
  SELECT 1 FROM page_content
  WHERE page_id = 'contact' AND section_key = 'form' AND content_key = 'warning_title'
);

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'contact', 'form', 'warning_message', 'Your inquiry was saved, but email notification needs attention.', 'textarea'
WHERE NOT EXISTS (
  SELECT 1 FROM page_content
  WHERE page_id = 'contact' AND section_key = 'form' AND content_key = 'warning_message'
);
