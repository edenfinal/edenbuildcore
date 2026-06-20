import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Search, ChevronDown, ChevronRight, CheckCircle, AlertCircle, FileText, Type, AlignLeft } from 'lucide-react';
import { useAllPageContent } from '../../hooks/useData';
import type { PageContent } from '../../lib/supabase';

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
  private: 'Private Clients',
};

const KEY_LABELS: Record<string, string> = {
  subtitle: 'Subtitle / Badge',
  default_title: 'Default Title',
  default_description: 'Default Description',
  button_text: 'Button Text',
  secondary_button_text: 'Secondary Button Text',
  stat_1_description: 'Stat 1 Label',
  stat_2_description: 'Stat 2 Label',
  stat_3_description: 'Stat 3 Label',
  stat_4_description: 'Stat 4 Label',
  badge: 'Badge / Label',
  title: 'Title',
  title_line1: 'Title Line 1',
  title_line2: 'Title Line 2',
  description: 'Description',
  paragraph_1: 'Paragraph 1',
  paragraph_2: 'Paragraph 2',
  paragraph_3: 'Paragraph 3',
  feature_1: 'Feature 1',
  feature_2: 'Feature 2',
  feature_3: 'Feature 3',
  feature_4: 'Feature 4',
  link_text: 'Link Text',
  badge_text: 'Badge Text',
  learn_more_text: 'Learn More Text',
  vision_title: 'Vision Title',
  vision_description: 'Vision Description',
  mission_title: 'Mission Title',
  mission_description: 'Mission Description',
  value_1_title: 'Value 1 Title',
  value_1_description: 'Value 1 Description',
  value_2_title: 'Value 2 Title',
  value_2_description: 'Value 2 Description',
  value_3_title: 'Value 3 Title',
  value_3_description: 'Value 3 Description',
  value_4_title: 'Value 4 Title',
  value_4_description: 'Value 4 Description',
  value_5_title: 'Value 5 Title',
  value_5_description: 'Value 5 Description',
  value_6_title: 'Value 6 Title',
  value_6_description: 'Value 6 Description',
  strength_1_title: 'Strength 1 Title',
  strength_1_description: 'Strength 1 Description',
  strength_2_title: 'Strength 2 Title',
  strength_2_description: 'Strength 2 Description',
  strength_3_title: 'Strength 3 Title',
  strength_3_description: 'Strength 3 Description',
  strength_4_title: 'Strength 4 Title',
  strength_4_description: 'Strength 4 Description',
  step_1_title: 'Step 1 Title',
  step_1_description: 'Step 1 Description',
  step_2_title: 'Step 2 Title',
  step_2_description: 'Step 2 Description',
  step_3_title: 'Step 3 Title',
  step_3_description: 'Step 3 Description',
  step_4_title: 'Step 4 Title',
  step_4_description: 'Step 4 Description',
  all_text: 'All Items Text',
  filter_label: 'Filter Label',
  overview_title: 'Overview Title',
  gallery_title: 'Gallery Title',
  sidebar_title: 'Sidebar Title',
  cta_button: 'CTA Button',
  not_found: 'Not Found Text',
  no_results: 'No Results Text',
  form_title: 'Form Title',
  subtitle_form: 'Form Subtitle',
  sending_text: 'Sending Text',
  success_title: 'Success Title',
  success_message: 'Success Message',
  error_message: 'Error Message',
  send_another: 'Send Another Text',
  label_name: 'Name Label',
  label_email: 'Email Label',
  label_phone: 'Phone Label',
  label_company: 'Company Label',
  label_inquiry_type: 'Inquiry Type Label',
  label_subject: 'Subject Label',
  label_message: 'Message Label',
  label_address: 'Address Label',
  label_hours: 'Business Hours Label',
  whatsapp_text: 'WhatsApp Text',
  whatsapp_subtext: 'WhatsApp Subtext',
  inquiry_general: 'General Inquiry',
  inquiry_project: 'Project Inquiry',
  inquiry_partnership: 'Partnership',
  inquiry_career: 'Career Inquiry',
  view_details: 'View Details',
  hide_details: 'Hide Details',
  apply_button: 'Apply Button',
  requirements_title: 'Requirements Title',
  benefits_title: 'Benefits Title',
  label_resume: 'Resume Label',
  label_cover: 'Cover Letter Label',
  label_linkedin: 'LinkedIn Label',
  label_portfolio: 'Portfolio Label',
  submit_button: 'Submit Button',
  search_placeholder: 'Search Placeholder',
  tags_title: 'Tags Title',
  featured_label: 'Featured Label',
  stat_1: 'Stat 1 Text',
  stat_2: 'Stat 2 Text',
  stat_3: 'Stat 3 Text',
  stat_4: 'Stat 4 Text',
  issuing_authority_label: 'Issuing Authority Label',
  certificate_no_label: 'Certificate No. Label',
  issue_date_label: 'Issue Date Label',
  reg_no_label: 'Reg. No. Label',
  download_text: 'Download Text',
  button_1: 'Button 1',
  button_2: 'Button 2',
};

