-- Create site_settings table with all required columns
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(100) DEFAULT 'Eden Buildcore',
  site_tagline VARCHAR(200) DEFAULT 'Building Excellence Since 2008',
  site_description TEXT DEFAULT 'Leading construction company in Pakistan',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  footer_text TEXT DEFAULT '',
  copyright_text VARCHAR(200) DEFAULT '2024 Eden Buildcore. All rights reserved.',
  address TEXT DEFAULT 'Plot 45, Industrial Area, Karachi, Pakistan',
  phone VARCHAR(50) DEFAULT '+92 300 1234567',
  email VARCHAR(100) DEFAULT 'info@edenbuildcore.com',
  whatsapp VARCHAR(50) DEFAULT '+92 300 1234567',
  google_maps_embed TEXT DEFAULT '',
  business_hours JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  meta_title VARCHAR(200) DEFAULT '',
  meta_description TEXT DEFAULT '',
  meta_keywords TEXT DEFAULT '',
  seo_enabled BOOLEAN DEFAULT true,
  google_analytics_id VARCHAR(50) DEFAULT '',
  -- Theme columns
  primary_color VARCHAR(20) DEFAULT '#c49028',
  secondary_color VARCHAR(20) DEFAULT '#030810',
  accent_color VARCHAR(20) DEFAULT '#c49028',
  bg_color VARCHAR(20) DEFAULT '#030810',
  text_color VARCHAR(20) DEFAULT '#ffffff',
  border_color VARCHAR(20) DEFAULT '#1e293b',
  button_hover_color VARCHAR(20) DEFAULT '#a67c1a',
  card_bg_color VARCHAR(20) DEFAULT '#0a1628',
  card_border_color VARCHAR(20) DEFAULT '#1e293b',
  nav_bg_color VARCHAR(20) DEFAULT '#030810',
  footer_bg_color VARCHAR(20) DEFAULT '#030810',
  hero_overlay_color VARCHAR(20) DEFAULT '#000000',
  hero_overlay_opacity DECIMAL(3,2) DEFAULT 0.70,
  shadow_color VARCHAR(20) DEFAULT '#000000',
  shadow_intensity DECIMAL(3,2) DEFAULT 0.20,
  border_radius VARCHAR(10) DEFAULT '0.5rem',
  spacing_scale VARCHAR(10) DEFAULT '1rem',
  link_hover_color VARCHAR(20) DEFAULT '#c49028',
  muted_text_color VARCHAR(20) DEFAULT '#94a3b8',
  success_color VARCHAR(20) DEFAULT '#22c55e',
  warning_color VARCHAR(20) DEFAULT '#f59e0b',
  error_color VARCHAR(20) DEFAULT '#ef4444',
  heading_font VARCHAR(100) DEFAULT 'Inter',
  body_font VARCHAR(100) DEFAULT 'Inter',
  secondary_logo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "admin_all_site_settings" ON site_settings FOR ALL USING (true);

-- Insert default row
INSERT INTO site_settings (site_name, site_tagline, site_description) 
VALUES ('Eden Buildcore', 'Building Excellence Since 2008', 'Leading construction company in Pakistan');