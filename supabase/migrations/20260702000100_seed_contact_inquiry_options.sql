INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('contact', 'form', 'label_inquiry_type', 'Inquiry Type', 'text'),
('contact', 'form', 'inquiry_general', 'General Inquiry', 'text'),
('contact', 'form', 'inquiry_project', 'Project Inquiry', 'text'),
('contact', 'form', 'inquiry_partnership', 'Partnership', 'text'),
('contact', 'form', 'inquiry_career', 'Career Inquiry', 'text')
ON CONFLICT (page_id, section_key, content_key) DO UPDATE
SET content_value = CASE
    WHEN page_content.content_value IS NULL OR page_content.content_value = ''
      THEN EXCLUDED.content_value
    ELSE page_content.content_value
  END,
  content_type = EXCLUDED.content_type,
  updated_at = now();
