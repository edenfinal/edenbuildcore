import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertCircle, CheckCircle, Globe, Mail, Phone, MapPin, Clock, Palette, Type, Image } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';

const predefinedColors = [
  { name: 'Gold', value: '#c49028' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
];

const fontOptions = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
];

export default function SettingsPage() {
  const { settings, loading, updateSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    site_name: '',
    site_tagline: '',
    site_description: '',
    logo_url: '',
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
    copyright_text: '',
    primary_color: '#c49028',
    secondary_color: '#a67820',
    accent_color: '#e8b84a',
    heading_font: 'Playfair Display, serif',
    body_font: 'Inter, sans-serif',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        site_tagline: settings.site_tagline || '',
        site_description: settings.site_description || '',
        logo_url: settings.logo_url || '',
        favicon_url: (settings as any).favicon_url || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        whatsapp: settings.whatsapp || '',
        google_maps_embed: settings.google_maps_embed || '',
        business_hours: (settings.business_hours as any) || { weekday: '9:00 AM - 6:00 PM', saturday: '9:00 AM - 2:00 PM', sunday: 'Closed' },
        social_links: (settings.social_links as any) || { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' },
        meta_title: settings.meta_title || '',
        meta_description: settings.meta_description || '',
        meta_keywords: settings.meta_keywords || '',
        google_analytics_id: settings.google_analytics_id || '',
        copyright_text: (settings as any).copyright_text || '',
        primary_color: (settings as any).primary_color || '#c49028',
        secondary_color: (settings as any).secondary_color || '#a67820',
        accent_color: (settings as any).accent_color || '#e8b84a',
        heading_font: (settings as any).heading_font || 'Playfair Display, serif',
        body_font: (settings as any).body_font || 'Inter, sans-serif',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const success = await updateSettings(formData);
    setSaving(false);

    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError('Failed to save settings');
    }
  };

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSocialChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: { ...(prev.social_links as any), [key]: value }
    }));
  };

  const handleHoursChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      business_hours: { ...(prev.business_hours as any), [key]: value }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'seo', label: 'SEO', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Site Settings</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Configure your website settings and information</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-[#c49028]" />
              <h2 className="text-lg font-semibold text-white">General Settings</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={e => handleChange('site_name', e.target.value)}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  placeholder="Eden Buildcore (Pvt.) Ltd."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Site Tagline</label>
                <input
                  type="text"
                  value={formData.site_tagline}
                  onChange={e => handleChange('site_tagline', e.target.value)}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  placeholder="Building Tomorrow's Landmarks Today"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Site Description</label>
                <textarea
                  value={formData.site_description}
                  onChange={e => handleChange('site_description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none resize-none text-sm"
                  placeholder="Brief description about your company..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={e => handleChange('logo_url', e.target.value)}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Favicon URL</label>
                <input
                  type="url"
                  value={formData.favicon_url}
                  onChange={e => handleChange('favicon_url', e.target.value)}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Copyright Text</label>
                <input
                  type="text"
                  value={formData.copyright_text}
                  onChange={e => handleChange('copyright_text', e.target.value)}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  placeholder="© 2024 Eden Buildcore (Pvt.) Ltd. All Rights Reserved."
                />
              </div>
              {/* Logo Preview */}
              {(formData.logo_url || formData.site_name) && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Preview</label>
                  <div className="flex items-center gap-4 p-4 bg-[#030810]/40 rounded-xl border border-[#c49028]/10">
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Logo preview" className="h-12 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xl font-heading font-bold text-white">{formData.site_name.split(' ')[0] || 'EDEN'}</span>
                        <span className="text-xs text-[#c49028] tracking-widest uppercase">{formData.site_name.split(' ')[1] || 'BUILDCORE'}</span>
                      </div>
                    )}
                    <span className="text-gray-400 text-sm">{formData.site_name || 'Site Name'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-5 h-5 text-[#c49028]" />
                <h2 className="text-lg font-semibold text-white">Contact Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    placeholder="+92 42 1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    placeholder="info@edenbuildcore.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={e => handleChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    placeholder="+92 300 1234567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={e => handleChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none resize-none text-sm"
                    placeholder="Full address..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Google Maps Embed URL</label>
                  <input
                    type="url"
                    value={formData.google_maps_embed}
                    onChange={e => handleChange('google_maps_embed', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <p className="text-[#606060] text-xs mt-1.5">Get this from Google Maps: Share → Embed a map → Copy the iframe src URL</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-[#c49028]" />
                <h2 className="text-lg font-semibold text-white">Business Hours</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Weekdays (Mon-Fri)</label>
                  <input
                    type="text"
                    value={(formData.business_hours as any)?.weekday || ''}
                    onChange={e => handleHoursChange('weekday', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Saturday</label>
                  <input
                    type="text"
                    value={(formData.business_hours as any)?.saturday || ''}
                    onChange={e => handleHoursChange('saturday', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    placeholder="9:00 AM - 2:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sunday</label>
                  <input
                    type="text"
                    value={(formData.business_hours as any)?.sunday || ''}
                    onChange={e => handleHoursChange('sunday', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    placeholder="Closed"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Social Media Links</h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'].map((social) => (
                  <div key={social}>
                    <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">{social}</label>
                    <input
                      type="url"
                      value={(formData.social_links as any)?.[social] || ''}
                      onChange={e => handleSocialChange(social, e.target.value)}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      placeholder={`https://${social}.com/yourpage`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Color Settings */}
            <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-[#c49028]" />
                <h2 className="text-lg font-semibold text-white">Color Theme</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Primary Color</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={e => handleChange('primary_color', e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[#c49028]/20"
                      />
                      <input
                        type="text"
                        value={formData.primary_color}
                        onChange={e => handleChange('primary_color', e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#030810]/60 border border-[#c49028]/20 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleChange('primary_color', color.value)}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            formData.primary_color === color.value ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Secondary Color</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.secondary_color}
                        onChange={e => handleChange('secondary_color', e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[#c49028]/20"
                      />
                      <input
                        type="text"
                        value={formData.secondary_color}
                        onChange={e => handleChange('secondary_color', e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#030810]/60 border border-[#c49028]/20 rounded-lg text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Accent Color</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.accent_color}
                        onChange={e => handleChange('accent_color', e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[#c49028]/20"
                      />
                      <input
                        type="text"
                        value={formData.accent_color}
                        onChange={e => handleChange('accent_color', e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#030810]/60 border border-[#c49028]/20 rounded-lg text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="mt-6 p-4 bg-[#030810]/40 rounded-xl border border-[#c49028]/10">
                <p className="text-sm text-gray-400 mb-3">Preview</p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="px-6 py-2.5 text-white font-medium rounded-lg text-sm"
                    style={{ backgroundColor: formData.primary_color }}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-lg text-sm border-2"
                    style={{ borderColor: formData.primary_color, color: formData.primary_color }}
                  >
                    Outlined Button
                  </button>
                  <span className="text-sm" style={{ color: formData.accent_color }}>
                    Accent Text
                  </span>
                </div>
              </div>
            </div>

            {/* Font Settings */}
            <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <Type className="w-5 h-5 text-[#c49028]" />
                <h2 className="text-lg font-semibold text-white">Typography</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Heading Font</label>
                  <select
                    value={formData.heading_font}
                    onChange={e => handleChange('heading_font', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Body Font</label>
                  <select
                    value={formData.body_font}
                    onChange={e => handleChange('body_font', e.target.value)}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Font Preview */}
              <div className="mt-6 p-4 bg-[#030810]/40 rounded-xl border border-[#c49028]/10">
                <p className="text-sm text-gray-400 mb-3">Preview</p>
                <h3 style={{ fontFamily: formData.heading_font }} className="text-2xl text-white mb-2">
                  Heading Style
                </h3>
                <p style={{ fontFamily: formData.body_font }} className="text-gray-300 text-sm">
                  This is how your body text will appear across the website. The right font combination creates a professional and cohesive look.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-[#c49028]" />
              <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={e => handleChange('meta_title', e.target.value)}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  placeholder="Eden Buildcore - Construction & Engineering Excellence"
                />
                <p className="text-[#606060] text-xs mt-1.5">Recommended: 50-60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={e => handleChange('meta_description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none resize-none text-sm"
                  placeholder="Leading construction and engineering company delivering excellence in civil construction, infrastructure development..."
                />
                <p className="text-[#606060] text-xs mt-1.5">Recommended: 150-160 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Keywords</label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={e => handleChange('meta_keywords', e.target.value)}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  placeholder="construction, engineering, civil construction, infrastructure, Pakistan"
                />
                <p className="text-[#606060] text-xs mt-1.5">Separate keywords with commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={formData.google_analytics_id}
                  onChange={e => handleChange('google_analytics_id', e.target.value)}
                  className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4 border-t border-[#c49028]/10">
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
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-xl disabled:opacity-50 transition-all order-1 sm:order-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
