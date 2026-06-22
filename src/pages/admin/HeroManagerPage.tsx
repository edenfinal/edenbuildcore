import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, AlertCircle, CheckCircle, Image, Type, Palette, Eye, EyeOff,
  ChevronDown, ChevronRight, Layout, Monitor, ArrowRight, Upload, X,
  RefreshCw, SlidersHorizontal, AlignLeft, AlignCenter, AlignRight,
  Maximize2, Minimize2, Check, Trash2
} from 'lucide-react';
import { useAllPageHeroes } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import type { PageHero } from '../../lib/supabase';

/* ─── Constants ─── */
const PAGE_LABELS: Record<string, string> = {
  home: 'Home Page',
  about: 'About Page',
  services: 'Services Page',
  projects: 'Projects Page',
  gallery: 'Gallery Page',
  contact: 'Contact Page',
  careers: 'Careers Page',
  blog: 'Blog Page',
  clients: 'Clients Page',
  certifications: 'Certifications Page',
};

const HEIGHT_OPTIONS = [
  { label: 'Small', value: 'small', desc: '30-35vh' },
  { label: 'Medium', value: 'medium', desc: '40-50vh' },
  { label: 'Large', value: 'large', desc: '50-65vh' },
  { label: 'Full Screen', value: 'full', desc: '80-90vh' },
];

const ALIGN_OPTIONS = [
  { label: 'Left', value: 'left', icon: AlignLeft },
  { label: 'Center', value: 'center', icon: AlignCenter },
  { label: 'Right', value: 'right', icon: AlignRight },
];

