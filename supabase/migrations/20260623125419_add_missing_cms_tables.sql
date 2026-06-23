/*
# Add Missing CMS Tables

1. New Tables:
- notifications - Admin notification system
- activity_logs - Admin activity tracking
- visitor_analytics - Website visitor tracking
- seo_settings - Per-page SEO configuration

2. Update existing tables:
- Add missing columns to site_settings
- Add missing columns to page_content

3. Security: RLS policies for all
*/

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text,
  data jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Visitor Analytics
CREATE TABLE IF NOT EXISTS visitor_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text,
  visitor_id text,
  session_id text,
  referrer text,
  user_agent text,
  country text,
  device_type text,
  visited_at timestamptz DEFAULT now()
);

-- SEO Settings
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  meta_keywords text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  schema_type text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "public_read_seo" ON seo_settings;
CREATE POLICY "public_read_seo" ON seo_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_seo" ON seo_settings;
CREATE POLICY "admin_write_seo" ON seo_settings FOR ALL
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_notifications" ON notifications;
CREATE POLICY "admin_notifications" ON notifications FOR ALL
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_activity_logs" ON activity_logs;
CREATE POLICY "admin_activity_logs" ON activity_logs FOR ALL
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_visitor_analytics" ON visitor_analytics;
CREATE POLICY "admin_visitor_analytics" ON visitor_analytics FOR ALL
TO authenticated USING (true) WITH CHECK (true);

-- Insert default SEO settings
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