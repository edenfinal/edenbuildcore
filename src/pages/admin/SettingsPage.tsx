import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertCircle, CheckCircle, Globe, Phone, Clock, Palette, Type, Image as ImageIcon, Upload, X, Eye, LayoutGrid as Layout, Monitor, Sun, Moon, MousePointer, ArrowRight, Hash, Check, ChevronDown, Sparkles, Layers, Box, Ruler, CornerDownRight, Zap, Shield, Info, User } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';
import { supabase, uploadImage } from '../../lib/supabase';

/* ─── Constants ─── */
// Only fonts that are actually available on Google Fonts API
const ALL_FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif', category: 'Sans Serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'Serif' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', category: 'Serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif', category: 'Sans Serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'Sans Serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'Sans Serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif', category: 'Sans Serif' },
  { name: 'Lato', value: 'Lato, sans-serif', category: 'Sans Serif' },
  { name: 'Merriweather', value: 'Merriweather, serif', category: 'Serif' },
  { name: 'Source Sans 3', value: 'Source Sans 3, sans-serif', category: 'Sans Serif' },
  { name: 'Raleway', value: 'Raleway, sans-serif', category: 'Sans Serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif', category: 'Sans Serif' },
  { name: 'Oswald', value: 'Oswald, sans-serif', category: 'Display' },
  { name: 'Bebas Neue', value: 'Bebas Neue, sans-serif', category: 'Display' },
  { name: 'Josefin Sans', value: 'Josefin Sans, sans-serif', category: 'Sans Serif' },
  { name: 'Cinzel', value: 'Cinzel, serif', category: 'Display' },
  { name: 'Libre Baskerville', value: 'Libre Baskerville, serif', category: 'Serif' },
  { name: 'PT Serif', value: 'PT Serif, serif', category: 'Serif' },
  { name: 'Work Sans', value: 'Work Sans, sans-serif', category: 'Sans Serif' },
  { name: 'Karla', value: 'Karla, sans-serif', category: 'Sans Serif' },
  { name: 'Manrope', value: 'Manrope, sans-serif', category: 'Sans Serif' },
  { name: 'Space Grotesk', value: 'Space Grotesk, sans-serif', category: 'Sans Serif' },
  { name: 'DM Sans', value: 'DM Sans, sans-serif', category: 'Sans Serif' },
  { name: 'Sora', value: 'Sora, sans-serif', category: 'Sans Serif' },
  { name: 'Outfit', value: 'Outfit, sans-serif', category: 'Sans Serif' },
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans, sans-serif', category: 'Sans Serif' },
  { name: 'Syne', value: 'Syne, sans-serif', category: 'Display' },
  { name: 'Schibsted Grotesk', value: 'Schibsted Grotesk, sans-serif', category: 'Sans Serif' },
  { name: 'Quicksand', value: 'Quicksand, sans-serif', category: 'Sans Serif' },
  { name: 'Mulish', value: 'Mulish, sans-serif', category: 'Sans Serif' },
  { name: 'Figtree', value: 'Figtree, sans-serif', category: 'Sans Serif' },
  { name: 'Geist', value: 'Geist, sans-serif', category: 'Sans Serif' },
];

