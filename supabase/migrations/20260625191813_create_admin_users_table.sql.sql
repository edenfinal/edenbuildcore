-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) DEFAULT '',
  role VARCHAR(20) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policy (for login check)
CREATE POLICY "public_read_admin_users" ON admin_users FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "admin_all_admin_users" ON admin_users FOR ALL USING (true);

-- Insert default admin user with password 'admin123' (bcrypt hash)
-- Note: In production, this should be changed immediately
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('admin@edenbuildcore.com', '$2a$10$YourHashHereReplaceInProduction', 'Admin User', 'admin');