function getFieldLabel(key: string): string {
  return KEY_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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

export default function ContentEditorPage() {
  const { content, loading, error, refetch, updateItem } = useAllPageContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['home']));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const vals: Record<string, string> = {};
    content.forEach((item) => {
      vals[item.id] = item.content_value;
    });
    setEditValues(vals);
  }, [content]);

  const grouped = groupByPage(content);

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
    } else {
      setErrorIds((prev) => new Set(prev).add(id));
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Editor</h1>
          <p className="text-gray-400 text-sm mt-1">Edit every text field on the website - titles, descriptions, labels, and more</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-navy-800 border border-gold-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-navy-800/50 border border-gold-500/10 rounded-lg p-3">
          <div className="text-2xl font-bold text-gold-500">{content.length}</div>
          <div className="text-xs text-gray-400">Total Fields</div>
        </div>
        <div className="bg-navy-800/50 border border-gold-500/10 rounded-lg p-3">
          <div className="text-2xl font-bold text-gold-500">{Object.keys(grouped).length}</div>
          <div className="text-xs text-gray-400">Pages</div>
        </div>
        <div className="bg-navy-800/50 border border-gold-500/10 rounded-lg p-3">
          <div className="text-2xl font-bold text-gold-500">{new Set(content.map((c) => c.section_key)).size}</div>
          <div className="text-xs text-gray-400">Sections</div>
        </div>
        <div className="bg-navy-800/50 border border-gold-500/10 rounded-lg p-3">
          <div className="text-2xl font-bold text-gold-500">{content.filter((c) => c.content_type === 'textarea').length}</div>
          <div className="text-xs text-gray-400">Long Text Fields</div>
        </div>
      </div>

      {/* Content Tree */}
      <div className="space-y-3">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .filter(([page, sections]) => hasSearchMatch(page, sections))
          .map(([page, sections]) => (
            <div key={page} className="bg-navy-800/30 border border-gold-500/10 rounded-xl overflow-hidden">
              {/* Page Header */}
              <button
                onClick={() => togglePage(page)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-navy-800/50 transition-colors"
              >
                {expandedPages.has(page) ? (
                  <ChevronDown className="w-5 h-5 text-gold-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gold-500" />
                )}
                <FileText className="w-5 h-5 text-gold-400" />
                <span className="font-semibold text-white text-left">{PAGE_LABELS[page] || page}</span>
                <span className="text-xs text-gray-500 ml-auto">
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
                            <div key={sectionKey} className="bg-navy-900/50 border border-gold-500/5 rounded-lg overflow-hidden">
                              {/* Section Header */}
                              <button
                                onClick={() => toggleSection(sectionKey)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-navy-800/30 transition-colors"
                              >
                                {expandedSections.has(sectionKey) ? (
                                  <ChevronDown className="w-4 h-4 text-gold-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gold-400" />
                                )}
                                <span className="text-sm font-medium text-gray-200 text-left">
                                  {SECTION_LABELS[section] || section.replace(/_/g, ' ')}
                                </span>
                                <span className="text-xs text-gray-500 ml-auto">{items.length} fields</span>
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
                                        .map((item) => (
                                          <div key={item.id} className="group">
                                            <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                              {item.content_type === 'textarea' ? (
                                                <AlignLeft className="w-3.5 h-3.5" />
                                              ) : (
                                                <Type className="w-3.5 h-3.5" />
                                              )}
                                              {getFieldLabel(item.content_key)}
                                            </label>
                                            <div className="flex gap-2">
                                              {item.content_type === 'textarea' ? (
                                                <textarea
                                                  value={editValues[item.id] ?? item.content_value}
                                                  onChange={(e) =>
                                                    setEditValues((prev) => ({
                                                      ...prev,
                                                      [item.id]: e.target.value,
                                                    }))
                                                  }
                                                  rows={3}
                                                  className="flex-1 px-3 py-2 bg-navy-800 border border-gold-500/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold-500/50 resize-y"
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
                                                  className="flex-1 px-3 py-2 bg-navy-800 border border-gold-500/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
                                                />
                                              )}
                                              <button
                                                onClick={() => handleSave(item.id)}
                                                disabled={
                                                  savingIds.has(item.id) ||
                                                  editValues[item.id] === item.content_value
                                                }
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                                  savedIds.has(item.id)
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    : errorIds.has(item.id)
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    : savingIds.has(item.id)
                                                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30 opacity-70'
                                                    : editValues[item.id] === item.content_value
                                                    ? 'bg-navy-800 text-gray-600 border border-gold-500/10 cursor-not-allowed'
                                                    : 'bg-gold-500/10 text-gold-400 border border-gold-500/20 hover:bg-gold-500/20 hover:border-gold-500/40'
                                                }`}
                                              >
                                                {savingIds.has(item.id) ? (
                                                  <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                                                ) : savedIds.has(item.id) ? (
                                                  <CheckCircle className="w-4 h-4" />
                                                ) : errorIds.has(item.id) ? (
                                                  <AlertCircle className="w-4 h-4" />
                                                ) : (
                                                  <Save className="w-4 h-4" />
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        ))}
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
    </div>
  );
}
