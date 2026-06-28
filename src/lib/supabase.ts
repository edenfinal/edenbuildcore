import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Centralized image upload utility — uses edge function with service role to bypass RLS
export async function uploadImage(
  file: File,
  folder: string = 'misc'
): Promise<{ url: string | null; error: string | null }> {
  if (!file.type.startsWith('image/')) {
    return { url: null, error: 'Only image files are allowed' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: 'File too large (max 5MB)' };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(
      `${supabaseUrl}/functions/v1/upload-image`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey || '',
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || result.error) {
      return { url: null, error: result.error || `Upload failed (${response.status})` };
    }

    return { url: result.url, error: null };
  } catch (e: any) {
    return { url: null, error: e?.message || 'Upload failed' };
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Database Types
export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatar_url?: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_tagline: string | null;
  site_description: string | null;
  logo_url: string | null;
  secondary_logo_url: string | null;
  favicon_url: string | null;
  footer_text: string | null;
  copyright_text: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  google_maps_embed: string | null;
  business_hours: Json;
  social_links: Json;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  seo_enabled: boolean;
  google_analytics_id: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  heading_font: string | null;
  body_font: string | null;
  bg_color: string | null;
  text_color: string | null;
  border_color: string | null;
  button_hover_color: string | null;
  card_bg_color: string | null;
  card_border_color: string | null;
  nav_bg_color: string | null;
  footer_bg_color: string | null;
  hero_overlay_color: string | null;
  hero_overlay_opacity: number | null;
  shadow_color: string | null;
  shadow_intensity: string | null;
  border_radius: string | null;
  spacing_scale: string | null;
  link_hover_color: string | null;
  muted_text_color: string | null;
  success_color: string | null;
  warning_color: string | null;
  error_color: string | null;
  company_start_year: number | null;
  logo_size: string | null;
  logo_scale: string | null;
  founder_name: string | null;
  founder_designation: string | null;
  founder_bio: string | null;
  founder_image_url: string | null;
  founder_message: string | null;
  about_image_url: string | null;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  background_image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  button2_text: string | null;
  button2_link: string | null;
  line_two: string | null;
  overlay_opacity: number;
  text_alignment: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  icon_name: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  description: string | null;
  detailed_description: string | null;
  client_name: string | null;
  location: string | null;
  budget: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  featured: boolean;
  thumbnail_url: string | null;
  images: Json;
  before_after_images: Json;
  video_url: string | null;
  highlights: Json;
  is_published: boolean;
  view_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string | null;
  short_description: string | null;
  detailed_description: string | null;
  icon_name: string | null;
  image_url: string | null;
  features: Json;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  full_name: string;
  designation: string | null;
  department: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  is_featured: boolean;
  client_type: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_designation: string | null;
  client_company: string | null;
  client_image_url: string | null;
  content: string;
  rating: number;
  project_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  issuing_authority: string | null;
  certificate_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  description: string | null;
  image_url: string | null;
  document_url: string | null;
  verification_url: string | null;
  category: string | null;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  category: string | null;
  type: string;
  video_url: string | null;
  project_id: string | null;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  category: string | null;
  tags: Json;
  author_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  reading_time: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string | null;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  experience_level: string | null;
  salary_range: string | null;
  description: string | null;
  requirements: Json;
  responsibilities: Json;
  benefits: Json;
  application_deadline: string | null;
  is_featured: boolean;
  is_active: boolean;
  openings: number;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  inquiry_type: string;
  status: string;
  priority: string;
  notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface Statistic {
  id: string;
  stat_key: string;
  stat_value: string | null;
  stat_icon: string | null;
  stat_suffix: string | null;
  stat_prefix: string | null;
  description: string | null;
  order_index: number;
  is_active: boolean;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Json;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface MediaLibrary {
  id: string;
  filename: string;
  original_name: string | null;
  file_url: string;
  thumbnail_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  uploaded_by: string | null;
  folder: string | null;
  tags: Json;
  created_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  show_in_menu: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  id: string;
  page_id: string;
  section_key: string;
  content_key: string;
  content_value: string;
  content_type: string;
  created_at: string;
  updated_at: string;
}

export interface PageHero {
  id: string;
  page_id: string;
  title: string | null;
  subtitle: string | null;
  line_two: string | null;
  description: string | null;
  background_image_url: string | null;
  overlay_opacity: number;
  text_alignment: string;
  button_text: string | null;
  button_link: string | null;
  button2_text: string | null;
  button2_link: string | null;
  show_button: boolean;
  height: string;
  text_color: string;
  overlay_color: string;
  is_active: boolean;
  is_carousel: boolean;
  slide_interval: number;
  image_width: number | null;
  image_height: number | null;
  animation_speed: number;
  created_at: string;
  updated_at: string;
}

export interface VisitorAnalytics {
  id: string;
  session_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  page_visited: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  visit_duration: number | null;
  created_at: string;
}