const COLOR_PRESETS = [
  { name: 'Gold', value: '#c49028', desc: 'Classic warm gold' },
  { name: 'Rose Gold', value: '#b76e79', desc: 'Elegant rose' },
  { name: 'Champagne', value: '#f7e7ce', desc: 'Soft champagne' },
  { name: 'Copper', value: '#b87333', desc: 'Rich copper' },
  { name: 'Bronze', value: '#cd7f32', desc: 'Deep bronze' },
  { name: 'Blue', value: '#3b82f6', desc: 'Vibrant blue' },
  { name: 'Navy Blue', value: '#1e3a5f', desc: 'Deep navy' },
  { name: 'Royal Blue', value: '#4169e1', desc: 'Royal elegance' },
  { name: 'Emerald', value: '#10b981', desc: 'Fresh emerald' },
  { name: 'Forest', value: '#228b22', desc: 'Deep forest' },
  { name: 'Teal', value: '#14b8a6', desc: 'Modern teal' },
  { name: 'Crimson', value: '#dc143c', desc: 'Bold crimson' },
  { name: 'Burgundy', value: '#800020', desc: 'Rich burgundy' },
  { name: 'Plum', value: '#8b5cf6', desc: 'Deep plum' },
  { name: 'Coral', value: '#ff7f50', desc: 'Warm coral' },
  { name: 'Amber', value: '#f59e0b', desc: 'Warm amber' },
  { name: 'Slate', value: '#64748b', desc: 'Professional slate' },
  { name: 'Charcoal', value: '#36454f', desc: 'Dark charcoal' },
  { name: 'Pure White', value: '#ffffff', desc: 'Clean white' },
  { name: 'Off White', value: '#f8fafc', desc: 'Soft white' },
];

const BG_PRESETS = [
  { name: 'Dark Navy', value: '#030810' },
  { name: 'Navy', value: '#071027' },
  { name: 'Midnight', value: '#0f172a' },
  { name: 'Black', value: '#000000' },
  { name: 'Charcoal', value: '#1a1a2e' },
  { name: 'Slate', value: '#1e293b' },
  { name: 'Zinc', value: '#18181b' },
  { name: 'Stone', value: '#1c1917' },
];

const RADIUS_OPTIONS = [
  { label: 'None', value: 'none', class: 'rounded-none' },
  { label: 'Small', value: 'sm', class: 'rounded-sm' },
  { label: 'Medium', value: 'md', class: 'rounded-md' },
  { label: 'Large', value: 'lg', class: 'rounded-lg' },
  { label: 'XL', value: 'xl', class: 'rounded-xl' },
  { label: '2XL', value: '2xl', class: 'rounded-2xl' },
  { label: '3XL', value: '3xl', class: 'rounded-3xl' },
  { label: 'Full', value: 'full', class: 'rounded-full' },
];

const SHADOW_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Heavy', value: 'heavy' },
  { label: 'Glow', value: 'glow' },
];

const SPACING_OPTIONS = [
  { label: 'Compact', value: 'compact' },
  { label: 'Normal', value: 'normal' },
  { label: 'Relaxed', value: 'relaxed' },
  { label: 'Spacious', value: 'spacious' },
];

