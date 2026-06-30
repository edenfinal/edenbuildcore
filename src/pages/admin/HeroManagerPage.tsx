import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertCircle, CheckCircle, Image, Type, Palette, Eye, EyeOff, LayoutGrid as Layout, Monitor, ArrowRight, Upload, X, RefreshCw, SlidersHorizontal, AlignLeft, AlignCenter, AlignRight, Check, Clock, Gauge, Plus, Minus, Trash2, Pencil, GripVertical } from 'lucide-react';
import { useAllPageHeroes, useHeroSlides } from '../../hooks/useData';
import { supabase, uploadImage } from '../../lib/supabase';
import type { PageHero, HeroSlide } from '../../lib/supabase';

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
// Completely rebuilt to avoid input-overlay issues
function FileUpload({
  label,
  currentUrl,
  onUpload,
  recommendedWidth,
  recommendedHeight,
}: {
  label: string;
  currentUrl: string;
  onUpload: (url: string) => void;
  recommendedWidth?: number;
  recommendedHeight?: number;
  bucket?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPreview(currentUrl); }, [currentUrl]);

  const doUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large (max 10MB)');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const { url, error: uploadErr } = await uploadImage(file, 'heroes');
      if (uploadErr || !url) {
        setUploadError(uploadErr || 'Upload failed — please try again');
      } else {
        setPreview(url);
        onUpload(url);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        {recommendedWidth && recommendedHeight && (
          <span className="text-[10px] text-gray-500">Recommended: {recommendedWidth}×{recommendedHeight}px</span>
        )}
      </div>

      {/* Hidden file input — triggered explicitly */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {preview ? (
        /* ── Preview Mode ── */
        <div className="relative rounded-xl overflow-hidden border border-[#c49028]/20">
          <img
            src={preview}
            alt="Background preview"
            className="w-full h-48 object-cover"
            onError={() => { setPreview(''); onUpload(''); }}
          />
          {/* Overlay controls */}
          <div className="absolute inset-0 bg-[#030810]/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-[#c49028] text-[#030810] font-semibold text-sm rounded-lg hover:bg-[#e8b84a] transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Change
            </button>
            <button
              type="button"
              onClick={() => { setPreview(''); onUpload(''); setUploadError(''); }}
              className="px-4 py-2 bg-red-500/80 text-white font-semibold text-sm rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-[#030810]/80 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#c49028] text-xs">Uploading...</p>
            </div>
          )}
        </div>
      ) : (
        /* ── Drop Zone (no preview) ── */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className="relative border-2 border-dashed border-[#c49028]/20 rounded-xl hover:border-[#c49028]/50 transition-colors bg-[#030810]/40 cursor-pointer"
        >
          <div className="text-center py-10 px-4">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#c49028] text-sm">Uploading image...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#c49028]/50 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">Click or drag & drop to upload</p>
                <p className="text-[10px] text-gray-600 mt-1">JPG, PNG, WebP — max 10MB</p>
                {recommendedWidth && recommendedHeight && (
                  <p className="text-[10px] text-gray-600 mt-0.5">Recommended {recommendedWidth}×{recommendedHeight}px</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">{uploadError}</p>
        </div>
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

/* ─── Hero Slides Manager (for carousel) ─── */
function HeroSlidesManager() {
  const { data: slides, refetch } = useHeroSlides();
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<HeroSlide>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSlideSaveError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const allSlides = [...slides].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const openNew = () => {
    setEditingSlide(null);
    setSlideSaveError('');
    setForm({ is_active: true, order_index: allSlides.length, overlay_opacity: 0.5, text_alignment: 'center' });
    setShowForm(true);
  };
  const openEdit = (s: HeroSlide) => {
    setEditingSlide(s);
    setSlideSaveError('');
    setForm({ ...s, overlay_opacity: s.overlay_opacity > 1 ? s.overlay_opacity / 100 : s.overlay_opacity });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingSlide(null); setForm({}); setSlideSaveError(''); };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const { url } = await uploadImage(file, 'heroes');
    if (url) setForm(f => ({ ...f, background_image_url: url }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) {
      setSlideSaveError('Title is required.');
      return;
    }

    setSaving(true);
    setSlideSaveError('');

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle || null,
      description: form.description || null,
      background_image_url: form.background_image_url || null,
      button_text: form.button_text || null,
      button_link: form.button_link || null,
      button2_text: form.button2_text || null,
      button2_link: form.button2_link || null,
      line_two: form.line_two || null,
      overlay_opacity: Math.min(0.9, Math.max(0, Number(form.overlay_opacity ?? 0.5))),
      text_alignment: form.text_alignment || 'center',
      order_index: Number(form.order_index ?? allSlides.length),
      is_active: form.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = editingSlide
        ? await supabase.from('hero_slides').update(payload).eq('id', editingSlide.id)
        : await supabase.from('hero_slides').insert(payload);

      if (error) throw error;
      await refetch();
      closeForm();
    } catch (e: any) {
      console.error('Hero slide save error:', e);
      setSlideSaveError(e?.message || 'Failed to save slide. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    await supabase.from('hero_slides').delete().eq('id', id);
    refetch();
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Home Page Slides</h3>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-[#c49028]/10 text-[#c49028] border border-[#c49028]/20 rounded-lg text-sm hover:bg-[#c49028]/20 transition-all">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {allSlides.length === 0 && !showForm && (
        <p className="text-gray-500 text-sm py-4 text-center">No slides yet. Click "Add Slide" to create the first one.</p>
      )}

      <div className="space-y-3">
        {allSlides.map((slide, i) => (
          <div key={slide.id} className="flex items-center gap-3 bg-[#030810]/50 border border-[#c49028]/10 rounded-xl p-3">
            <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
            {slide.background_image_url && (
              <img src={slide.background_image_url} alt="" className="w-16 h-10 object-cover rounded-lg flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{slide.title || 'Untitled'}</p>
              <p className="text-gray-500 text-xs truncate">{slide.subtitle || slide.description || '—'}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${slide.is_active ? 'bg-green-500/15 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                {slide.is_active ? 'Active' : 'Off'}
              </span>
              <button onClick={() => openEdit(slide)} className="p-1.5 text-gray-500 hover:text-[#c49028] transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(slide.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030810]/80 backdrop-blur-sm"
          >
            <div className="bg-[#0c1a2e] border border-[#c49028]/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#0c1a2e] border-b border-[#c49028]/10 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-white">{editingSlide ? 'Edit Slide' : 'New Slide'}</h3>
                <button onClick={closeForm} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {/* Background Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Background Image</label>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#030810] border-2 border-dashed border-[#c49028]/20 flex items-center justify-center cursor-pointer hover:border-[#c49028]/40 transition-colors"
                    onClick={() => fileRef.current?.click()}>
                    {form.background_image_url ? (
                      <img src={form.background_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <Upload className="w-8 h-8 text-[#c49028]/40 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Click to upload background image</p>
                      </div>
                    )}
                    {uploading && <div className="absolute inset-0 bg-[#030810]/70 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" /></div>}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Title (Line 1 — gold)</label>
                    <input type="text" value={form.title || ''} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm" placeholder="e.g., Building Tomorrow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Title Line 2</label>
                    <input type="text" value={form.line_two || ''} onChange={e => setForm(f => ({...f, line_two: e.target.value}))}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm" placeholder="e.g., With Excellence" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
                  <input type="text" value={form.subtitle || ''} onChange={e => setForm(f => ({...f, subtitle: e.target.value}))}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm" placeholder="Short tagline below the title" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea value={form.description || ''} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3}
                    className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm resize-none" placeholder="Longer description text..." />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Button 1 Text</label>
                    <input type="text" value={form.button_text || ''} onChange={e => setForm(f => ({...f, button_text: e.target.value}))}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm" placeholder="e.g., View Projects" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Button 1 Link</label>
                    <input type="text" value={form.button_link || ''} onChange={e => setForm(f => ({...f, button_link: e.target.value}))}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm" placeholder="/projects" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Button 2 Text <span className="text-gray-600">(optional)</span></label>
                    <input type="text" value={form.button2_text || ''} onChange={e => setForm(f => ({...f, button2_text: e.target.value}))}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm" placeholder="e.g., Contact Us" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Button 2 Link</label>
                    <input type="text" value={form.button2_link || ''} onChange={e => setForm(f => ({...f, button2_link: e.target.value}))}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm" placeholder="/contact" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Overlay Opacity: {Math.round((form.overlay_opacity ?? 0.5) * 100)}%</label>
                    <input type="range" min="0" max="0.9" step="0.05" value={form.overlay_opacity ?? 0.5}
                      onChange={e => setForm(f => ({...f, overlay_opacity: parseFloat(e.target.value)}))} className="w-full accent-[#c49028]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Display Order</label>
                    <input type="number" value={form.order_index ?? 0} min="0"
                      onChange={e => setForm(f => ({...f, order_index: parseInt(e.target.value)}))}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm" />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm(f => ({...f, is_active: e.target.checked}))}
                    className="w-4 h-4 accent-[#c49028]" />
                  <span className="text-sm text-gray-300">Active (visible on site)</span>
                </label>
              </div>

              <div className="sticky bottom-0 bg-[#0c1a2e] border-t border-[#c49028]/10 px-6 py-4 flex flex-wrap gap-3 justify-end">
                {saveError && (
                  <div className="mr-auto flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}
                <button onClick={closeForm} className="px-5 py-2 border border-[#c49028]/20 text-gray-400 rounded-xl hover:text-white transition-all text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving || uploading} className="px-6 py-2 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-50 flex items-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-[#030810] border-t-transparent rounded-full animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Slide</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      line_two: (editForm as any).line_two,
      description: editForm.description,
      background_image_url: editForm.background_image_url,
      overlay_opacity: editForm.overlay_opacity,
      text_alignment: editForm.text_alignment,
      button_text: editForm.button_text,
      button_link: editForm.button_link,
      button2_text: (editForm as any).button2_text,
      button2_link: (editForm as any).button2_link,
      show_button: editForm.show_button,
      height: editForm.height,
      text_color: editForm.text_color,
      overlay_color: editForm.overlay_color,
      is_active: editForm.is_active,
      is_carousel: editForm.is_carousel,
      slide_interval: editForm.slide_interval,
      image_width: editForm.image_width,
      image_height: editForm.image_height,
      animation_speed: editForm.animation_speed,
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
            {hero.is_carousel && (
              <span className="inline-block mt-1.5 px-1.5 py-0.5 bg-[#c49028]/20 text-[#c49028] text-[10px] rounded">Carousel</span>
            )}
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
                    <label className="block text-sm font-medium text-gray-400 mb-2">Title <span className="text-[#c49028]">(Line 1 — gold)</span></label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      placeholder="e.g., Building Tomorrow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Title Line 2 <span className="text-gray-600">(white)</span></label>
                    <input
                      type="text"
                      value={(editForm as any).line_two || ''}
                      onChange={(e) => handleChange('line_two', e.target.value)}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      placeholder="e.g., With Excellence"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={editForm.subtitle || ''}
                      onChange={(e) => handleChange('subtitle', e.target.value)}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                      placeholder="Short tagline below title"
                    />
                  </div>
                  <div>
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
                  recommendedWidth={editForm.image_width || 1920}
                  recommendedHeight={editForm.image_height || 1080}
                />

                {/* Image Dimensions */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Recommended Width (px)</label>
                    <input
                      type="number"
                      value={editForm.image_width || 1920}
                      onChange={(e) => handleChange('image_width', parseInt(e.target.value) || 1920)}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Recommended Height (px)</label>
                    <input
                      type="number"
                      value={editForm.image_height || 1080}
                      onChange={(e) => handleChange('image_height', parseInt(e.target.value) || 1080)}
                      className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                    />
                  </div>
                </div>
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

              {/* Carousel Settings (Home page only) */}
              {selectedHero.page_id === 'home' && (
                <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
                        <SlidersHorizontal className="w-4 h-4 text-[#c49028]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Carousel Settings</h2>
                        <p className="text-xs text-gray-500">For home page rotating slides</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.is_carousel ?? false}
                        onChange={(e) => handleChange('is_carousel', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c49028]" />
                    </label>
                  </div>

                  {editForm.is_carousel && (
                    <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Slide Interval (ms)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="2000"
                            max="15000"
                            step="500"
                            value={editForm.slide_interval || 6000}
                            onChange={(e) => handleChange('slide_interval', parseInt(e.target.value))}
                            className="flex-1 accent-[#c49028]"
                          />
                          <span className="text-sm text-gray-400 w-16 text-right">{(editForm.slide_interval || 6000) / 1000}s</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Animation Speed (ms)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="200"
                            max="3000"
                            step="100"
                            value={editForm.animation_speed || 1000}
                            onChange={(e) => handleChange('animation_speed', parseInt(e.target.value))}
                            className="flex-1 accent-[#c49028]"
                          />
                          <span className="text-sm text-gray-400 w-16 text-right">{editForm.animation_speed || 1000}ms</span>
                        </div>
                      </div>
                    </div>
                    <HeroSlidesManager />
                    </>
                  )}
                </div>
              )}

              <div className="bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[#c49028]" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Call to Action Buttons</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.show_button ?? true}
                      onChange={(e) => handleChange('show_button', e.target.checked)}
                      className="w-4 h-4 rounded border-[#c49028]/30 accent-[#c49028]"
                    />
                    <span className="text-sm text-gray-400">Show Buttons</span>
                  </label>
                </div>

                {editForm.show_button && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Button 1 Text</label>
                        <input
                          type="text"
                          value={editForm.button_text || ''}
                          onChange={(e) => handleChange('button_text', e.target.value)}
                          className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                          placeholder="e.g., Explore Projects"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Button 1 Link</label>
                        <input
                          type="text"
                          value={editForm.button_link || ''}
                          onChange={(e) => handleChange('button_link', e.target.value)}
                          className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                          placeholder="e.g., /projects"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Button 2 Text <span className="text-gray-600">(optional)</span></label>
                        <input
                          type="text"
                          value={editForm.button2_text || ''}
                          onChange={(e) => handleChange('button2_text', e.target.value)}
                          className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                          placeholder="e.g., Contact Us"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Button 2 Link</label>
                        <input
                          type="text"
                          value={editForm.button2_link || ''}
                          onChange={(e) => handleChange('button2_link', e.target.value)}
                          className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/20 rounded-xl text-white focus:border-[#c49028]/50 focus:outline-none text-sm"
                          placeholder="e.g., /contact"
                        />
                      </div>
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
                      Use high-quality images ({editForm.image_width || 1920}x{editForm.image_height || 1080}px)
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
                    {editForm.is_carousel && (
                      <li className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-[#c49028] mt-0.5 flex-shrink-0" />
                        Carousel interval: {(editForm.slide_interval || 6000) / 1000}s
                      </li>
                    )}
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
