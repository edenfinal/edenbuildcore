-- Create page_heroes table
CREATE TABLE IF NOT EXISTS page_heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  subtitle TEXT DEFAULT '',
  background_image_url TEXT DEFAULT '',
  background_overlay BOOLEAN DEFAULT true,
  overlay_color VARCHAR(20) DEFAULT '#000000',
  overlay_opacity DECIMAL(3,2) DEFAULT 0.70,
  text_color VARCHAR(20) DEFAULT '#ffffff',
  text_alignment VARCHAR(20) DEFAULT 'center',
  height VARCHAR(20) DEFAULT 'md',
  button_text VARCHAR(100) DEFAULT '',
  button_url TEXT DEFAULT '',
  secondary_button_text VARCHAR(100) DEFAULT '',
  secondary_button_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_heroes ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "public_read_page_heroes" ON page_heroes FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "admin_all_page_heroes" ON page_heroes FOR ALL USING (true);

-- Insert default heroes for all pages
INSERT INTO page_heroes (page_id, title, subtitle, background_image_url, height) VALUES
('home', 'Building Tomorrow''s Landmarks Today', 'Leading construction and engineering company delivering excellence in civil construction, infrastructure development, and building solutions across Pakistan.', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80', 'full'),
('about', 'About Eden Buildcore', 'Leading the future of construction with innovation, integrity, and excellence.', 'https://images.unsplash.com/photo-1504307651254-35680f27211e?w=1920&q=80', 'md'),
('services', 'Our Services', 'Comprehensive construction and engineering solutions tailored to your needs.', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80', 'md'),
('projects', 'Our Projects', 'Explore our portfolio of landmark construction projects.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80', 'md'),
('gallery', 'Project Gallery', 'Visual journey through our completed projects and construction milestones.', 'https://images.unsplash.com/photo-1487958449943-5b3b73cee953?w=1920&q=80', 'md'),
('contact', 'Get in Touch', 'We''d love to hear from you. Reach out for inquiries, partnerships, or project discussions.', 'https://images.unsplash.com/photo-1503387762-592deb5834db?w=1920&q=80', 'md'),
('careers', 'Join Our Team', 'Build your career with a company that values excellence, innovation, and growth.', 'https://images.unsplash.com/photo-1521737711867-e3b9733f5a30?w=1920&q=80', 'md'),
('blog', 'Latest Insights', 'Stay updated with the latest trends, news, and insights from the construction industry.', 'https://images.unsplash.com/photo-1504711434969-e338861b2432?w=1920&q=80', 'md'),
('clients', 'Our Valued Clients', 'We are proud to serve leading organizations across government and private sectors.', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&q=80', 'md'),
('certifications', 'Our Certifications', 'Internationally recognized certifications validating our commitment to quality and excellence.', 'https://images.unsplash.com/photo-1450101499163-c2b9fa17214e?w=1920&q=80', 'md');