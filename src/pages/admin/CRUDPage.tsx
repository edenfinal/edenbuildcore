import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Save, AlertCircle, Search, Check, Filter,
  MoreVertical, ChevronDown, GripVertical, Image, Eye, EyeOff, Star,
  Layers, RefreshCw, Download, Upload, Copy, Archive, CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CRUDPageProps {
  title: string;
  tableName: string;
  columns: { key: string; label: string; type: string; required?: boolean; options?: string[] }[];
  defaultValues?: Record<string, any>;
  displayFields: { key: string; label: string }[];
}

export default function CRUDPage({ title, tableName, columns, defaultValues = {}, displayFields }: CRUDPageProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(defaultValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [reorderMode, setReorderMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [tableName, sortField, sortDir]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(tableName)
        .select('*')
        .order(sortField, { ascending: sortDir === 'asc', nullsFirst: false });

      if (error) throw error;
      setData(result || []);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const openForm = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData(defaultValues);
    }
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingItem) {
        const { error } = await supabase
          .from(tableName)
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingItem.id);
        if (error) throw error;
        showSuccess('Item updated successfully');
      } else {
        const { error } = await supabase
          .from(tableName)
          .insert([{ ...formData, id: crypto.randomUUID() }]);
        if (error) throw error;
        showSuccess('Item created successfully');
      }
      setShowForm(false);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchData();
      showSuccess('Item deleted successfully');
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedItems.size} items?`)) return;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', Array.from(selectedItems));
      if (error) throw error;
      setSelectedItems(new Set());
      setShowBulkActions(false);
      fetchData();
      showSuccess(`${selectedItems.size} items deleted`);
    } catch (e) {
      console.error('Bulk delete error:', e);
    }
  };

  const handleBulkStatus = async (field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .in('id', Array.from(selectedItems));
      if (error) throw error;
      setSelectedItems(new Set());
      setShowBulkActions(false);
      fetchData();
      showSuccess('Status updated');
    } catch (e) {
      console.error('Bulk status error:', e);
    }
  };

  const handleToggle = async (item: any, field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
      fetchData();
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const handleReorder = async (newData: any[]) => {
    setData(newData);
    const updates = newData.map((item, index) => ({
      id: item.id,
      order_index: index
    }));

    try {
      for (const update of updates) {
        await supabase
          .from(tableName)
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }
    } catch (e) {
      console.error('Reorder error:', e);
      fetchData();
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredData.map(d => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
    setShowBulkActions(newSet.size > 0);
  };

  const filteredData = data.filter(item => {
    const matchesSearch = displayFields.some(field =>
      String(item[field.key] || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesFilter = !activeFilter || item[activeFilter.field] === activeFilter.value;
    return matchesSearch && matchesFilter;
  });

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const hasToggleFields = columns.some(c => c.type === 'boolean');

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400"
          >
            <CheckCircle2 className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">{title}</h1>
          <p className="text-[#909090] mt-1">Manage {title.toLowerCase()} content</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 text-[#909090] hover:text-[#c49028] bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl hover:border-[#c49028]/30 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => openForm()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-bold rounded-xl hover:from-[#c49028] hover:to-[#e8b84a] transition-all shadow-[0_4px_15px_rgba(196,144,40,0.2)]"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl text-white text-sm placeholder-[#606060] focus:outline-none focus:border-[#c49028]/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[#c49028]/10 text-[#c49028]' : 'text-[#606060] hover:text-white'}`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-[#c49028]/10 text-[#c49028]' : 'text-[#606060] hover:text-white'}`}
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          {/* Reorder Toggle */}
          {tableName !== 'inquiries' && (
            <button
              onClick={() => setReorderMode(!reorderMode)}
              className={`p-2.5 border rounded-xl transition-all ${reorderMode ? 'bg-[#c49028]/10 border-[#c49028]/30 text-[#c49028]' : 'bg-[#0c1a2e] border-[#c49028]/10 text-[#606060] hover:text-white hover:border-[#c49028]/30'}`}
              title="Reorder items"
            >
              <GripVertical className="w-4 h-4" />
            </button>
          )}

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="p-2.5 text-[#606060] bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl hover:text-white hover:border-[#c49028]/30 transition-all flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Filter</span>
              {activeFilter && <span className="w-2 h-2 bg-[#c49028] rounded-full" />}
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute right-0 mt-2 w-48 bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl shadow-xl overflow-hidden z-20"
                >
                  <div className="p-2">
                    {columns.filter(c => c.type === 'boolean').map(col => (
                      <button
                        key={col.key}
                        onClick={() => {
                          setActiveFilter(activeFilter?.field === col.key ? null : { field: col.key, value: true });
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeFilter?.field === col.key ? 'bg-[#c49028]/10 text-[#c49028]' : 'text-[#909090] hover:bg-[#c49028]/5 hover:text-white'
                        }`}
                      >
                        {col.label}
                      </button>
                    ))}
                    {activeFilter && (
                      <button
                        onClick={() => { setActiveFilter(null); setFilterOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg mt-1"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 px-4 py-3 bg-[#0c1a2e] border border-[#c49028]/20 rounded-xl"
          >
            <span className="text-sm text-[#909090]">
              <span className="text-white font-semibold">{selectedItems.size}</span> selected
            </span>
            <div className="flex-1" />
            {hasToggleFields && (
              <>
                <button
                  onClick={() => handleBulkStatus('is_active', true)}
                  className="px-3 py-1.5 text-sm text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkStatus('is_active', false)}
                  className="px-3 py-1.5 text-sm text-[#909090] hover:bg-[#c49028]/10 rounded-lg transition-colors"
                >
                  Deactivate
                </button>
              </>
            )}
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#0c1a2e]/50 border border-[#c49028]/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3 text-[#909090]">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Loading...
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-[#606060]">
              <Archive className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No items found</p>
              <p className="text-sm mt-1">Add your first item or adjust your filters</p>
            </div>
          ) : reorderMode ? (
            <Reorder.Group
              axis="y"
              values={filteredData}
              onReorder={handleReorder}
              className="divide-y divide-[#c49028]/10"
            >
              {filteredData.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="flex items-center gap-3 px-6 py-4 bg-[#0c1a2e]/30 hover:bg-[#0c1a2e]/50 cursor-grab active:cursor-grabbing transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-[#606060]" />
                  <div className="flex-1 flex items-center gap-4">
                    {displayFields.slice(0, 3).map(field => (
                      <span key={field.key} className="text-white text-sm">
                        {field.key.includes('image') || field.key.includes('logo') ? (
                          item[field.key] && (
                            <img src={item[field.key]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          )
                        ) : (
                          String(item[field.key] || '-').slice(0, 40)
                        )}
                      </span>
                    ))}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#030810]/50">
                  <tr>
                    <th className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === filteredData.length && filteredData.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-[#c49028]/30 bg-[#030810] text-[#c49028] focus:ring-[#c49028]"
                      />
                    </th>
                    {displayFields.map((field) => (
                      <th
                        key={field.key}
                        onClick={() => {
                          if (sortField === field.key) {
                            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField(field.key);
                            setSortDir('asc');
                          }
                        }}
                        className="text-left px-6 py-4 text-[#909090] font-medium text-sm cursor-pointer hover:text-[#c49028] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {field.label}
                          {sortField === field.key && (
                            <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="text-right px-6 py-4 text-[#909090] font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c49028]/5">
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={`hover:bg-[#c49028]/5 transition-colors ${
                        selectedItems.has(item.id) ? 'bg-[#c49028]/10' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded border-[#c49028]/30 bg-[#030810] text-[#c49028] focus:ring-[#c49028]"
                        />
                      </td>
                      {displayFields.map((field) => (
                        <td key={field.key} className="px-6 py-4 text-white">
                          {field.key.includes('image') || field.key.includes('logo') || field.key.includes('thumbnail') ? (
                            item[field.key] ? (
                              <img src={item[field.key]} alt="" className="w-12 h-12 rounded-lg object-cover border border-[#c49028]/10" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-[#030810]/50 flex items-center justify-center">
                                <Image className="w-5 h-5 text-[#404040]" />
                              </div>
                            )
                          ) : field.key === 'is_active' || field.key === 'is_published' || field.key === 'featured' ? (
                            <button
                              onClick={() => handleToggle(item, field.key, !item[field.key])}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                                item[field.key]
                                  ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                                  : 'bg-[#404040]/15 text-[#606060] border border-[#404040]/20'
                              }`}
                            >
                              {item[field.key] ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              {item[field.key] ? 'Active' : 'Inactive'}
                            </button>
                          ) : field.key === 'status' ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              item[field.key] === 'published' ? 'bg-green-500/15 text-green-400' :
                              item[field.key] === 'draft' ? 'bg-yellow-500/15 text-yellow-400' :
                              'bg-[#404040]/15 text-[#909090]'
                            }`}>
                              {item[field.key]}
                            </span>
                          ) : (
                            <span className="text-sm">{String(item[field.key] || '-').slice(0, 50)}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openForm(item)}
                            className="p-2 text-[#606060] hover:text-[#c49028] hover:bg-[#c49028]/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-[#606060] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="bg-[#0c1a2e]/50 border border-[#c49028]/10 rounded-xl overflow-hidden hover:border-[#c49028]/30 transition-all group"
            >
              {/* Card Image */}
              {(item.image_url || item.thumbnail || item.logo_url) && (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.image_url || item.thumbnail || item.logo_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a2e] via-transparent to-transparent" />
                  {item.featured && (
                    <div className="absolute top-2 right-2 p-1.5 bg-[#c49028] rounded-lg">
                      <Star className="w-3 h-3 text-[#030810]" />
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">
                  {item.title || item.name || item.full_name || 'Untitled'}
                </h3>
                {(item.subtitle || item.position || item.category) && (
                  <p className="text-sm text-[#606060] truncate mt-1">
                    {item.subtitle || item.position || item.category}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4">
                  {(item.is_active !== undefined || item.is_published !== undefined) && (
                    <button
                      onClick={() => handleToggle(item, item.is_active !== undefined ? 'is_active' : 'is_published', !item.is_active)}
                      className={`text-xs px-2 py-1 rounded-full transition-all ${
                        (item.is_active ?? item.is_published)
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-[#404040]/15 text-[#606060]'
                      }`}
                    >
                      {(item.is_active ?? item.is_published) ? 'Active' : 'Inactive'}
                    </button>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openForm(item)}
                      className="p-1.5 text-[#606060] hover:text-[#c49028] hover:bg-[#c49028]/10 rounded-lg transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-[#606060] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 bg-[#020609]/95 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-gradient-to-b from-[#0c1a2e] to-[#060d18] border border-[#c49028]/20 rounded-2xl my-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#c49028]/10">
                <div>
                  <h2 className="text-xl font-heading font-bold text-white">
                    {editingItem ? 'Edit' : 'Add'} {title.slice(0, -1)}
                  </h2>
                  <p className="text-sm text-[#606060] mt-0.5">
                    {editingItem ? 'Modify existing item' : 'Create a new item'}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-[#606060] hover:text-white hover:bg-[#0c1a2e] rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
                {columns.map((col) => (
                  <div key={col.key}>
                    <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                      {col.label} {col.required && <span className="text-red-400">*</span>}
                    </label>
                    {col.type === 'text' || col.type === 'email' || col.type === 'url' ? (
                      <input
                        type={col.type}
                        value={formData[col.key] || ''}
                        onChange={e => handleChange(col.key, e.target.value)}
                        required={col.required}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/15 rounded-xl text-white text-sm focus:border-[#c49028]/40 focus:outline-none transition-all"
                        placeholder={`Enter ${col.label.toLowerCase()}`}
                      />
                    ) : col.type === 'image' ? (
                      <ImageUploadField
                        value={formData[col.key] || ''}
                        onChange={(url: string) => handleChange(col.key, url)}
                      />
                    ) : col.type === 'textarea' ? (
                      <textarea
                        value={formData[col.key] || ''}
                        onChange={e => handleChange(col.key, e.target.value)}
                        rows={4}
                        required={col.required}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/15 rounded-xl text-white text-sm focus:border-[#c49028]/40 focus:outline-none resize-none transition-all"
                        placeholder={`Enter ${col.label.toLowerCase()}`}
                      />
                    ) : col.type === 'select' && col.options ? (
                      <select
                        value={formData[col.key] || ''}
                        onChange={e => handleChange(col.key, e.target.value)}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/15 rounded-xl text-white text-sm focus:border-[#c49028]/40 focus:outline-none transition-all"
                      >
                        <option value="">Select {col.label.toLowerCase()}...</option>
                        {col.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : col.type === 'boolean' ? (
                      <button
                        type="button"
                        onClick={() => handleChange(col.key, !formData[col.key])}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          formData[col.key] ? 'bg-[#c49028]' : 'bg-[#404040]'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            formData[col.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : col.type === 'number' ? (
                      <input
                        type="number"
                        value={formData[col.key] || ''}
                        onChange={e => handleChange(col.key, e.target.value)}
                        required={col.required}
                        className="w-full px-4 py-3 bg-[#030810]/60 border border-[#c49028]/15 rounded-xl text-white text-sm focus:border-[#c49028]/40 focus:outline-none transition-all"
                      />
                    ) : null}
                  </div>
                ))}

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm px-4 py-3 bg-red-400/10 border border-red-400/20 rounded-xl">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </form>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-5 border-t border-[#c49028]/10 bg-[#030810]/30">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm text-[#909090] hover:text-white bg-[#0c1a2e] border border-[#c49028]/10 rounded-xl hover:border-[#c49028]/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] text-sm font-bold rounded-xl disabled:opacity-50 hover:from-[#c49028] hover:to-[#e8b84a] transition-all shadow-[0_4px_15px_rgba(196,144,40,0.2)]"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Image Upload Field ─── */
function ImageUploadField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Max 5MB');
      return;
    }
    setUploading(true);
    setError('');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `crud/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { data, error: upErr } = await supabase.storage.from('site-assets').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (upErr) {
        setError(upErr.message);
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(data.path);
      onChange(urlData.publicUrl);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative border-2 border-dashed border-[#c49028]/20 rounded-xl p-3 hover:border-[#c49028]/40 transition-colors bg-[#030810]/40">
        {value ? (
          <div className="relative">
            <img src={value} alt="Preview" className="h-20 w-auto object-contain mx-auto rounded-lg" onError={() => onChange('')} />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 z-10"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="text-center py-3">
            <Upload className="w-6 h-6 text-[#c49028]/40 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500">Click or drag image</p>
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
          <div className="absolute inset-0 bg-[#030810]/80 rounded-xl flex items-center justify-center z-20">
            <div className="w-5 h-5 border-2 border-[#c49028] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-[10px]">{error}</p>}
    </div>
  );
}
