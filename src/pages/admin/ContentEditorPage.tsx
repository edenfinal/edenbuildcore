import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Search, ChevronDown, ChevronRight, CheckCircle, AlertCircle, FileText, Type, AlignLeft, Palette, Bold, Italic, Underline, Strikethrough, AlignCenter, AlignRight, List, ListOrdered, Link as LinkIcon, Image, Undo, Redo, Code, Eye, EyeOff, Trash2, Copy, Sparkles, LayoutGrid as Layout, Heading, Hash, Quote, Minus, Table, Columns2 as Columns, Maximize2, Minimize2, RefreshCw, Check, X, Pencil, ChevronLeft, ChevronRight as ChevronRightIcon, Type as TypeIcon, Baseline, CaseSensitive, Paintbrush, Wand2 } from 'lucide-react';
import { useAllPageContent } from '../../hooks/useData';
import { uploadImage } from '../../lib/supabase';
import type { PageContent } from '../../lib/supabase';

/* ─── Types ─── */
interface TextStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: string;
  letterSpacing: string;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
  fontStyle: 'normal' | 'italic';
}

interface EditorState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  align: 'left' | 'center' | 'right' | 'justify';
}

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

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Section',
  stats: 'Statistics Section',
  about_preview: 'About Preview',
  services: 'Services Section',
  projects: 'Projects Section',
  clients: 'Clients Section',
  testimonials: 'Testimonials Section',
  certifications: 'Certifications Section',
  vision_mission: 'Vision & Mission',
  cta: 'Call to Action',
  overview: 'Company Overview',
  values: 'Core Values',
  vision: 'Vision',
  mission: 'Mission',
  strengths: 'Why Choose Us',
  team: 'Team Section',
  process: 'Our Process',
  filters: 'Filters & Labels',
  detail: 'Detail View',
  empty: 'Empty States',
  form: 'Contact Form',
  info: 'Contact Info',
  application: 'Job Application',
  job: 'Job Listings',
  iso: 'ISO Certifications',
  registrations: 'Company Registrations',
  government: 'Government Clients',
  timeline: 'Journey Timeline',
  private: 'Private Clients',
};

const GLOBALLY_HIDDEN_SECTIONS = new Set([
  'hero',
  'vision_mission',
]);

const PAGE_HIDDEN_SECTIONS: Record<string, Set<string>> = {
  about: new Set(['founder']),
};

const FONT_OPTIONS = [
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Open Sans', value: "'Open Sans', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Merriweather', value: "'Merriweather', serif" },
  { label: 'Source Sans Pro', value: "'Source Sans Pro', sans-serif" },
];

const FONT_SIZE_OPTIONS = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px', '36px', '40px', '48px', '56px', '64px', '72px'
];

const FONT_WEIGHT_OPTIONS = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'SemiBold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'ExtraBold', value: '800' },
];

const LINE_HEIGHT_OPTIONS = [
  { label: 'Tight', value: '1' },
  { label: 'Normal', value: '1.5' },
  { label: 'Relaxed', value: '1.75' },
  { label: 'Loose', value: '2' },
];

const LETTER_SPACING_OPTIONS = [
  { label: 'Tight', value: '-0.05em' },
  { label: 'Normal', value: '0' },
  { label: 'Wide', value: '0.05em' },
  { label: 'Wider', value: '0.1em' },
  { label: 'Widest', value: '0.2em' },
];

const COLOR_PALETTE = [
  '#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8', '#475569', '#1e293b', '#0f172a', '#000000',
  '#c49028', '#e8b84a', '#ddb040', '#a67820', '#fbbf24', '#f59e0b', '#d97706',
  '#ef4444', '#f87171', '#fca5a5', '#10b981', '#34d399', '#6ee7b7',
  '#3b82f6', '#60a5fa', '#93c5fd', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#ec4899', '#f472b6', '#f9a8d4', '#14b8a6', '#2dd4bf', '#5eead4',
];

function getFieldLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function groupByPage(items: PageContent[]): Record<string, Record<string, PageContent[]>> {
  const result: Record<string, Record<string, PageContent[]>> = {};
  items.forEach((item) => {
    if (!result[item.page_id]) result[item.page_id] = {};
    if (!result[item.page_id][item.section_key]) result[item.page_id][item.section_key] = [];
    result[item.page_id][item.section_key].push(item);
  });
  return result;
}

