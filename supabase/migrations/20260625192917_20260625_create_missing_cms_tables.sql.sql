-- Create page_content table for content editor
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

-- Create unique index for page_content
CREATE UNIQUE INDEX IF NOT EXISTS idx_page_content_unique ON page_content (page_id, section_key, content_key);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_content
CREATE POLICY "public_read_page_content" ON page_content FOR SELECT USING (true);
CREATE POLICY "admin_all_page_content" ON page_content FOR ALL USING (true);

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  background_image_url TEXT DEFAULT '',
  button_text VARCHAR(100) DEFAULT '',
  button_link VARCHAR(255) DEFAULT '',
  overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
  text_alignment VARCHAR(20) DEFAULT 'center',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_hero_slides" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_hero_slides" ON hero_slides FOR ALL USING (true);

-- Create company_profile table
CREATE TABLE IF NOT EXISTS company_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) DEFAULT '',
  content TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  icon_name VARCHAR(50) DEFAULT '',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_company_profile" ON company_profile FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_company_profile" ON company_profile FOR ALL USING (true);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT '',
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(100) DEFAULT '',
  description TEXT DEFAULT '',
  detailed_description TEXT DEFAULT '',
  client_name VARCHAR(255) DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  budget VARCHAR(100) DEFAULT '',
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'ongoing',
  featured BOOLEAN DEFAULT false,
  thumbnail_url TEXT DEFAULT '',
  images JSONB DEFAULT '[]',
  before_after_images JSONB DEFAULT '{"before": "", "after": ""}',
  video_url TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT true,
  view_count INT DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_projects" ON projects FOR ALL USING (true);

-- Create project_categories table
CREATE TABLE IF NOT EXISTS project_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT DEFAULT '',
  icon_name VARCHAR(50) DEFAULT '',
  image_url TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_project_categories" ON project_categories FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_project_categories" ON project_categories FOR ALL USING (true);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT '',
  slug VARCHAR(255) UNIQUE,
  short_description TEXT DEFAULT '',
  detailed_description TEXT DEFAULT '',
  icon_name VARCHAR(50) DEFAULT '',
  image_url TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_services" ON services FOR ALL USING (true);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  designation VARCHAR(255) DEFAULT '',
  department VARCHAR(100) DEFAULT '',
  bio TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  linkedin_url VARCHAR(255) DEFAULT '',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_team_members" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_team_members" ON team_members FOR ALL USING (true);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL DEFAULT '',
  logo_url TEXT DEFAULT '',
  website_url VARCHAR(255) DEFAULT '',
  description TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  client_type VARCHAR(50) DEFAULT 'private',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_clients" ON clients FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_clients" ON clients FOR ALL USING (true);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL DEFAULT '',
  client_designation VARCHAR(255) DEFAULT '',
  client_company VARCHAR(255) DEFAULT '',
  client_image_url TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  project_id UUID REFERENCES projects(id),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_testimonials" ON testimonials FOR ALL USING (true);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT '',
  issuing_authority VARCHAR(255) DEFAULT '',
  certificate_number VARCHAR(100) DEFAULT '',
  issue_date DATE,
  expiry_date DATE,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  document_url TEXT DEFAULT '',
  verification_url VARCHAR(255) DEFAULT '',
  category VARCHAR(100) DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_certifications" ON certifications FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_certifications" ON certifications FOR ALL USING (true);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  category VARCHAR(100) DEFAULT '',
  type VARCHAR(20) DEFAULT 'image',
  video_url TEXT DEFAULT '',
  project_id UUID REFERENCES projects(id),
  is_featured BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_gallery_items" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_gallery_items" ON gallery_items FOR ALL USING (true);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT '',
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  featured_image_url TEXT DEFAULT '',
  category VARCHAR(100) DEFAULT '',
  tags JSONB DEFAULT '[]',
  author_id UUID REFERENCES admin_users(id),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  view_count INT DEFAULT 0,
  reading_time INT DEFAULT 5,
  meta_title VARCHAR(255) DEFAULT '',
  meta_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_blog_posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_blog_posts" ON blog_posts FOR ALL USING (true);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_blog_categories" ON blog_categories FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_blog_categories" ON blog_categories FOR ALL USING (true);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT '',
  slug VARCHAR(255) UNIQUE,
  department VARCHAR(100) DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  employment_type VARCHAR(50) DEFAULT '',
  experience_level VARCHAR(50) DEFAULT '',
  salary_range VARCHAR(100) DEFAULT '',
  description TEXT DEFAULT '',
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

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_jobs" ON jobs FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_jobs" ON jobs FOR ALL USING (true);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  cover_letter TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  portfolio_url VARCHAR(255) DEFAULT '',
  linkedin_url VARCHAR(255) DEFAULT '',
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_job_applications" ON job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_job_applications" ON job_applications FOR ALL USING (true);

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  company VARCHAR(255) DEFAULT '',
  subject VARCHAR(255) DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  inquiry_type VARCHAR(50) DEFAULT 'general',
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(20) DEFAULT 'normal',
  notes TEXT DEFAULT '',
  assigned_to UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_contact_inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_contact_inquiries" ON contact_inquiries FOR ALL USING (true);

-- Create statistics table
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stat_key VARCHAR(100) UNIQUE NOT NULL,
  stat_value VARCHAR(100) DEFAULT '',
  stat_icon VARCHAR(50) DEFAULT '',
  stat_suffix VARCHAR(20) DEFAULT '',
  stat_prefix VARCHAR(20) DEFAULT '',
  description TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_statistics" ON statistics FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_statistics" ON statistics FOR ALL USING (true);

-- Create media_library table
CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL DEFAULT '',
  original_name VARCHAR(255) DEFAULT '',
  file_url TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  file_size INT,
  mime_type VARCHAR(100) DEFAULT '',
  width INT,
  height INT,
  alt_text VARCHAR(255) DEFAULT '',
  uploaded_by UUID REFERENCES admin_users(id),
  folder VARCHAR(100) DEFAULT '',
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_media_library" ON media_library FOR SELECT USING (true);
CREATE POLICY "admin_all_media_library" ON media_library FOR ALL USING (true);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT '',
  slug VARCHAR(255) UNIQUE,
  content TEXT DEFAULT '',
  meta_title VARCHAR(255) DEFAULT '',
  meta_description TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  show_in_menu BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_pages" ON pages FOR ALL USING (true);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  message TEXT DEFAULT '',
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_notifications" ON notifications FOR ALL USING (true);

-- Create seo_settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id VARCHAR(50) NOT NULL UNIQUE,
  meta_title VARCHAR(255) DEFAULT '',
  meta_description TEXT DEFAULT '',
  meta_keywords TEXT DEFAULT '',
  og_title VARCHAR(255) DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  schema_type VARCHAR(50) DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "admin_all_seo_settings" ON seo_settings FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_page_content_page_id ON page_content(page_id);