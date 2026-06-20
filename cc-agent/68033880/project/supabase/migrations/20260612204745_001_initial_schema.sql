-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) DEFAULT 'Eden Buildcore (Pvt.) Ltd.',
  site_tagline VARCHAR(500),
  site_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  footer_text TEXT,
  copyright_text TEXT,
  address TEXT,
  phone VARCHAR(100),
  email VARCHAR(255),
  whatsapp VARCHAR(50),
  google_maps_embed TEXT,
  business_hours JSONB DEFAULT '{"weekday": "9:00 AM - 6:00 PM", "saturday": "9:00 AM - 2:00 PM", "sunday": "Closed"}',
  social_links JSONB DEFAULT '{"facebook": "", "instagram": "", "linkedin": "", "twitter": "", "youtube": ""}',
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  seo_enabled BOOLEAN DEFAULT true,
  google_analytics_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (id) VALUES (uuid_generate_v4());

-- Hero Slides Table
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  background_image_url TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
  text_alignment VARCHAR(20) DEFAULT 'center',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Profile Sections
CREATE TABLE company_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255),
  content TEXT,
  image_url TEXT,
  icon_name VARCHAR(50),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(100),
  description TEXT,
  detailed_description TEXT,
  client_name VARCHAR(255),
  location VARCHAR(255),
  budget VARCHAR(100),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'ongoing',
  featured BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  images JSONB DEFAULT '[]',
  before_after_images JSONB DEFAULT '{"before": "", "after": ""}',
  video_url TEXT,
  highlights JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT true,
  view_count INT DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Categories
CREATE TABLE project_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  icon_name VARCHAR(50),
  image_url TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  short_description TEXT,
  detailed_description TEXT,
  icon_name VARCHAR(50),
  image_url TEXT,
  features JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  department VARCHAR(100),
  bio TEXT,
  image_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin_url VARCHAR(255),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients Table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url VARCHAR(255),
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  client_type VARCHAR(50) DEFAULT 'private',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  client_designation VARCHAR(255),
  client_company VARCHAR(255),
  client_image_url TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  project_id UUID REFERENCES projects(id),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications Table
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  issuing_authority VARCHAR(255),
  certificate_number VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  description TEXT,
  image_url TEXT,
  document_url TEXT,
  verification_url VARCHAR(255),
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(100),
  type VARCHAR(20) DEFAULT 'image',
  video_url TEXT,
  project_id UUID REFERENCES projects(id),
  is_featured BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]',
  author_id UUID REFERENCES admin_users(id),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  view_count INT DEFAULT 0,
  reading_time INT DEFAULT 5,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Categories
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Careers / Jobs Table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  department VARCHAR(100),
  location VARCHAR(255),
  employment_type VARCHAR(50),
  experience_level VARCHAR(50),
  salary_range VARCHAR(100),
  description TEXT,
  requirements JSONB DEFAULT '[]',
  responsibilities JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  application_deadline DATE,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  openings INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Inquiries Table
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  inquiry_type VARCHAR(50) DEFAULT 'general',
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(20) DEFAULT 'normal',
  notes TEXT,
  assigned_to UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Statistics Table
CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stat_key VARCHAR(100) UNIQUE NOT NULL,
  stat_value VARCHAR(100),
  stat_icon VARCHAR(50),
  stat_suffix VARCHAR(20),
  stat_prefix VARCHAR(20),
  description TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default statistics
INSERT INTO statistics (stat_key, stat_value, stat_prefix, stat_suffix, description, order_index) VALUES
('years_experience', '25', '', '+', 'Years of Excellence', 1),
('projects_completed', '500', '', '+', 'Projects Delivered', 2),
('happy_clients', '350', '', '+', 'Satisfied Clients', 3),
('team_members', '150', '', '+', 'Expert Team Members', 4);

-- Activity Logs Table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Library Table
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INT,
  mime_type VARCHAR(100),
  width INT,
  height INT,
  alt_text VARCHAR(255),
  uploaded_by UUID REFERENCES admin_users(id),
  folder VARCHAR(100),
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages Table (for dynamic pages)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  show_in_menu BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor Analytics Table
CREATE TABLE visitor_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255),
  ip_address VARCHAR(50),
  user_agent TEXT,
  page_visited VARCHAR(255),
  referrer VARCHAR(255),
  country VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  visit_duration INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "public_read_hero_slides" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_company_profile" ON company_profile FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_project_categories" ON project_categories FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_team_members" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_clients" ON clients FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_certifications" ON certifications FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_gallery" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_blog_posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_blog_categories" ON blog_categories FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_jobs" ON jobs FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_statistics" ON statistics FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_pages" ON pages FOR SELECT USING (is_published = true);

-- Public write policies for forms
CREATE POLICY "public_insert_job_applications" ON job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_contact_inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_visitor_analytics" ON visitor_analytics FOR INSERT WITH CHECK (true);

-- Admin full access policies (will be refined with auth)
CREATE POLICY "admin_all_hero_slides" ON hero_slides FOR ALL USING (true);
CREATE POLICY "admin_all_company_profile" ON company_profile FOR ALL USING (true);
CREATE POLICY "admin_all_projects" ON projects FOR ALL USING (true);
CREATE POLICY "admin_all_project_categories" ON project_categories FOR ALL USING (true);
CREATE POLICY "admin_all_services" ON services FOR ALL USING (true);
CREATE POLICY "admin_all_team_members" ON team_members FOR ALL USING (true);
CREATE POLICY "admin_all_clients" ON clients FOR ALL USING (true);
CREATE POLICY "admin_all_testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "admin_all_certifications" ON certifications FOR ALL USING (true);
CREATE POLICY "admin_all_gallery" ON gallery_items FOR ALL USING (true);
CREATE POLICY "admin_all_blog_posts" ON blog_posts FOR ALL USING (true);
CREATE POLICY "admin_all_blog_categories" ON blog_categories FOR ALL USING (true);
CREATE POLICY "admin_all_jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "admin_all_job_applications" ON job_applications FOR ALL USING (true);
CREATE POLICY "admin_all_contact_inquiries" ON contact_inquiries FOR ALL USING (true);
CREATE POLICY "admin_all_statistics" ON statistics FOR ALL USING (true);
CREATE POLICY "admin_all_activity_logs" ON activity_logs FOR ALL USING (true);
CREATE POLICY "admin_all_media_library" ON media_library FOR ALL USING (true);
CREATE POLICY "admin_all_pages" ON pages FOR ALL USING (true);
CREATE POLICY "admin_all_site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "admin_all_admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "admin_all_visitor_analytics" ON visitor_analytics FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_gallery_category ON gallery_items(category);
CREATE INDEX idx_visitor_analytics_created ON visitor_analytics(created_at);