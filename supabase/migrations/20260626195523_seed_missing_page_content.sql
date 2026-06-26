/*
# Seed Missing page_content Entries

## Summary
Adds missing page_content entries for sections that the frontend code references but don't exist in the database yet. This ensures the Content Editor can edit all text fields shown on the website.

## Changes
- Adds `founder` section to `about` page (name, designation, bio, message, badge, title)
- Adds `vision` and `mission` sections to `about` page (used by AboutPage.tsx)
- Adds `process` section to `services` page (used by ServicesPage.tsx)
- Adds `cta` section to `services` page (used by ServicesPage.tsx)
- Adds `testimonials` section to `clients` page (used by ClientsPage.tsx)
- Adds `empty` section to `projects` page (used by ProjectsPage.tsx)
- Adds `detail` section to `projects` page (used by ProjectsPage.tsx)
*/

-- About page: founder section
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'founder', 'badge', 'Our Leadership', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'founder' AND content_key = 'badge');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'founder', 'title', 'Message from the Founder', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'founder' AND content_key = 'title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'founder', 'name', '', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'founder' AND content_key = 'name');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'founder', 'designation', '', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'founder' AND content_key = 'designation');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'founder', 'bio', '', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'founder' AND content_key = 'bio');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'founder', 'message', '', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'founder' AND content_key = 'message');

-- About page: vision and mission (separate sections used by AboutPage)
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'vision', 'title', 'Our Vision', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'vision' AND content_key = 'title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'vision', 'description', 'To be the leading construction and engineering company in the region, setting new standards of excellence, innovation, and sustainable development.', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'vision' AND content_key = 'description');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'mission', 'title', 'Our Mission', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'mission' AND content_key = 'title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'about', 'mission', 'description', 'To deliver exceptional construction solutions that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to safety.', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'about' AND section_key = 'mission' AND content_key = 'description');

-- Services page: process and cta sections
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'badge', 'Our Process', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'badge');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'title', 'How We Work', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'step_1_title', 'Consultation', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'step_1_title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'step_1_description', 'Understanding your vision and requirements', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'step_1_description');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'step_2_title', 'Planning', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'step_2_title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'step_2_description', 'Creating detailed project plans and designs', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'step_2_description');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'step_3_title', 'Execution', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'step_3_title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'step_3_description', 'Implementing with precision and quality', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'step_3_description');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'step_4_title', 'Delivery', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'step_4_title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'process', 'step_4_description', 'On-time handover with complete documentation', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'process' AND content_key = 'step_4_description');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'cta', 'title', 'Need a Custom Solution?', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'cta' AND content_key = 'title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'cta', 'description', 'Our team is ready to discuss your specific requirements and provide tailored solutions.', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'cta' AND content_key = 'description');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'services', 'cta', 'button_text', 'Contact Us Today', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'services' AND section_key = 'cta' AND content_key = 'button_text');

-- Clients page: testimonials section
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'clients', 'testimonials', 'badge', 'Testimonials', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'clients' AND section_key = 'testimonials' AND content_key = 'badge');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'clients', 'testimonials', 'title', 'What Our Clients Say', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'clients' AND section_key = 'testimonials' AND content_key = 'title');

-- Projects page: detail and empty sections
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'projects', 'detail', 'overview_title', 'Project Overview', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'projects' AND section_key = 'detail' AND content_key = 'overview_title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'projects', 'detail', 'gallery_title', 'Project Gallery', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'projects' AND section_key = 'detail' AND content_key = 'gallery_title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'projects', 'detail', 'sidebar_title', 'Project Details', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'projects' AND section_key = 'detail' AND content_key = 'sidebar_title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'projects', 'detail', 'cta_button', 'Start Similar Project', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'projects' AND section_key = 'detail' AND content_key = 'cta_button');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'projects', 'detail', 'not_found', 'Project Not Found', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'projects' AND section_key = 'detail' AND content_key = 'not_found');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'projects', 'empty', 'no_results', 'No projects found in this category.', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'projects' AND section_key = 'empty' AND content_key = 'no_results');

-- Certifications page: cta section
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'certifications', 'cta', 'title', 'Committed to Excellence', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'certifications' AND section_key = 'cta' AND content_key = 'title');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'certifications', 'cta', 'description', 'Our certifications reflect our unwavering commitment to quality, safety, and environmental responsibility.', 'textarea'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'certifications' AND section_key = 'cta' AND content_key = 'description');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'certifications', 'cta', 'button_1', 'Partner With Us', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'certifications' AND section_key = 'cta' AND content_key = 'button_1');

INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type)
SELECT 'certifications', 'cta', 'button_2', 'View Our Projects', 'text'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE page_id = 'certifications' AND section_key = 'cta' AND content_key = 'button_2');
