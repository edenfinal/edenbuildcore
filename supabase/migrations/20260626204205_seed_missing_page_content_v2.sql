-- Seed missing page_content rows for all pages
-- Using INSERT ... ON CONFLICT DO NOTHING to avoid overwriting existing content

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
-- About page: missing keys
('about', 'overview', 'title', 'Company Overview', 'text'),
('about', 'overview', 'badge', 'Who We Are', 'text'),
('about', 'values', 'badge', 'What We Stand For', 'text'),
('about', 'values', 'title', 'Our Core Values', 'text'),
('about', 'strengths', 'badge', 'Why Choose Us', 'text'),
('about', 'strengths', 'title', 'Built on Excellence', 'text'),
-- Timeline (Journey Through Years) - editable via Content Editor
('about', 'timeline', 'year_1', '1999', 'text'),
('about', 'timeline', 'title_1', 'Company Founded', 'text'),
('about', 'timeline', 'description_1', 'Eden Buildcore was established with a vision to transform the construction industry.', 'text'),
('about', 'timeline', 'year_2', '2005', 'text'),
('about', 'timeline', 'title_2', 'Regional Expansion', 'text'),
('about', 'timeline', 'description_2', 'Expanded operations across multiple cities, completing 100+ projects.', 'text'),
('about', 'timeline', 'year_3', '2010', 'text'),
('about', 'timeline', 'title_3', 'ISO Certification', 'text'),
('about', 'timeline', 'description_3', 'Achieved ISO 9001 certification, marking our commitment to quality.', 'text'),
('about', 'timeline', 'year_4', '2015', 'text'),
('about', 'timeline', 'title_4', 'Infrastructure Division', 'text'),
('about', 'timeline', 'description_4', 'Launched dedicated infrastructure development division.', 'text'),
('about', 'timeline', 'year_5', '2019', 'text'),
('about', 'timeline', 'title_5', 'Company Start Year', 'text'),
('about', 'timeline', 'description_5', 'Began current phase of operations, serving clients across Pakistan.', 'text'),
('about', 'timeline', 'year_6', '2024', 'text'),
('about', 'timeline', 'title_6', 'Sustainability Focus', 'text'),
('about', 'timeline', 'description_6', 'Launched green construction initiatives and solar division.', 'text'),
('about', 'timeline', 'section_title', 'Journey Through Years', 'text'),
-- Home page: about_preview badge_text and title split
('home', 'about_preview', 'badge_text', 'Years of Excellence', 'text'),
('home', 'about_preview', 'title_line1', 'Building Dreams Into', 'text'),
('home', 'about_preview', 'title_line2', 'Reality', 'text'),
('home', 'about_preview', 'feature_1', 'Quality Assurance', 'text'),
('home', 'about_preview', 'feature_2', 'Safety First', 'text'),
('home', 'about_preview', 'feature_3', 'On-Time Delivery', 'text'),
('home', 'about_preview', 'feature_4', 'Expert Team', 'text'),
('home', 'about_preview', 'link_text', 'Learn More About Us', 'text'),
-- Home stats descriptions
('home', 'stats', 'stat_1_description', 'Years of Excellence', 'text'),
('home', 'stats', 'stat_2_description', 'Projects Completed', 'text'),
('home', 'stats', 'stat_3_description', 'Happy Clients', 'text'),
('home', 'stats', 'stat_4_description', 'Team Members', 'text'),
-- CTA section
('home', 'cta', 'badge', 'Start Your Project', 'text'),
('home', 'cta', 'title_line1', 'Ready to Build Your', 'text'),
('home', 'cta', 'title_line2', 'Dream Project?', 'text'),
('home', 'cta', 'button_primary', 'Get a Free Quote', 'text'),
('home', 'cta', 'button_secondary', 'Call Us Now', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;