/* ─── FileUpload Component ─── */
function FileUpload({
  label,
  currentUrl,
  onUpload,
  bucket = 'site-assets',
}: {
  label: string;
  currentUrl: string;
  onUpload: (url: string) => void;
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
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `heroes/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

      if (error) {
        setUploadError(`Upload failed: ${error.message}`);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      setPreview(urlData.publicUrl);
      onUpload(urlData.publicUrl);
    } catch (err: any) {
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
        className="relative border-2 border-dashed border-[#c49028]/20 rounded-xl overflow-hidden hover:border-[#c49028]/40 transition-colors bg-[#030810]/40"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover" onError={() => setPreview('')} />
            <button
              type="button"
              onClick={() => { setPreview(''); onUpload(''); setUploadError(''); }}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#030810] to-transparent p-3">
              <p className="text-xs text-gray-400 truncate">{preview}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Upload className="w-8 h-8 text-[#c49028]/40 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
            <p className="text-[10px] text-gray-600 mt-1">Max 5MB, Images only</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {uploading && (
          <div className="absolute inset-0 bg-[#030810]/80 flex items-center justify-center z-20">
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

/* ─── HeroPreview Component ─── */
function HeroPreview({ hero }: { hero: Partial<PageHero> }) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[hero.text_alignment || 'center'] || 'text-center items-center';

  const heightClass = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-80',
    full: 'h-96',
  }[hero.height || 'large'] || 'h-80';

  const opacity = hero.overlay_opacity ?? 0.75;
  const overlayColor = hero.overlay_color || '#030810';

  return (
    <div className={`relative ${heightClass} rounded-xl overflow-hidden border border-[#c49028]/10`}>
      {hero.background_image_url ? (
        <img src={hero.background_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a2e] to-[#030810]" />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${overlayColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${overlayColor}${Math.round((opacity * 0.5) * 255).toString(16).padStart(2, '0')} 100%)`,
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-center px-6">
        <div className={`flex flex-col ${alignClass}`}>
          {hero.subtitle && (
            <span className="text-[10px] text-[#c49028] uppercase tracking-widest mb-1">
              {hero.subtitle}
            </span>
          )}
          {hero.title && (
            <h3 className="text-lg font-bold text-white mb-1">{hero.title}</h3>
          )}
          {hero.description && (
            <p className="text-xs text-gray-300 max-w-md line-clamp-2">{hero.description}</p>
          )}
          {hero.show_button && hero.button_text && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[#c49028] mt-2">
              {hero.button_text} <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function HeroManagerPage() {
  const { heroes, loading, error, refetch, updateHero } = useAllPageHeroes();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PageHero>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const selectedHero = heroes.find((h) => h.page_id === selectedPage);

  useEffect(() => {
    if (selectedHero) {
      setEditForm({ ...selectedHero });
    }
  }, [selectedHero]);

  const handleChange = (key: keyof PageHero, value: any) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selectedHero) return;
    setSaving(true);
    setSaveError('');
    setSaved(false);

    const updates = {
      title: editForm.title,
      subtitle: editForm.subtitle,
      description: editForm.description,
      background_image_url: editForm.background_image_url,
      overlay_opacity: editForm.overlay_opacity,
      text_alignment: editForm.text_alignment,
      button_text: editForm.button_text,
      button_link: editForm.button_link,
      show_button: editForm.show_button,
      height: editForm.height,
      text_color: editForm.text_color,
      overlay_color: editForm.overlay_color,
      is_active: editForm.is_active,
    };

    const success = await updateHero(selectedHero.id, updates);
    setSaving(false);

    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setSaveError('Failed to save changes. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-red-400 font-medium">Failed to load heroes</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-[#c49028]/10 text-[#c49028] rounded-lg text-sm hover:bg-[#c49028]/20 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c49028] to-[#a67820] flex items-center justify-center">
            <Layout className="w-5 h-5 text-[#030810]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Hero Manager</h1>
            <p className="text-gray-400 text-sm mt-0.5">Customize hero sections for every page</p>
          </div>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-[#0c1a2e] border border-[#c49028]/20 rounded-xl text-[#c49028] text-sm hover:bg-[#c49028]/5 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Page Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {heroes.map((hero) => (
          <button
            key={hero.page_id}
            onClick={() => setSelectedPage(hero.page_id)}
            className={`relative p-4 rounded-xl border transition-all text-left ${
              selectedPage === hero.page_id
                ? 'border-[#c49028]/40 bg-[#c49028]/10 ring-1 ring-[#c49028]/20'
                : 'border-[#c49028]/10 bg-[#0c1a2e]/60 hover:border-[#c49028]/25 hover:bg-[#0c1a2e]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{PAGE_LABELS[hero.page_id] || hero.page_id}</span>
              {hero.is_active ? (
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-gray-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{hero.title || 'No title'}</p>
            {selectedPage === hero.page_id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c49028] rounded-b-xl" />
            )}
          </button>
        ))}
      </div>

      {/* Editor */}
      <AnimatePresence mode="wait">
        {selectedHero && (
          <motion.div
            key={selectedHero.page_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
                    <Type className="w-4 h-4 text-[#c49028]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Content</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      placeholder="Main heading"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={editForm.subtitle || ''}
                      onChange={(e) => handleChange('subtitle', e.target.value)}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      placeholder="Subheading"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm resize-none"
                      placeholder="Hero description text"
                    />
                  </div>
                </div>
              </div>

              {/* Background Image */}
              <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
                    <Image className="w-4 h-4 text-[#c49028]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Background Image</h2>
                </div>
                <FileUpload
                  label="Hero Background"
                  currentUrl={editForm.background_image_url || ''}
                  onUpload={(url) => handleChange('background_image_url', url)}
                />
              </div>

              {/* Appearance */}
              <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
                    <Palette className="w-4 h-4 text-[#c49028]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Appearance</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Height</label>
                    <div className="grid grid-cols-2 gap-2">
                      {HEIGHT_OPTIONS.map((h) => (
                        <button
                          key={h.value}
                          onClick={() => handleChange('height', h.value)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                            editForm.height === h.value
                              ? 'border-[#c49028] bg-[#c49028]/10 text-[#c49028]'
                              : 'border-[#c49028]/10 text-gray-500 hover:border-[#c49028]/30'
                          }`}
                        >
                          <span className="block">{h.label}</span>
                          <span className="text-[10px] opacity-70">{h.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Text Alignment</label>
                    <div className="flex gap-2">
                      {ALIGN_OPTIONS.map((a) => (
                        <button
                          key={a.value}
                          onClick={() => handleChange('text_alignment', a.value)}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all border flex items-center justify-center gap-1 ${
                            editForm.text_alignment === a.value
                              ? 'border-[#c49028] bg-[#c49028]/10 text-[#c49028]'
                              : 'border-[#c49028]/10 text-gray-500 hover:border-[#c49028]/30'
                          }`}
                        >
                          <a.icon className="w-3.5 h-3.5" />
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overlay Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Overlay Opacity</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={editForm.overlay_opacity || 0.75}
                        onChange={(e) => handleChange('overlay_opacity', parseFloat(e.target.value))}
                        className="flex-1 accent-[#c49028]"
                      />
                      <span className="text-sm text-gray-400 w-12 text-right">{Math.round((editForm.overlay_opacity || 0.75) * 100)}%</span>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editForm.text_color || '#ffffff'}
                          onChange={(e) => handleChange('text_color', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border border-[#c49028]/30 bg-transparent"
                        />
                        <input
                          type="text"
                          value={editForm.text_color || '#ffffff'}
                          onChange={(e) => handleChange('text_color', e.target.value)}
                          className="flex-1 px-3 py-2 bg-[#030810]/60 border border-[#c49028]/20 rounded-lg text-white text-sm font-mono uppercase"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Overlay Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editForm.overlay_color || '#030810'}
                          onChange={(e) => handleChange('overlay_color', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border border-[#c49028]/30 bg-transparent"
                        />
                        <input
                          type="text"
                          value={editForm.overlay_color || '#030810'}
                          onChange={(e) => handleChange('overlay_color', e.target.value)}
                          className="flex-1 px-3 py-2 bg-[#030810]/60 border border-[#c49028]/20 rounded-lg text-white text-sm font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[#c49028]" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Call to Action</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.show_button ?? true}
                      onChange={(e) => handleChange('show_button', e.target.checked)}
                      className="w-4 h-4 rounded border-[#c49028]/30 accent-[#c49028]"
                    />
                    <span className="text-sm text-gray-400">Show Button</span>
                  </label>
                </div>

                {editForm.show_button && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Button Text</label>
                      <input
                        type="text"
                        value={editForm.button_text || ''}
                        onChange={(e) => handleChange('button_text', e.target.value)}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                        placeholder="e.g., Explore Projects"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Button Link</label>
                      <input
                        type="text"
                        value={editForm.button_link || ''}
                        onChange={(e) => handleChange('button_link', e.target.value)}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                        placeholder="e.g., /projects or #contact"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-[#c49028]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Visibility</h2>
                      <p className="text-xs text-gray-500">Show or hide this hero section</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.is_active ?? true}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c49028]" />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#c49028]/10">
                {saveError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {saveError}
                  </div>
                )}
                {saved && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Saved successfully
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-xl disabled:opacity-40 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Monitor className="w-4 h-4 text-[#c49028]" />
                    <span className="text-sm font-medium text-gray-300">Live Preview</span>
                  </div>
                  <HeroPreview hero={editForm} />
                </div>

                {/* Quick Tips */}
                <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-3">Tips</h3>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-[#c49028] mt-0.5 flex-shrink-0" />
                      Use high-quality images (1920px wide minimum)
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-[#c49028] mt-0.5 flex-shrink-0" />
                      Keep title under 60 characters
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-[#c49028] mt-0.5 flex-shrink-0" />
                      Description should be 1-2 sentences
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-[#c49028] mt-0.5 flex-shrink-0" />
                      Button links can be /page or #section-id
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedPage && heroes.length > 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Layout className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-gray-400 font-medium">Select a page to edit its hero</p>
          <p className="text-gray-600 text-sm mt-1">Click on any page card above to customize its hero section</p>
        </div>
      )}
    </div>
  );
}
