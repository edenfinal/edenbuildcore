-- Add page_content table for the content editor
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id VARCHAR(50) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  content_key VARCHAR(100) NOT NULL,
  content_value TEXT NOT NULL DEFAULT '',
  content_type VARCHAR(20) DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_page_content_unique 
ON page_content (page_id, section_key, content_key);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "public_read_page_content" ON page_content FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "admin_all_page_content" ON page_content FOR ALL USING (true);

-- Seed default page content for Home Page
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('home', 'hero', 'subtitle', 'Welcome to Eden Buildcore', 'text'),
('home', 'hero', 'default_title', 'Building Tomorrow''s Landmarks Today', 'text'),
('home', 'hero', 'default_description', 'Leading construction and engineering company delivering excellence in civil construction, infrastructure development, and building solutions across Pakistan.', 'textarea'),
('home', 'hero', 'button_text', 'Explore Our Projects', 'text'),
('home', 'hero', 'secondary_button_text', 'Get in Touch', 'text'),
('home', 'stats', 'stat_1_description', 'Years of Excellence', 'text'),
('home', 'stats', 'stat_2_description', 'Projects Delivered', 'text'),
('home', 'stats', 'stat_3_description', 'Satisfied Clients', 'text'),
('home', 'stats', 'stat_4_description', 'Expert Team Members', 'text'),
('home', 'about_preview', 'badge', 'About Us', 'text'),
('home', 'about_preview', 'title', 'Excellence in Construction Since 1999', 'text'),
('home', 'about_preview', 'description', 'Eden Buildcore (Pvt.) Ltd. is a premier construction and engineering company committed to delivering world-class infrastructure solutions. With over two decades of experience, we have established ourselves as industry leaders in civil construction, building design, and project management.', 'textarea'),
('home', 'about_preview', 'paragraph_1', 'Our team of skilled engineers, architects, and project managers work collaboratively to bring your vision to life. We combine innovative technology with proven methodologies to ensure every project exceeds expectations.', 'textarea'),
('home', 'about_preview', 'paragraph_2', 'From residential complexes to commercial landmarks, industrial facilities to infrastructure projects, Eden Buildcore has the expertise and resources to handle projects of any scale and complexity.', 'textarea'),
('home', 'about_preview', 'link_text', 'Learn More About Us', 'text'),
('home', 'services', 'badge', 'Our Services', 'text'),
('home', 'services', 'title', 'Comprehensive Construction Solutions', 'text'),
('home', 'services', 'description', 'We offer a full spectrum of construction and engineering services tailored to meet the diverse needs of our clients.', 'textarea'),
('home', 'projects', 'badge', 'Featured Projects', 'text'),
('home', 'projects', 'title', 'Projects That Define Excellence', 'text'),
('home', 'projects', 'description', 'Explore our portfolio of landmark projects that showcase our commitment to quality and innovation.', 'textarea'),
('home', 'clients', 'badge', 'Our Clients', 'text'),
('home', 'clients', 'title', 'Trusted by Industry Leaders', 'text'),
('home', 'clients', 'description', 'We are proud to partner with leading organizations across various sectors.', 'textarea'),
('home', 'testimonials', 'badge', 'Testimonials', 'text'),
('home', 'testimonials', 'title', 'What Our Clients Say', 'text'),
('home', 'testimonials', 'description', 'Hear from our satisfied clients about their experience working with Eden Buildcore.', 'textarea'),
('home', 'certifications', 'badge', 'Certifications', 'text'),
('home', 'certifications', 'title', 'Industry-Recognized Standards', 'text'),
('home', 'certifications', 'description', 'Our commitment to quality is validated by internationally recognized certifications.', 'textarea'),
('home', 'cta', 'title', 'Ready to Build Your Next Project?', 'text'),
('home', 'cta', 'description', 'Let''s discuss how Eden Buildcore can bring your vision to life with excellence and precision.', 'textarea'),
('home', 'cta', 'button_text', 'Start Your Project', 'text'),
('home', 'cta', 'secondary_button_text', 'Contact Us', 'text');

