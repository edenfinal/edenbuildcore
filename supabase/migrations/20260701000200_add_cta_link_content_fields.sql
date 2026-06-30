INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('home', 'cta', 'button_link', '/contact', 'text'),
('home', 'cta', 'secondary_button_link', '', 'text'),
('services', 'cta', 'button_link', '/contact', 'text'),
('clients', 'cta', 'button_1', 'Start a Project', 'text'),
('clients', 'cta', 'button_1_link', '/contact', 'text'),
('clients', 'cta', 'button_2', 'View Our Work', 'text'),
('clients', 'cta', 'button_2_link', '/projects', 'text'),
('certifications', 'cta', 'button_1_link', '/contact', 'text'),
('certifications', 'cta', 'button_2_link', '/projects', 'text'),
('projects', 'detail', 'cta_link', '/contact', 'text'),
('team', 'cta', 'button_text', 'View Open Positions', 'text'),
('team', 'cta', 'button_link', '/careers', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;