/* ─── FileUpload Component ─── */
function FileUpload({
  label,
  currentUrl,
  onUpload,
  accept = 'image/*',
  bucket = 'site-assets',
}: {
  label: string;
  currentUrl: string;
  onUpload: (url: string) => void;
  accept?: string;
  bucket?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPreview(currentUrl); }, [currentUrl]);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large (max 5MB)');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const { url, error: uploadErr } = await uploadImage(file, 'logos');
      if (uploadErr || !url) {
        setUploadError(uploadErr || 'Upload failed');
        setUploading(false);
        return;
      }
      setPreview(url);
      onUpload(url);
    } catch (err: any) {
      console.error('Upload exception:', err);
      setUploadError(`Upload error: ${err?.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative border-2 border-dashed border-[#c49028]/20 rounded-xl p-4 hover:border-[#c49028]/40 transition-colors bg-[#030810]/40"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="h-16 w-auto object-contain mx-auto" onError={() => setPreview('')} />
            <button
              type="button"
              onClick={() => { setPreview(''); onUpload(''); setUploadError(''); }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors z-10"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <Upload className="w-8 h-8 text-[#c49028]/40 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
            <p className="text-[10px] text-gray-600 mt-1">Max 5MB, Images only</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {uploading && (
          <div className="absolute inset-0 bg-[#030810]/80 rounded-xl flex items-center justify-center z-20">
            <div className="w-6 h-6 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {uploadError && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {uploadError}
        </p>
      )}
    </div>
  );
}

/* ─── ColorPicker Component ─── */
function ColorPicker({
  label,
  value,
  onChange,
  presets = true,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  presets?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-[#c49028]/20 bg-transparent"
          />
          <div
            className="absolute inset-0 rounded-lg pointer-events-none border border-white/10"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#030810]/60 border border-[#c49028]/20 rounded-lg text-white text-sm font-mono uppercase"
          placeholder="#c49028"
        />
      </div>
      {presets && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {COLOR_PRESETS.slice(0, 12).map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(c.value)}
              title={c.name}
              className={`w-6 h-6 rounded-md border-2 transition-all ${
                value === c.value ? 'border-white scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── LivePreview Component ─── */
function LivePreview({ formData }: { formData: any }) {
  const primary = formData.primary_color || '#c49028';
  const secondary = formData.secondary_color || '#a67820';
  const accent = formData.accent_color || '#e8b84a';
  const bg = formData.bg_color || '#030810';
  const text = formData.text_color || '#ffffff';
  const cardBg = formData.card_bg_color || '#0c1a2e';
  const muted = formData.muted_text_color || '#909090';
  const hover = formData.button_hover_color || '#e8b84a';
  const linkHover = formData.link_hover_color || '#e8b84a';
  const success = formData.success_color || '#10b981';
  const warning = formData.warning_color || '#f59e0b';
  const error = formData.error_color || '#ef4444';

  const getRadiusClass = (val: string) => {
    const found = RADIUS_OPTIONS.find((r) => r.value === val);
    return found?.class || 'rounded-xl';
  };

  const getShadow = (val: string) => {
    switch (val) {
      case 'none': return 'none';
      case 'light': return '0 2px 8px rgba(0,0,0,0.15)';
      case 'medium': return '0 4px 20px rgba(0,0,0,0.25)';
      case 'heavy': return '0 8px 40px rgba(0,0,0,0.4)';
      case 'glow': return `0 0 30px ${primary}30`;
      default: return '0 4px 20px rgba(0,0,0,0.25)';
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#c49028]/10"
      style={{ backgroundColor: bg }}
    >
      <div className="px-4 py-3 border-b border-[#c49028]/10 flex items-center gap-2">
        <Monitor className="w-4 h-4 text-[#c49028]" />
        <span className="text-sm font-medium text-gray-300">Live Preview</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Navbar Preview */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: formData.nav_bg_color || '#030810' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: primary, color: bg }}>
              E
            </div>
            <span className="font-semibold text-sm" style={{ color: text }}>Eden</span>
          </div>
          <div className="flex gap-3 text-xs" style={{ color: muted }}>
            <span className="hover:underline cursor-pointer" style={{ '--hover-color': linkHover } as any}>Home</span>
            <span className="hover:underline cursor-pointer">About</span>
            <span className="hover:underline cursor-pointer">Contact</span>
          </div>
        </div>

        {/* Hero Preview */}
        <div
          className="relative p-6 text-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${formData.hero_overlay_color || '#071027'}ee, ${formData.hero_overlay_color || '#071027'}aa)`,
          }}
        >
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: formData.heading_font, color: text }}
          >
            Building <span style={{ color: primary }}>Excellence</span>
          </h2>
          <p className="text-xs mb-4" style={{ color: muted, fontFamily: formData.body_font }}>
            Premium construction solutions for modern infrastructure
          </p>
          <div className="flex gap-2 justify-center">
            <button
              className="px-4 py-1.5 text-xs font-bold transition-all"
              style={{
                backgroundColor: primary,
                color: bg,
                borderRadius: getRadiusClass(formData.border_radius).replace('rounded-', '') === 'full' ? '9999px' : '8px',
                boxShadow: getShadow(formData.shadow_intensity),
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; }}
            >
              Get Started
            </button>
            <button
              className="px-4 py-1.5 text-xs font-bold border-2 transition-all"
              style={{
                borderColor: primary,
                color: primary,
                borderRadius: getRadiusClass(formData.border_radius).replace('rounded-', '') === 'full' ? '9999px' : '8px',
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Cards Preview */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 border"
            style={{
              backgroundColor: cardBg,
              borderColor: formData.card_border_color || primary,
              borderRadius: getRadiusClass(formData.border_radius).replace('rounded-', '') === 'full' ? '12px' : undefined,
              boxShadow: getShadow(formData.shadow_intensity),
            }}
          >
            <div className="w-6 h-6 rounded-md mb-2 flex items-center justify-center" style={{ backgroundColor: `${primary}20` }}>
              <Layers className="w-3 h-3" style={{ color: primary }} />
            </div>
            <p className="text-xs font-medium" style={{ color: text }}>Projects</p>
            <p className="text-[10px]" style={{ color: muted }}>500+ completed</p>
          </div>
          <div
            className="p-3 border"
            style={{
              backgroundColor: cardBg,
              borderColor: formData.card_border_color || primary,
              borderRadius: getRadiusClass(formData.border_radius).replace('rounded-', '') === 'full' ? '12px' : undefined,
              boxShadow: getShadow(formData.shadow_intensity),
            }}
          >
            <div className="w-6 h-6 rounded-md mb-2 flex items-center justify-center" style={{ backgroundColor: `${success}20` }}>
              <Check className="w-3 h-3" style={{ color: success }} />
            </div>
            <p className="text-xs font-medium" style={{ color: text }}>Quality</p>
            <p className="text-[10px]" style={{ color: muted }}>ISO Certified</p>
          </div>
        </div>

        {/* Alerts Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: `${success}15`, color: success }}>
            <Check className="w-3 h-3" /> Success message
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: `${warning}15`, color: warning }}>
            <Info className="w-3 h-3" /> Warning message
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: `${error}15`, color: error }}>
            <AlertCircle className="w-3 h-3" /> Error message
          </div>
        </div>

        {/* Footer Preview */}
        <div
          className="px-4 py-3 text-center text-[10px]"
          style={{ backgroundColor: formData.footer_bg_color || '#030810', color: muted }}
        >
          {formData.copyright_text || '© 2024 Eden Buildcore. All rights reserved.'}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function SettingsPage() {
  const { settings, loading, updateSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [changed, setChanged] = useState(false);

  const defaults = {
    site_name: 'Eden Buildcore (Pvt.) Ltd.',
    site_tagline: "Building Tomorrow's Landmarks Today",
    site_description: '',
    logo_url: '',
    secondary_logo_url: '',
    favicon_url: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    google_maps_embed: '',
    business_hours: { weekday: '9:00 AM - 6:00 PM', saturday: '9:00 AM - 2:00 PM', sunday: 'Closed' },
    social_links: { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' },
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    google_analytics_id: '',
    copyright_text: '© 2024 Eden Buildcore (Pvt.) Ltd. All Rights Reserved.',
    primary_color: '#c49028',
    secondary_color: '#a67820',
    accent_color: '#e8b84a',
    heading_font: 'Playfair Display, serif',
    body_font: 'Inter, sans-serif',
    bg_color: '#030810',
    text_color: '#ffffff',
    border_color: '#c49028',
    button_hover_color: '#e8b84a',
    card_bg_color: '#0c1a2e',
    card_border_color: '#c49028',
    nav_bg_color: '#030810',
    footer_bg_color: '#030810',
    hero_overlay_color: '#071027',
    hero_overlay_opacity: 0.85,
    shadow_color: '#000000',
    shadow_intensity: 'medium',
    border_radius: 'xl',
    spacing_scale: 'normal',
    link_hover_color: '#e8b84a',
    muted_text_color: '#909090',
    success_color: '#10b981',
    warning_color: '#f59e0b',
    error_color: '#ef4444',
  };

  useEffect(() => {
    if (settings) {
      const merged = { ...defaults };
      Object.keys(settings).forEach((key) => {
        if (settings[key as keyof typeof settings] !== null && settings[key as keyof typeof settings] !== undefined) {
          (merged as any)[key] = settings[key as keyof typeof settings];
        }
      });
      setFormData(merged);
    }
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    setChanged(true);
  };

  const handleSocialChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      social_links: { ...(prev.social_links || {}), [key]: value },
    }));
    setChanged(true);
  };

  const handleHoursChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      business_hours: { ...(prev.business_hours || {}), [key]: value },
    }));
    setChanged(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const payload = { ...formData };
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    const success = await updateSettings(payload);
    setSaving(false);

    if (success) {
      setSaved(true);
      setChanged(false);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError('Failed to save settings. Please try again.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'seo', label: 'SEO', icon: Hash },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Site Settings</h1>
          <p className="text-gray-400 mt-1 text-sm">Full control over your website appearance and content</p>
        </div>
        {changed && (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg border border-amber-500/20">
            Unsaved changes
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#c49028]/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#c49028]/10 text-[#c49028] border border-[#c49028]/20'
                : 'text-[#909090] hover:text-white hover:bg-[#0c1a2e]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ─── General Tab ─── */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <SectionCard icon={Globe} title="General Settings">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <Input label="Site Name" value={formData.site_name} onChange={(v: string) => handleChange('site_name', v)} placeholder="Eden Buildcore (Pvt.) Ltd." />
                    <Input label="Site Tagline" value={formData.site_tagline} onChange={(v: string) => handleChange('site_tagline', v)} placeholder="Building Tomorrow's Landmarks Today" />
                    <div className="md:col-span-2">
                      <TextArea label="Site Description" value={formData.site_description} onChange={(v: string) => handleChange('site_description', v)} rows={3} placeholder="Brief description about your company..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Company Start Year</label>
                      <input
                        type="number"
                        value={formData.company_start_year || 2008}
                        onChange={(e) => handleChange('company_start_year', parseInt(e.target.value) || 2008)}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                        placeholder="2008"
                      />
                      <p className="text-[#606060] text-xs mt-1.5">Used to auto-calculate years of experience across the site</p>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard icon={ImageIcon} title="Logo & Branding">
                  <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                    <FileUpload label="Primary Logo" currentUrl={formData.logo_url} onUpload={(url: string) => handleChange('logo_url', url)} />
                    <FileUpload label="Secondary Logo (Wordmark)" currentUrl={formData.secondary_logo_url} onUpload={(url: string) => handleChange('secondary_logo_url', url)} />
                    <FileUpload label="Favicon" currentUrl={formData.favicon_url} onUpload={(url: string) => handleChange('favicon_url', url)} accept="image/x-icon,image/png" />
                  </div>
                  {/* Logo Size Settings */}
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Logo Height (px)</label>
                      <input
                        type="number"
                        value={formData.logo_size || '64'}
                        onChange={(e) => handleChange('logo_size', e.target.value)}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                        placeholder="64"
                      />
                      <p className="text-[#606060] text-xs mt-1.5">Navbar logo height in pixels</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Logo Scale Mode</label>
                      <select
                        value={formData.logo_scale || 'auto'}
                        onChange={(e) => handleChange('logo_scale', e.target.value)}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      >
                        <option value="auto">Auto Adjust (maintain aspect ratio)</option>
                        <option value="contain">Contain</option>
                        <option value="cover">Cover</option>
                        <option value="fill">Fill</option>
                      </select>
                      <p className="text-[#606060] text-xs mt-1.5">How the logo image fits within its container</p>
                    </div>
                  </div>
                  {/* Logo Preview */}
                  <div className="mt-4 p-4 bg-[#030810]/40 rounded-xl border border-[#c49028]/10">
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Logo Preview</p>
                    <div className="flex items-center gap-4">
                      {formData.logo_url ? (
                        <img src={formData.logo_url} alt="Logo" style={{ height: `${formData.logo_size || 64}px` }} className="w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-2xl font-heading font-bold text-white">{formData.site_name?.split(' ')[0] || 'EDEN'}</span>
                          <span className="text-xs text-[#c49028] tracking-widest uppercase">{formData.site_name?.split(' ')[1] || 'BUILDCORE'}</span>
                        </div>
                      )}
                      {formData.secondary_logo_url && (
                        <img src={formData.secondary_logo_url} alt="Wordmark" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard icon={Monitor} title="Footer">
                  <Input label="Copyright Text" value={formData.copyright_text} onChange={(v: string) => handleChange('copyright_text', v)} placeholder="© 2024 Eden Buildcore (Pvt.) Ltd. All Rights Reserved." />
                </SectionCard>

                {/* Founder Section */}
                <SectionCard icon={User} title="Founder / CEO Section">
                  <p className="text-gray-500 text-sm mb-4">This appears on the About page. Add your founder's information to showcase leadership.</p>
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <Input label="Founder Name" value={formData.founder_name} onChange={(v: string) => handleChange('founder_name', v)} placeholder="e.g., Muhammad Hassan" />
                    <Input label="Founder Designation" value={formData.founder_designation} onChange={(v: string) => handleChange('founder_designation', v)} placeholder="e.g., CEO & Founder" />
                    <div className="md:col-span-2">
                      <TextArea label="Founder Bio" value={formData.founder_bio} onChange={(v: string) => handleChange('founder_bio', v)} rows={3} placeholder="Brief biography of the founder..." />
                    </div>
                    <div className="md:col-span-2">
                      <TextArea label="Founder Message" value={formData.founder_message} onChange={(v: string) => handleChange('founder_message', v)} rows={3} placeholder="A message from the founder..." />
                    </div>
                    <div className="md:col-span-2">
                      <FileUpload label="Founder Photo" currentUrl={formData.founder_image_url} onUpload={(url: string) => handleChange('founder_image_url', url)} />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ─── Contact Tab ─── */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <SectionCard icon={Phone} title="Contact Information">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <Input label="Phone" value={formData.phone} onChange={(v: string) => handleChange('phone', v)} placeholder="+92 42 1234567" />
                    <Input label="Email" type="email" value={formData.email} onChange={(v: string) => handleChange('email', v)} placeholder="info@edenbuildcore.com" />
                    <Input label="WhatsApp" value={formData.whatsapp} onChange={(v: string) => handleChange('whatsapp', v)} placeholder="+92 300 1234567" />
                    <div className="md:col-span-2">
                      <TextArea label="Address" value={formData.address} onChange={(v: string) => handleChange('address', v)} rows={2} placeholder="Full address..." />
                    </div>
                    <div className="md:col-span-2">
                      <Input label="Google Maps Embed URL" value={formData.google_maps_embed} onChange={(v: string) => handleChange('google_maps_embed', v)} placeholder="https://www.google.com/maps/embed?pb=..." />
                      <p className="text-[#606060] text-xs mt-1.5">Get this from Google Maps: Share → Embed a map → Copy the iframe src URL</p>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard icon={Clock} title="Business Hours">
                  <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                    <Input label="Weekdays (Mon-Fri)" value={formData.business_hours?.weekday || ''} onChange={(v: string) => handleHoursChange('weekday', v)} placeholder="9:00 AM - 6:00 PM" />
                    <Input label="Saturday" value={formData.business_hours?.saturday || ''} onChange={(v: string) => handleHoursChange('saturday', v)} placeholder="9:00 AM - 2:00 PM" />
                    <Input label="Sunday" value={formData.business_hours?.sunday || ''} onChange={(v: string) => handleHoursChange('sunday', v)} placeholder="Closed" />
                  </div>
                </SectionCard>

                <SectionCard icon={Globe} title="Social Media Links">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'].map((social) => (
                      <Input key={social} label={social.charAt(0).toUpperCase() + social.slice(1)} value={formData.social_links?.[social] || ''} onChange={(v: string) => handleSocialChange(social, v)} placeholder={`https://${social}.com/yourpage`} />
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ─── Appearance Tab ─── */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                {/* Color System */}
                <SectionCard icon={Palette} title="Color System">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <ColorPicker label="Primary Color" value={formData.primary_color || '#c49028'} onChange={(v: string) => handleChange('primary_color', v)} />
                    <ColorPicker label="Secondary Color" value={formData.secondary_color || '#a67820'} onChange={(v: string) => handleChange('secondary_color', v)} presets={false} />
                    <ColorPicker label="Accent Color" value={formData.accent_color || '#e8b84a'} onChange={(v: string) => handleChange('accent_color', v)} presets={false} />
                    <ColorPicker label="Background Color" value={formData.bg_color || '#030810'} onChange={(v: string) => handleChange('bg_color', v)} />
                    <ColorPicker label="Text Color" value={formData.text_color || '#ffffff'} onChange={(v: string) => handleChange('text_color', v)} presets={false} />
                    <ColorPicker label="Muted Text Color" value={formData.muted_text_color || '#909090'} onChange={(v: string) => handleChange('muted_text_color', v)} presets={false} />
                    <ColorPicker label="Border Color" value={formData.border_color || '#c49028'} onChange={(v: string) => handleChange('border_color', v)} presets={false} />
                    <ColorPicker label="Button Hover" value={formData.button_hover_color || '#e8b84a'} onChange={(v: string) => handleChange('button_hover_color', v)} presets={false} />
                    <ColorPicker label="Link Hover" value={formData.link_hover_color || '#e8b84a'} onChange={(v: string) => handleChange('link_hover_color', v)} presets={false} />
                  </div>

                  {/* Background Presets */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Background Presets</label>
                    <div className="flex flex-wrap gap-2">
                      {BG_PRESETS.map((bg) => (
                        <button
                          key={bg.value}
                          type="button"
                          onClick={() => handleChange('bg_color', bg.value)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs ${
                            formData.bg_color === bg.value
                              ? 'border-[#c49028] bg-[#c49028]/10 text-white'
                              : 'border-[#c49028]/10 hover:border-[#c49028]/30 text-gray-400'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: bg.value }} />
                          {bg.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                {/* Component Colors */}
                <SectionCard icon={Box} title="Component Colors">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <ColorPicker label="Card Background" value={formData.card_bg_color || '#0c1a2e'} onChange={(v: string) => handleChange('card_bg_color', v)} presets={false} />
                    <ColorPicker label="Card Border" value={formData.card_border_color || '#c49028'} onChange={(v: string) => handleChange('card_border_color', v)} presets={false} />
                    <ColorPicker label="Navbar Background" value={formData.nav_bg_color || '#030810'} onChange={(v: string) => handleChange('nav_bg_color', v)} presets={false} />
                    <ColorPicker label="Footer Background" value={formData.footer_bg_color || '#030810'} onChange={(v: string) => handleChange('footer_bg_color', v)} presets={false} />
                    <ColorPicker label="Hero Overlay" value={formData.hero_overlay_color || '#071027'} onChange={(v: string) => handleChange('hero_overlay_color', v)} presets={false} />
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Hero Overlay Opacity</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={formData.hero_overlay_opacity || 0.85}
                          onChange={(e) => handleChange('hero_overlay_opacity', parseFloat(e.target.value))}
                          className="flex-1 accent-[#c49028]"
                        />
                        <span className="text-sm text-gray-400 w-12 text-right">{Math.round((formData.hero_overlay_opacity || 0.85) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Status Colors */}
                <SectionCard icon={Shield} title="Status Colors">
                  <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                    <ColorPicker label="Success" value={formData.success_color || '#10b981'} onChange={(v: string) => handleChange('success_color', v)} presets={false} />
                    <ColorPicker label="Warning" value={formData.warning_color || '#f59e0b'} onChange={(v: string) => handleChange('warning_color', v)} presets={false} />
                    <ColorPicker label="Error" value={formData.error_color || '#ef4444'} onChange={(v: string) => handleChange('error_color', v)} presets={false} />
                  </div>
                </SectionCard>

                {/* Typography */}
                <SectionCard icon={Type} title="Typography">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Heading Font</label>
                      <select
                        value={formData.heading_font || 'Playfair Display, serif'}
                        onChange={(e) => handleChange('heading_font', e.target.value)}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      >
                        {ALL_FONTS.map((font) => (
                          <option key={font.value} value={font.value}>{font.name} — {font.category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Body Font</label>
                      <select
                        value={formData.body_font || 'Inter, sans-serif'}
                        onChange={(e) => handleChange('body_font', e.target.value)}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      >
                        {ALL_FONTS.map((font) => (
                          <option key={font.value} value={font.value}>{font.name} — {font.category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </SectionCard>

                {/* Spacing & Radius */}
                <SectionCard icon={Ruler} title="Spacing & Radius">
                  <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Border Radius</label>
                      <div className="grid grid-cols-4 gap-2">
                        {RADIUS_OPTIONS.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => handleChange('border_radius', r.value)}
                            className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${
                              formData.border_radius === r.value
                                ? 'border-[#c49028] bg-[#c49028]/10 text-[#c49028]'
                                : 'border-[#c49028]/10 text-gray-500 hover:border-[#c49028]/30'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Shadow Intensity</label>
                      <div className="space-y-1.5">
                        {SHADOW_OPTIONS.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => handleChange('shadow_intensity', s.value)}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all border text-left ${
                              formData.shadow_intensity === s.value
                                ? 'border-[#c49028] bg-[#c49028]/10 text-[#c49028]'
                                : 'border-[#c49028]/10 text-gray-500 hover:border-[#c49028]/30'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Spacing Scale</label>
                      <div className="space-y-1.5">
                        {SPACING_OPTIONS.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => handleChange('spacing_scale', s.value)}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all border text-left ${
                              formData.spacing_scale === s.value
                                ? 'border-[#c49028] bg-[#c49028]/10 text-[#c49028]'
                                : 'border-[#c49028]/10 text-gray-500 hover:border-[#c49028]/30'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ─── SEO Tab ─── */}
            {activeTab === 'seo' && (
              <SectionCard icon={Hash} title="SEO Settings">
                <div className="space-y-6">
                  <Input label="Meta Title" value={formData.meta_title} onChange={(v: string) => handleChange('meta_title', v)} placeholder="Eden Buildcore - Construction & Engineering Excellence" />
                  <p className="text-[#606060] text-xs -mt-4">Recommended: 50-60 characters</p>
                  <TextArea label="Meta Description" value={formData.meta_description} onChange={(v: string) => handleChange('meta_description', v)} rows={3} placeholder="Leading construction and engineering company..." />
                  <p className="text-[#606060] text-xs -mt-4">Recommended: 150-160 characters</p>
                  <Input label="Meta Keywords" value={formData.meta_keywords} onChange={(v: string) => handleChange('meta_keywords', v)} placeholder="construction, engineering, civil construction, infrastructure, Pakistan" />
                  <p className="text-[#606060] text-xs -mt-4">Separate keywords with commas</p>
                  <Input label="Google Analytics ID" value={formData.google_analytics_id} onChange={(v: string) => handleChange('google_analytics_id', v)} placeholder="G-XXXXXXXXXX" />
                </div>
              </SectionCard>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4 border-t border-[#c49028]/10 sticky bottom-0 bg-[#030810]/95 backdrop-blur-sm p-4 rounded-xl -mx-4">
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm order-2 sm:order-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              {saved && (
                <div className="flex items-center gap-2 text-green-400 text-sm order-2 sm:order-1">
                  <CheckCircle className="w-4 h-4" />
                  Settings saved successfully
                </div>
              )}
              <button
                type="submit"
                disabled={saving || !changed}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-xl disabled:opacity-40 transition-all order-1 sm:order-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : changed ? 'Save Changes' : 'No Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <LivePreview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */
function SectionCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#c49028]" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm placeholder-gray-600"
        placeholder={placeholder}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none resize-none text-sm placeholder-gray-600"
        placeholder={placeholder}
      />
    </div>
  );
}