-- About Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('about', 'hero', 'title', 'About Eden Buildcore', 'text'),
('about', 'hero', 'description', 'Leading the future of construction with innovation, integrity, and excellence.', 'textarea'),
('about', 'overview', 'overview_title', 'Company Overview', 'text'),
('about', 'overview', 'paragraph_1', 'Eden Buildcore (Pvt.) Ltd. is a premier construction and engineering company committed to delivering world-class infrastructure solutions. Founded in 1999, we have grown from a small contracting firm to one of Pakistan''s most respected construction companies.', 'textarea'),
('about', 'overview', 'paragraph_2', 'Our diverse portfolio spans residential, commercial, industrial, and infrastructure projects. We pride ourselves on our ability to handle complex projects while maintaining the highest standards of quality, safety, and sustainability.', 'textarea'),
('about', 'overview', 'paragraph_3', 'With a team of over 150 professionals including engineers, architects, project managers, and skilled craftsmen, we bring together expertise and innovation to every project we undertake.', 'textarea'),
('about', 'vision_mission', 'vision_title', 'Our Vision', 'text'),
('about', 'vision_mission', 'vision_description', 'To be the most trusted and innovative construction company in Pakistan, recognized for excellence, integrity, and sustainable practices that shape the future of infrastructure development.', 'textarea'),
('about', 'vision_mission', 'mission_title', 'Our Mission', 'text'),
('about', 'vision_mission', 'mission_description', 'To deliver exceptional construction and engineering solutions that exceed client expectations, while fostering a culture of safety, innovation, and environmental responsibility.', 'textarea'),
('about', 'values', 'value_1_title', 'Integrity', 'text'),
('about', 'values', 'value_1_description', 'We conduct our business with the highest ethical standards, transparency, and honesty in all our dealings.', 'textarea'),
('about', 'values', 'value_2_title', 'Excellence', 'text'),
('about', 'values', 'value_2_description', 'We strive for excellence in every aspect of our work, from planning and design to execution and delivery.', 'textarea'),
('about', 'values', 'value_3_title', 'Innovation', 'text'),
('about', 'values', 'value_3_description', 'We embrace new technologies and methodologies to deliver cutting-edge solutions for our clients.', 'textarea'),
('about', 'values', 'value_4_title', 'Safety', 'text'),
('about', 'values', 'value_4_description', 'The safety of our people, partners, and communities is paramount in everything we do.', 'textarea'),
('about', 'values', 'value_5_title', 'Sustainability', 'text'),
('about', 'values', 'value_5_description', 'We are committed to environmentally responsible practices and sustainable construction methods.', 'textarea'),
('about', 'values', 'value_6_title', 'Collaboration', 'text'),
('about', 'values', 'value_6_description', 'We believe in the power of teamwork and partnership to achieve extraordinary results.', 'textarea'),
('about', 'strengths', 'strength_1_title', '25+ Years Experience', 'text'),
('about', 'strengths', 'strength_1_description', 'Over two decades of successful project delivery across diverse sectors.', 'textarea'),
('about', 'strengths', 'strength_2_title', 'Expert Team', 'text'),
('about', 'strengths', 'strength_2_description', '150+ skilled professionals including engineers, architects, and project managers.', 'textarea'),
('about', 'strengths', 'strength_3_title', 'Quality Assurance', 'text'),
('about', 'strengths', 'strength_3_description', 'Rigorous quality control processes ensuring every project meets the highest standards.', 'textarea'),
('about', 'strengths', 'strength_4_title', 'On-Time Delivery', 'text'),
('about', 'strengths', 'strength_4_description', 'Proven track record of completing projects within agreed timelines and budgets.', 'textarea'),
('about', 'team', 'badge', 'Our Leadership', 'text'),
('about', 'team', 'title', 'Meet Our Team', 'text'),
('about', 'team', 'description', 'Our leadership team brings decades of combined experience in construction, engineering, and project management.', 'textarea');

-- Services Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('services', 'hero', 'title', 'Our Services', 'text'),
('services', 'hero', 'description', 'Comprehensive construction and engineering solutions tailored to your needs.', 'textarea'),
('services', 'overview', 'badge', 'What We Offer', 'text'),
('services', 'overview', 'title', 'Complete Construction Solutions', 'text'),
('services', 'overview', 'description', 'From initial concept to final handover, we provide end-to-end construction and engineering services.', 'textarea');

-- Projects Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('projects', 'hero', 'title', 'Our Projects', 'text'),
('projects', 'hero', 'description', 'Explore our portfolio of landmark construction projects.', 'textarea'),
('projects', 'filters', 'all_text', 'All Projects', 'text'),
('projects', 'filters', 'filter_label', 'Filter by Category', 'text');

-- Gallery Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('gallery', 'hero', 'title', 'Project Gallery', 'text'),
('gallery', 'hero', 'description', 'Visual journey through our completed projects and construction milestones.', 'textarea'),
('gallery', 'filters', 'all_text', 'All Photos', 'text'),
('gallery', 'filters', 'filter_label', 'Filter by Category', 'text');