function isContentEditorVisible(item: PageContent): boolean {
  if (GLOBALLY_HIDDEN_SECTIONS.has(item.section_key)) return false;
  if (PAGE_HIDDEN_SECTIONS[item.page_id]?.has(item.section_key)) return false;
  return true;
}

/* ─── RichTextToolbar ─── */
function RichTextToolbar({
  onFormat,
  onColor,
  onStyleChange,
  activeStyle,
  editorState,
}: {
  onFormat: (cmd: string, val?: string) => void;
  onColor: (color: string) => void;
  onStyleChange: (style: Partial<TextStyle>) => void;
  activeStyle: TextStyle;
  editorState: EditorState;
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'format' | 'style' | 'color'>('format');

  return (
    <div className="bg-[#0a1628] border border-[#c49028]/15 rounded-xl overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex border-b border-[#c49028]/10">
        {[
          { id: 'format' as const, label: 'Format', icon: Bold },
          { id: 'style' as const, label: 'Style', icon: TypeIcon },
          { id: 'color' as const, label: 'Color', icon: Palette },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'text-[#c49028] bg-[#c49028]/10 border-b-2 border-[#c49028]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-2">
        {activeTab === 'format' && (
          <div className="flex flex-wrap items-center gap-1">
            {/* Text Formatting */}
            <ToolbarGroup>
              <ToolbarBtn active={editorState.bold} onClick={() => onFormat('bold')} title="Bold">
                <Bold className="w-3.5 h-3.5" />
              </ToolbarBtn>
              <ToolbarBtn active={editorState.italic} onClick={() => onFormat('italic')} title="Italic">
                <Italic className="w-3.5 h-3.5" />
              </ToolbarBtn>
              <ToolbarBtn active={editorState.underline} onClick={() => onFormat('underline')} title="Underline">
                <Underline className="w-3.5 h-3.5" />
              </ToolbarBtn>
              <ToolbarBtn active={editorState.strikethrough} onClick={() => onFormat('strikeThrough')} title="Strikethrough">
                <Strikethrough className="w-3.5 h-3.5" />
              </ToolbarBtn>
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Alignment */}
            <ToolbarGroup>
              <ToolbarBtn active={editorState.align === 'left'} onClick={() => onFormat('justifyLeft')} title="Align Left">
                <AlignLeft className="w-3.5 h-3.5" />
              </ToolbarBtn>
              <ToolbarBtn active={editorState.align === 'center'} onClick={() => onFormat('justifyCenter')} title="Align Center">
                <AlignCenter className="w-3.5 h-3.5" />
              </ToolbarBtn>
              <ToolbarBtn active={editorState.align === 'right'} onClick={() => onFormat('justifyRight')} title="Align Right">
                <AlignRight className="w-3.5 h-3.5" />
              </ToolbarBtn>
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarGroup>
              <ToolbarBtn active={editorState.unorderedList} onClick={() => onFormat('insertUnorderedList')} title="Bullet List">
                <List className="w-3.5 h-3.5" />
              </ToolbarBtn>
              <ToolbarBtn active={editorState.orderedList} onClick={() => onFormat('insertOrderedList')} title="Numbered List">
                <ListOrdered className="w-3.5 h-3.5" />
              </ToolbarBtn>
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Undo/Redo */}
            <ToolbarGroup>
              <ToolbarBtn onClick={() => onFormat('undo')} title="Undo">
                <Undo className="w-3.5 h-3.5" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => onFormat('redo')} title="Redo">
                <Redo className="w-3.5 h-3.5" />
              </ToolbarBtn>
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Clear Format */}
            <ToolbarGroup>
              <ToolbarBtn onClick={() => onFormat('removeFormat')} title="Clear Formatting">
                <Trash2 className="w-3.5 h-3.5" />
              </ToolbarBtn>
            </ToolbarGroup>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* Font Family */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Font</label>
              <select
                value={activeStyle.fontFamily}
                onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
                className="w-full px-2 py-1.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-white text-xs focus:border-[#c49028]/50 focus:outline-none"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Size</label>
              <select
                value={activeStyle.fontSize}
                onChange={(e) => onStyleChange({ fontSize: e.target.value })}
                className="w-full px-2 py-1.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-white text-xs focus:border-[#c49028]/50 focus:outline-none"
              >
                {FONT_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Weight</label>
              <select
                value={activeStyle.fontWeight}
                onChange={(e) => onStyleChange({ fontWeight: e.target.value })}
                className="w-full px-2 py-1.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-white text-xs focus:border-[#c49028]/50 focus:outline-none"
              >
                {FONT_WEIGHT_OPTIONS.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>

            {/* Line Height */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Line Height</label>
              <select
                value={activeStyle.lineHeight}
                onChange={(e) => onStyleChange({ lineHeight: e.target.value })}
                className="w-full px-2 py-1.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-white text-xs focus:border-[#c49028]/50 focus:outline-none"
              >
                {LINE_HEIGHT_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Spacing</label>
              <select
                value={activeStyle.letterSpacing}
                onChange={(e) => onStyleChange({ letterSpacing: e.target.value })}
                className="w-full px-2 py-1.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-white text-xs focus:border-[#c49028]/50 focus:outline-none"
              >
                {LETTER_SPACING_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Text Transform */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Transform</label>
              <select
                value={activeStyle.textTransform}
                onChange={(e) => onStyleChange({ textTransform: e.target.value as any })}
                className="w-full px-2 py-1.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-white text-xs focus:border-[#c49028]/50 focus:outline-none"
              >
                <option value="none">None</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
                <option value="capitalize">Capitalize</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'color' && (
          <div className="space-y-3">
            {/* Text Color */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Text Color</label>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => onColor(color)}
                    className={`w-6 h-6 rounded-md border-2 transition-all ${
                      activeStyle.color === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Highlight / Background</label>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={`bg-${color}`}
                    onClick={() => onStyleChange({ backgroundColor: color === activeStyle.backgroundColor ? 'transparent' : color })}
                    className={`w-6 h-6 rounded-md border-2 transition-all ${
                      activeStyle.backgroundColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeStyle.color}
                onChange={(e) => onColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-[#c49028]/30"
              />
              <input
                type="text"
                value={activeStyle.color}
                onChange={(e) => onColor(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-white text-xs focus:border-[#c49028]/50 focus:outline-none"
                placeholder="#c49028"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5 bg-[#060d18] rounded-lg p-0.5">{children}</div>;
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-[#c49028]/10 mx-1" />;
}

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-all ${
        active
          ? 'bg-[#c49028]/20 text-[#c49028]'
          : 'text-gray-400 hover:text-white hover:bg-[#0c1a2e]'
      }`}
    >
      {children}
    </button>
  );
}

/* ─── LivePreview ─── */
function LivePreview({ content, style }: { content: string; style: TextStyle }) {
  return (
    <div className="bg-[#060d18] border border-[#c49028]/10 rounded-xl p-4 mt-3">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="w-3.5 h-3.5 text-[#c49028]" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Live Preview</span>
      </div>
      <div
        className="min-h-[60px] p-3 bg-[#0c1a2e] rounded-lg border border-[#c49028]/5 overflow-auto"
        style={{
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          color: style.color,
          backgroundColor: style.backgroundColor === 'transparent' ? undefined : style.backgroundColor,
          textAlign: style.textAlign,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textTransform: style.textTransform,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

/* ─── BulkActionsBar ─── */
function BulkActionsBar({
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onBulkSave,
  onBulkReset,
  saving,
}: {
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkSave: () => void;
  onBulkReset: () => void;
  saving: boolean;
}) {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 lg:left-72 lg:right-6 z-50"
    >
      <div className="bg-[#0c1a2e] border border-[#c49028]/30 rounded-xl shadow-2xl shadow-black/50 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-[#c49028]" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</p>
            <p className="text-xs text-gray-500">You can save or reset all selected items at once</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDeselectAll}
            className="px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onBulkReset}
            className="px-3 py-2 text-xs text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all"
          >
            Reset All
          </button>
          <button
            onClick={onBulkSave}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold text-xs rounded-lg disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-[#030810] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save All
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Helpers ─── */
function isImageField(item: PageContent): boolean {
  return (
    item.content_type === 'image' ||
    item.content_key.endsWith('_url') ||
    item.content_key.endsWith('_image') ||
    item.content_key === 'logo' ||
    item.content_key === 'background'
  );
}

/* ─── Inline Image Upload for Content Editor ─── */
function InlineImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const doUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const { url, error: err } = await uploadImage(file, 'content');
      if (err || !url) { setError(err || 'Upload failed'); }
      else { onChange(url); }
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) doUpload(e.target.files[0]); }} className="hidden" />
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter image URL or upload below"
          className="flex-1 px-3 py-2 bg-[#060d18] border border-[#c49028]/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#c49028]/40"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-[#c49028]/10 text-[#c49028] rounded-lg hover:bg-[#c49028]/20 transition-all text-xs font-medium flex items-center gap-1.5 border border-[#c49028]/20"
        >
          {uploading ? <div className="w-3 h-3 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" /> : <Image className="w-3.5 h-3.5" />}
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-[#c49028]/10 group">
          <img src={value} alt="Preview" className="h-20 w-full object-cover" onError={() => onChange('')} />
          <button type="button" onClick={() => onChange('')} className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      {error && <p className="text-red-400 text-[10px]">{error}</p>}
    </div>
  );
}

/* ─── Main Component ─── */
export default function ContentEditorPage() {
  const { content, loading, error, refetch, updateItem } = useAllPageContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['home']));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);

  // Rich text editor state
  const [activeEditorId, setActiveEditorId] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    bold: false, italic: false, underline: false, strikethrough: false,
    orderedList: false, unorderedList: false, align: 'left',
  });
  const [activeStyle, setActiveStyle] = useState<TextStyle>({
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: '400',
    color: '#ffffff',
    backgroundColor: 'transparent',
    textAlign: 'left',
    lineHeight: '1.5',
    letterSpacing: '0',
    textTransform: 'none',
    textDecoration: 'none',
    fontStyle: 'normal',
  });

  // View mode: 'edit' | 'preview'
  const [viewMode, setViewMode] = useState<Record<string, 'edit' | 'preview'>>({});

  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const visibleContent = useMemo(() => content.filter(isContentEditorVisible), [content]);

  useEffect(() => {
    const vals: Record<string, string> = {};
    visibleContent.forEach((item) => {
      vals[item.id] = item.content_value;
    });
    setEditValues(vals);
    setSelectedIds((prev) => {
      const visibleIds = new Set(visibleContent.map((item) => item.id));
      return new Set(Array.from(prev).filter((id) => visibleIds.has(id)));
    });
  }, [visibleContent]);

  const grouped = groupByPage(visibleContent);

  const togglePage = (page: string) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async (id: string) => {
    const value = editValues[id];
    if (value === undefined) return;

    setSavingIds((prev) => new Set(prev).add(id));
    setErrorIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setSavedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });

    const success = await updateItem(id, value);

    setSavingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });

    if (success) {
      setSavedIds((prev) => new Set(prev).add(id));
      setTimeout(() => setSavedIds((prev) => { const n = new Set(prev); n.delete(id); return n; }), 2000);
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } else {
      setErrorIds((prev) => new Set(prev).add(id));
    }
  };

  const handleBulkSave = async () => {
    setBulkSaving(true);
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await handleSave(id);
    }
    setBulkSaving(false);
  };

  const handleBulkReset = () => {
    const next = { ...editValues };
    selectedIds.forEach((id) => {
      const item = visibleContent.find((c) => c.id === id);
      if (item) next[id] = item.content_value;
    });
    setEditValues(next);
    setSelectedIds(new Set());
  };

  const handleSelectAllVisible = () => {
    const allVisible = new Set<string>();
    Object.entries(grouped).forEach(([page, sections]) => {
      if (!hasSearchMatch(page, sections)) return;
      Object.entries(sections).forEach(([section, items]) => {
        if (!sectionHasSearchMatch(items)) return;
        items.filter(matchesSearch).forEach((item) => allVisible.add(item.id));
      });
    });
    setSelectedIds(allVisible);
  };

  // Rich text commands
  const execFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateEditorState();
  }, []);

  const updateEditorState = useCallback(() => {
    setEditorState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      orderedList: document.queryCommandState('insertOrderedList'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      align: document.queryCommandValue('justifyLeft') ? 'left' :
             document.queryCommandValue('justifyCenter') ? 'center' :
             document.queryCommandValue('justifyRight') ? 'right' : 'left',
    });
  }, []);

  const applyColor = useCallback((color: string) => {
    document.execCommand('foreColor', false, color);
    setActiveStyle((prev) => ({ ...prev, color }));
  }, []);

  const applyStyleChange = useCallback((style: Partial<TextStyle>) => {
    setActiveStyle((prev) => ({ ...prev, ...style }));
    // Apply to selection if any
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      if (style.fontFamily) span.style.fontFamily = style.fontFamily;
      if (style.fontSize) span.style.fontSize = style.fontSize;
      if (style.fontWeight) span.style.fontWeight = style.fontWeight;
      if (style.color) span.style.color = style.color;
      if (style.backgroundColor) span.style.backgroundColor = style.backgroundColor;
      if (style.textAlign) span.style.textAlign = style.textAlign;
      if (style.lineHeight) span.style.lineHeight = style.lineHeight;
      if (style.letterSpacing) span.style.letterSpacing = style.letterSpacing;
      if (style.textTransform) span.style.textTransform = style.textTransform;
      try {
        range.surroundContents(span);
      } catch {
        // fallback: execCommand for simple cases
      }
    }
  }, []);

  const handleContentInput = (id: string, html: string) => {
    setEditValues((prev) => ({ ...prev, [id]: html }));
  };

  const matchesSearch = (item: PageContent): boolean => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.content_value.toLowerCase().includes(q) ||
      item.section_key.toLowerCase().includes(q) ||
      item.content_key.toLowerCase().includes(q) ||
      item.page_id.toLowerCase().includes(q)
    );
  };

  const hasSearchMatch = (page: string, sections: Record<string, PageContent[]>): boolean => {
    if (!searchQuery) return true;
    return Object.values(sections).some((items) => items.some(matchesSearch));
  };

  const sectionHasSearchMatch = (items: PageContent[]): boolean => {
    if (!searchQuery) return true;
    return items.some(matchesSearch);
  };

  const getChangedCount = () => {
    return visibleContent.filter((item) => editValues[item.id] !== undefined && editValues[item.id] !== item.content_value).length;
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
        <p className="text-red-400 font-medium">Failed to load content</p>
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
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c49028] to-[#a67820] flex items-center justify-center">
              <Pencil className="w-5 h-5 text-[#030810]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Content Editor</h1>
              <p className="text-gray-400 text-sm mt-0.5">Edit every text field on the website with full formatting control</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Changed indicator */}
          {getChangedCount() > 0 && (
            <div className="px-3 py-1.5 bg-[#c49028]/10 border border-[#c49028]/20 rounded-lg text-xs text-[#c49028]">
              {getChangedCount()} unsaved change{getChangedCount() > 1 ? 's' : ''}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[#0c1a2e] border border-[#c49028]/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c49028]/50 w-full sm:w-72 text-sm"
            />
          </div>
          <button
            onClick={handleSelectAllVisible}
            className="px-3 py-2.5 bg-[#0c1a2e] border border-[#c49028]/20 rounded-xl text-gray-300 hover:text-white hover:border-[#c49028]/40 transition-all text-sm flex items-center gap-1.5"
            title="Select all visible"
          >
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">Select All</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Total Fields" value={visibleContent.length} icon={Hash} />
        <StatCard label="Pages" value={Object.keys(grouped).length} icon={Layout} />
        <StatCard label="Sections" value={new Set(visibleContent.map((c) => c.section_key)).size} icon={Columns} />
        <StatCard label="Long Text" value={visibleContent.filter((c) => c.content_type === 'textarea').length} icon={AlignLeft} />
        <StatCard label="Unsaved" value={getChangedCount()} icon={Sparkles} color={getChangedCount() > 0 ? 'text-[#c49028]' : 'text-gray-400'} />
      </div>

      {/* Content Tree */}
      <div className="space-y-3">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .filter(([page, sections]) => hasSearchMatch(page, sections))
          .map(([page, sections]) => (
            <div key={page} className="bg-[#0c1a2e]/60 border border-[#c49028]/10 rounded-xl overflow-hidden">
              {/* Page Header */}
              <button
                onClick={() => togglePage(page)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#0c1a2e] transition-colors"
              >
                {expandedPages.has(page) ? (
                  <ChevronDown className="w-5 h-5 text-[#c49028]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#c49028]" />
                )}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c49028]/20 to-[#a67820]/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#c49028]" />
                </div>
                <span className="font-semibold text-white text-left">{PAGE_LABELS[page] || page}</span>
                <span className="text-xs text-gray-500 ml-auto bg-[#060d18] px-2 py-1 rounded-md">
                  {Object.values(sections).flat().length} fields
                </span>
              </button>

              {/* Sections */}
              <AnimatePresence>
                {expandedPages.has(page) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {Object.entries(sections)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .filter(([, items]) => sectionHasSearchMatch(items))
                        .map(([section, items]) => {
                          const sectionKey = `${page}.${section}`;
                          return (
                            <div key={sectionKey} className="bg-[#060d18]/60 border border-[#c49028]/5 rounded-lg overflow-hidden">
                              {/* Section Header */}
                              <button
                                onClick={() => toggleSection(sectionKey)}
                                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#0c1a2e]/50 transition-colors"
                              >
                                {expandedSections.has(sectionKey) ? (
                                  <ChevronDown className="w-4 h-4 text-[#c49028]/70" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-[#c49028]/70" />
                                )}
                                <span className="text-sm font-medium text-gray-200 text-left">
                                  {SECTION_LABELS[section] || section.replace(/_/g, ' ')}
                                </span>
                                <span className="text-xs text-gray-600 ml-auto">{items.length} fields</span>
                              </button>

                              {/* Fields */}
                              <AnimatePresence>
                                {expandedSections.has(sectionKey) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-3 pb-3 space-y-3">
                                      {items
                                        .filter(matchesSearch)
                                        .map((item) => {
                                          const isChanged = editValues[item.id] !== undefined && editValues[item.id] !== item.content_value;
                                          const isSelected = selectedIds.has(item.id);
                                          const isActive = activeEditorId === item.id;
                                          const mode = viewMode[item.id] || 'edit';

                                          return (
                                            <div
                                              key={item.id}
                                              className={`group relative bg-[#0a1628] border rounded-xl overflow-hidden transition-all ${
                                                isSelected
                                                  ? 'border-[#c49028]/40 ring-1 ring-[#c49028]/20'
                                                  : isChanged
                                                  ? 'border-amber-500/20'
                                                  : 'border-[#c49028]/8 hover:border-[#c49028]/15'
                                              }`}
                                            >
                                              {/* Field Header */}
                                              <div className="flex items-center gap-2 px-3 py-2 border-b border-[#c49028]/5">
                                                <button
                                                  onClick={() => toggleSelect(item.id)}
                                                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                                                    isSelected
                                                      ? 'bg-[#c49028] border-[#c49028]'
                                                      : 'border-gray-600 hover:border-[#c49028]/50'
                                                  }`}
                                                >
                                                  {isSelected && <Check className="w-2.5 h-2.5 text-[#030810]" />}
                                                </button>
                                                <label className="flex items-center gap-1.5 text-xs text-gray-400 flex-1">
                                                  {item.content_type === 'textarea' ? (
                                                    <AlignLeft className="w-3 h-3" />
                                                  ) : (
                                                    <Type className="w-3 h-3" />
                                                  )}
                                                  <span className="font-medium">{getFieldLabel(item.content_key)}</span>
                                                </label>
                                                {isChanged && (
                                                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">Modified</span>
                                                )}
                                                {/* View Toggle */}
                                                <div className="flex bg-[#060d18] rounded-lg p-0.5">
                                                  <button
                                                    onClick={() => setViewMode((prev) => ({ ...prev, [item.id]: 'edit' }))}
                                                    className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                                                      mode === 'edit' ? 'bg-[#c49028]/20 text-[#c49028]' : 'text-gray-500'
                                                    }`}
                                                  >
                                                    Edit
                                                  </button>
                                                  <button
                                                    onClick={() => setViewMode((prev) => ({ ...prev, [item.id]: 'preview' }))}
                                                    className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                                                      mode === 'preview' ? 'bg-[#c49028]/20 text-[#c49028]' : 'text-gray-500'
                                                    }`}
                                                  >
                                                    Preview
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Editor Body */}
                                              <div className="p-3">
                                                {mode === 'edit' ? (
                                                  <>
                                                    {/* Rich Text Toolbar - only for textarea */}
                                                    {item.content_type === 'textarea' && isActive && (
                                                      <div className="mb-2">
                                                        <RichTextToolbar
                                                          onFormat={execFormat}
                                                          onColor={applyColor}
                                                          onStyleChange={applyStyleChange}
                                                          activeStyle={activeStyle}
                                                          editorState={editorState}
                                                        />
                                                      </div>
                                                    )}

                                                    {/* Input */}
                                                    {item.content_type === 'textarea' ? (
                                                      <div
                                                        ref={(el) => { contentRefs.current[item.id] = el; }}
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onFocus={() => {
                                                          setActiveEditorId(item.id);
                                                          updateEditorState();
                                                        }}
                                                        onBlur={() => {
                                                          // Keep active for a moment to allow toolbar clicks
                                                        }}
                                                        onInput={(e) => handleContentInput(item.id, (e.target as HTMLDivElement).innerHTML)}
                                                        className="w-full min-h-[100px] px-3 py-2.5 bg-[#060d18] border border-[#c49028]/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#c49028]/40 resize-y overflow-auto"
                                                        style={{ fontFamily: activeStyle.fontFamily }}
                                                        dangerouslySetInnerHTML={{ __html: editValues[item.id] ?? item.content_value }}
                                                      />
                                                    ) : isImageField(item) ? (
                                                      <InlineImageUpload
                                                        value={editValues[item.id] ?? item.content_value}
                                                        onChange={(url) => setEditValues((prev) => ({ ...prev, [item.id]: url }))}
                                                      />
                                                    ) : (
                                                      <input
                                                        type="text"
                                                        value={editValues[item.id] ?? item.content_value}
                                                        onChange={(e) =>
                                                          setEditValues((prev) => ({
                                                            ...prev,
                                                            [item.id]: e.target.value,
                                                          }))
                                                        }
                                                        className="w-full px-3 py-2.5 bg-[#060d18] border border-[#c49028]/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#c49028]/40"
                                                      />
                                                    )}

                                                    {/* Quick Actions */}
                                                    <div className="flex items-center justify-between mt-2">
                                                      <div className="flex items-center gap-1.5">
                                                        <button
                                                          onClick={() => {
                                                            navigator.clipboard.writeText(editValues[item.id] ?? item.content_value);
                                                          }}
                                                          className="p-1.5 text-gray-500 hover:text-[#c49028] hover:bg-[#c49028]/10 rounded-lg transition-all"
                                                          title="Copy content"
                                                        >
                                                          <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                          onClick={() => {
                                                            setEditValues((prev) => ({ ...prev, [item.id]: item.content_value }));
                                                            setSelectedIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
                                                          }}
                                                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                          title="Reset to original"
                                                        >
                                                          <RefreshCw className="w-3.5 h-3.5" />
                                                        </button>
                                                      </div>

                                                      <button
                                                        onClick={() => handleSave(item.id)}
                                                        disabled={savingIds.has(item.id) || !isChanged}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                                                          savedIds.has(item.id)
                                                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                                            : errorIds.has(item.id)
                                                            ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                                                            : savingIds.has(item.id)
                                                            ? 'bg-[#c49028]/15 text-[#c49028] border border-[#c49028]/25 opacity-70'
                                                            : !isChanged
                                                            ? 'bg-[#060d18] text-gray-600 border border-[#c49028]/8 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold'
                                                        }`}
                                                      >
                                                        {savingIds.has(item.id) ? (
                                                          <div className="w-3.5 h-3.5 border-2 border-[#030810] border-t-transparent rounded-full animate-spin" />
                                                        ) : savedIds.has(item.id) ? (
                                                          <CheckCircle className="w-3.5 h-3.5" />
                                                        ) : errorIds.has(item.id) ? (
                                                          <AlertCircle className="w-3.5 h-3.5" />
                                                        ) : (
                                                          <Save className="w-3.5 h-3.5" />
                                                        )}
                                                        {savedIds.has(item.id)
                                                          ? 'Saved'
                                                          : errorIds.has(item.id)
                                                          ? 'Error'
                                                          : savingIds.has(item.id)
                                                          ? 'Saving...'
                                                          : 'Save'}
                                                      </button>
                                                    </div>
                                                  </>
                                                ) : (
                                                  /* Preview Mode */
                                                  <div className="bg-[#060d18] rounded-lg p-4 border border-[#c49028]/5">
                                                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                                                      {editValues[item.id] ?? item.content_value}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {visibleContent.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-gray-400 font-medium">No content found</p>
          <p className="text-gray-600 text-sm mt-1">Content will appear here once added to the database</p>
        </div>
      )}

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <BulkActionsBar
            selectedCount={selectedIds.size}
            onSelectAll={handleSelectAllVisible}
            onDeselectAll={() => setSelectedIds(new Set())}
            onBulkSave={handleBulkSave}
            onBulkReset={handleBulkReset}
            saving={bulkSaving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── StatCard ─── */
function StatCard({
  label,
  value,
  icon: Icon,
  color = 'text-[#c49028]',
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  return (
    <div className="bg-[#0c1a2e]/50 border border-[#c49028]/10 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
