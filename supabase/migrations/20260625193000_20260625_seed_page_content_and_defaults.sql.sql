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
('home', 'cta', 'secondary_button_text', 'Contact Us', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

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
('about', 'team', 'description', 'Our leadership team brings decades of combined experience in construction, engineering, and project management.', 'textarea')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

-- Services Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('services', 'hero', 'title', 'Our Services', 'text'),
('services', 'hero', 'description', 'Comprehensive construction and engineering solutions tailored to your needs.', 'textarea'),
('services', 'overview', 'badge', 'What We Offer', 'text'),
('services', 'overview', 'title', 'Complete Construction Solutions', 'text'),
('services', 'overview', 'description', 'From initial concept to final handover, we provide end-to-end construction and engineering services.', 'textarea')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

-- Projects Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('projects', 'hero', 'title', 'Our Projects', 'text'),
('projects', 'hero', 'description', 'Explore our portfolio of landmark construction projects.', 'textarea'),
('projects', 'filters', 'all_text', 'All Projects', 'text'),
('projects', 'filters', 'filter_label', 'Filter by Category', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

-- Gallery Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('gallery', 'hero', 'title', 'Project Gallery', 'text'),
('gallery', 'hero', 'description', 'Visual journey through our completed projects and construction milestones.', 'textarea'),
('gallery', 'filters', 'all_text', 'All Photos', 'text'),
('gallery', 'filters', 'filter_label', 'Filter by Category', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

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
('contact', 'info', 'inquiry_career', 'Career Inquiry', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

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
('careers', 'application', 'submit_button', 'Submit Application', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

-- Blog Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('blog', 'hero', 'title', 'Latest Insights', 'text'),
('blog', 'hero', 'description', 'Stay updated with the latest trends, news, and insights from the construction industry.', 'textarea'),
('blog', 'filters', 'all_text', 'All Posts', 'text'),
('blog', 'filters', 'tags_title', 'Tags', 'text'),
('blog', 'detail', 'featured_label', 'Featured Article', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

-- Clients Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('clients', 'hero', 'title', 'Our Valued Clients', 'text'),
('clients', 'hero', 'description', 'We are proud to serve leading organizations across government and private sectors.', 'textarea'),
('clients', 'government', 'badge', 'Government Clients', 'text'),
('clients', 'government', 'title', 'Public Sector Partners', 'text'),
('clients', 'private', 'badge', 'Private Clients', 'text'),
('clients', 'private', 'title', 'Private Sector Partners', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

-- Certifications Page Content
INSERT INTO page_content (page_id, section_key, content_key, content_value, content_type) VALUES
('certifications', 'hero', 'title', 'Our Certifications', 'text'),
('certifications', 'hero', 'description', 'Internationally recognized certifications validating our commitment to quality and excellence.', 'textarea'),
('certifications', 'iso', 'issuing_authority_label', 'Issuing Authority', 'text'),
('certifications', 'iso', 'certificate_no_label', 'Certificate Number', 'text'),
('certifications', 'iso', 'issue_date_label', 'Issue Date', 'text'),
('certifications', 'registrations', 'reg_no_label', 'Registration Number', 'text'),
('certifications', 'registrations', 'download_text', 'Download Certificate', 'text')
ON CONFLICT (page_id, section_key, content_key) DO NOTHING;

-- Seed default statistics
INSERT INTO statistics (stat_key, stat_value, stat_prefix, stat_suffix, description, order_index, is_active) VALUES
('years_experience', '25', '', '+', 'Years of Excellence', 1, true),
('projects_completed', '500', '', '+', 'Projects Delivered', 2, true),
('happy_clients', '350', '', '+', 'Satisfied Clients', 3, true),
('team_members', '150', '', '+', 'Expert Team Members', 4, true)
ON CONFLICT (stat_key) DO NOTHING;

-- Seed default SEO settings
INSERT INTO seo_settings (page_id, meta_title, meta_description, meta_keywords) VALUES
('home', 'Eden Buildcore - Building Excellence Since 2008', 'Leading construction company in Pakistan specializing in commercial, residential, and infrastructure projects.', 'construction, building, Pakistan, commercial, residential, infrastructure'),
('about', 'About Eden Buildcore - Our Story & Mission', 'Learn about Eden Buildcore, our history, mission, values, and the team behind our construction excellence.', 'about, company, history, mission, team'),
('services', 'Our Services - Construction & Engineering Solutions', 'Comprehensive construction services including commercial buildings, residential projects, and infrastructure development.', 'services, construction, engineering, commercial, residential'),
('projects', 'Our Projects - Portfolio of Excellence', 'Explore our portfolio of completed construction projects across Pakistan including commercial, residential, and infrastructure.', 'projects, portfolio, construction, completed'),
('clients', 'Our Clients - Trusted Partners', 'Proudly serving government agencies and private sector leaders across Pakistan.', 'clients, partners, government, private'),
('contact', 'Contact Us - Get In Touch', 'Contact Eden Buildcore for your construction projects. Reach us via phone, email, or visit our office.', 'contact, email, phone, address, inquiry'),
('careers', 'Careers - Join Our Team', 'Build your career with Eden Buildcore. Explore open positions in construction and engineering.', 'careers, jobs, hiring, construction careers'),
('blog', 'Blog - News & Insights', 'Stay updated with the latest trends, insights, and news from the construction industry.', 'blog, news, insights, construction trends'),
('gallery', 'Gallery - Project Showcase', 'Visual showcase of our completed projects, construction sites, and engineering achievements.', 'gallery, projects, photos, construction'),
('certifications', 'Certifications - Quality Standards', 'Internationally recognized certifications ensuring the highest standards of quality and safety.', 'certifications, ISO, quality, safety')
ON CONFLICT (page_id) DO NOTHING;

-- Seed default page heroes
INSERT INTO page_heroes (page_id, title, subtitle, background_image_url, overlay_opacity, text_color, text_alignment, height, button_text, button_url) VALUES
('home', 'Building Tomorrow''s Landmarks Today', 'Welcome to Eden Buildcore', 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg', 0.70, '#ffffff', 'center', 'lg', 'Explore Our Projects', '/projects'),
('about', 'About Eden Buildcore', 'Leading the future of construction with innovation, integrity, and excellence.', 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg', 0.70, '#ffffff', 'center', 'md', '', ''),
('services', 'Our Services', 'Comprehensive construction and engineering solutions tailored to your needs.', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg', 0.70, '#ffffff', 'center', 'md', '', ''),
('projects', 'Our Projects', 'Explore our portfolio of landmark construction projects.', 'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg', 0.70, '#ffffff', 'center', 'md', '', ''),
('contact', 'Get in Touch', 'We''d love to hear from you. Reach out for inquiries, partnerships, or project discussions.', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg', 0.70, '#ffffff', 'center', 'md', '', ''),
('careers', 'Join Our Team', 'Build your career with a company that values excellence, innovation, and growth.', 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg', 0.70, '#ffffff', 'center', 'md', '', ''),
('blog', 'Latest Insights', 'Stay updated with the latest trends, news, and insights from the construction industry.', 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg', 0.70, '#ffffff', 'center', 'md', '', ''),
('gallery', 'Project Gallery', 'Visual journey through our completed projects and construction milestones.', 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg', 0.70, '#ffffff', 'center', 'md', '', ''),
('clients', 'Our Valued Clients', 'We are proud to serve leading organizations across government and private sectors.', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg', 0.70, '#ffffff', 'center', 'md', '', ''),
('certifications', 'Our Certifications', 'Internationally recognized certifications validating our commitment to quality and excellence.', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', 0.70, '#ffffff', 'center', 'md', '', '')
ON CONFLICT (page_id) DO NOTHING;