-- Contact Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('contact', 'hero', 'title', 'Get in Touch', 'text'),
('contact', 'hero', 'description', 'We''d love to hear from you. Reach out for inquiries, partnerships, or project discussions.', 'textarea'),
('contact', 'form', 'form_title', 'Send us a Message', 'text'),
('contact', 'form', 'subtitle_form', 'Fill out the form below and we''ll get back to you within 24 hours.', 'textarea'),
('contact', 'form', 'sending_text', 'Sending...', 'text'),
('contact', 'form', 'success_title', 'Message Sent!', 'text'),
('contact', 'form', 'success_message', 'Thank you for reaching out. We will get back to you shortly.', 'textarea'),
('contact', 'form', 'error_message', 'Something went wrong. Please try again or contact us directly.', 'textarea'),
('contact', 'form', 'send_another', 'Send Another Message', 'text'),
('contact', 'form', 'label_name', 'Full Name', 'text'),
('contact', 'form', 'label_email', 'Email Address', 'text'),
('contact', 'form', 'label_phone', 'Phone Number', 'text'),
('contact', 'form', 'label_company', 'Company Name', 'text'),
('contact', 'form', 'label_inquiry_type', 'Inquiry Type', 'text'),
('contact', 'form', 'label_subject', 'Subject', 'text'),
('contact', 'form', 'label_message', 'Your Message', 'text'),
('contact', 'info', 'label_address', 'Office Address', 'text'),
('contact', 'info', 'label_hours', 'Business Hours', 'text'),
('contact', 'info', 'whatsapp_text', 'WhatsApp Us', 'text'),
('contact', 'info', 'whatsapp_subtext', 'Quick response on WhatsApp', 'text'),
('contact', 'info', 'inquiry_general', 'General Inquiry', 'text'),
('contact', 'info', 'inquiry_project', 'Project Inquiry', 'text'),
('contact', 'info', 'inquiry_partnership', 'Partnership', 'text'),
('contact', 'info', 'inquiry_career', 'Career Inquiry', 'text');

-- Careers Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('careers', 'hero', 'title', 'Join Our Team', 'text'),
('careers', 'hero', 'description', 'Build your career with a company that values excellence, innovation, and growth.', 'textarea'),
('careers', 'job', 'search_placeholder', 'Search positions...', 'text'),
('careers', 'application', 'requirements_title', 'Requirements', 'text'),
('careers', 'application', 'benefits_title', 'Benefits', 'text'),
('careers', 'application', 'apply_button', 'Apply Now', 'text'),
('careers', 'application', 'label_resume', 'Resume / CV', 'text'),
('careers', 'application', 'label_cover', 'Cover Letter', 'text'),
('careers', 'application', 'label_linkedin', 'LinkedIn Profile', 'text'),
('careers', 'application', 'label_portfolio', 'Portfolio URL', 'text'),
('careers', 'application', 'submit_button', 'Submit Application', 'text');

-- Blog Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('blog', 'hero', 'title', 'Latest Insights', 'text'),
('blog', 'hero', 'description', 'Stay updated with the latest trends, news, and insights from the construction industry.', 'textarea'),
('blog', 'filters', 'all_text', 'All Posts', 'text'),
('blog', 'filters', 'tags_title', 'Tags', 'text'),
('blog', 'detail', 'featured_label', 'Featured Article', 'text');

-- Clients Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('clients', 'hero', 'title', 'Our Valued Clients', 'text'),
('clients', 'hero', 'description', 'We are proud to serve leading organizations across government and private sectors.', 'textarea'),
('clients', 'government', 'badge', 'Government Clients', 'text'),
('clients', 'government', 'title', 'Public Sector Partners', 'text'),
('clients', 'private', 'badge', 'Private Clients', 'text'),
('clients', 'private', 'title', 'Private Sector Partners', 'text');

-- Certifications Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('certifications', 'hero', 'title', 'Our Certifications', 'text'),
('certifications', 'hero', 'description', 'Internationally recognized certifications validating our commitment to quality and excellence.', 'textarea'),
('certifications', 'iso', 'issuing_authority_label', 'Issuing Authority', 'text'),
('certifications', 'iso', 'certificate_no_label', 'Certificate Number', 'text'),
('certifications', 'iso', 'issue_date_label', 'Issue Date', 'text'),
('certifications', 'registrations', 'reg_no_label', 'Registration Number', 'text'),
('certifications', 'registrations', 'download_text', 'Download Certificate', 'text');