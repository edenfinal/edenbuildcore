import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, CreditCard as Edit2, Trash2, Search, X, CheckCircle, AlertCircle, User, Mail, Lock, Eye, EyeOff, RefreshCw, Users, UserCheck, UserX, MoreVertical, Save, KeyRound } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AdminUser } from '../../lib/supabase';
import { hashAdminPassword, useAuth } from '../../hooks/useAuth';

type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

interface AdminFormData {
  email: string;
  name: string;
  role: AdminRole;
  password: string;
  is_active: boolean;
}

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  editor: 'Editor',
  viewer: 'Viewer',
};

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: 'Full access to all features including admin management',
  admin: 'Full access to content management, limited admin management',
  editor: 'Can create and edit content but cannot delete or manage admins',
  viewer: 'Read-only access to content and settings',
};

const ROLE_COLORS: Record<AdminRole, string> = {
  super_admin: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  admin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  editor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  viewer: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function AdminUsersPage() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<AdminFormData>({
    email: '',
    name: '',
    role: 'editor',
    password: '',
    is_active: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data as AdminUser[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AdminFormData, string>> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (modalMode === 'create' && !formData.password) {
      errors.password = 'Password is required';
    } else if (modalMode === 'create' && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedAdmin(null);
    setFormData({
      email: '',
      name: '',
      role: 'editor',
      password: '',
      is_active: true,
    });
    setFormErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const handleOpenEdit = (admin: AdminUser) => {
    setModalMode('edit');
    setSelectedAdmin(admin);
    setFormData({
      email: admin.email,
      name: admin.name || '',
      role: admin.role as AdminRole,
      password: '',
      is_active: admin.is_active,
    });
    setFormErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      if (modalMode === 'create') {
        const passwordHash = await hashAdminPassword(formData.password);
        const { error } = await supabase
          .from('admin_users')
          .insert({
            email: formData.email,
            name: formData.name || null,
            role: formData.role,
            password_hash: passwordHash,
            is_active: formData.is_active,
          });

        if (error) {
          if (error.code === '23505') {
            setFormErrors({ email: 'An admin with this email already exists' });
          } else {
            throw error;
          }
          setSaving(false);
          return;
        }
      } else if (selectedAdmin) {
        const updateData: Record<string, unknown> = {
          email: formData.email,
          name: formData.name || null,
          role: formData.role,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        };

        if (formData.password) {
          updateData.password_hash = await hashAdminPassword(formData.password);
        }

        const { error } = await supabase
          .from('admin_users')
          .update(updateData)
          .eq('id', selectedAdmin.id);

        if (error) {
          if (error.code === '23505') {
            setFormErrors({ email: 'An admin with this email already exists' });
          } else {
            throw error;
          }
          setSaving(false);
          return;
        }
      }

      setShowModal(false);
      await fetchAdmins();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (currentAdmin?.id === id) {
      setError('Cannot delete your own account');
      setDeleteConfirm(null);
      return;
    }

    setDeleting(true);

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAdmins();
      setDeleteConfirm(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete admin');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (admin: AdminUser) => {
    if (currentAdmin?.id === admin.id) {
      setError('Cannot deactivate your own account');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !admin.is_active, updated_at: new Date().toISOString() })
        .eq('id', admin.id);

      if (error) throw error;
      await fetchAdmins();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update admin');
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      admin.email.toLowerCase().includes(q) ||
      (admin.name?.toLowerCase().includes(q)) ||
      admin.role.toLowerCase().includes(q)
    );
  });

  const canManageAdmins = currentAdmin?.role === 'super_admin';

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c49028] to-[#a67820] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#030810]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Management</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage admin accounts and permissions</p>
          </div>
        </div>
        {canManageAdmins && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4 text-red-400 hover:text-red-300" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0c1a2e]/50 border border-[#c49028]/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#c49028]" />
            <span className="text-xs text-gray-500">Total Admins</span>
          </div>
          <div className="text-2xl font-bold text-[#c49028]">{admins.length}</div>
        </div>
        <div className="bg-[#0c1a2e]/50 border border-[#c49028]/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {admins.filter((a) => a.is_active).length}
          </div>
        </div>
        <div className="bg-[#0c1a2e]/50 border border-[#c49028]/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-500">Super Admins</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {admins.filter((a) => a.role === 'super_admin').length}
          </div>
        </div>
        <div className="bg-[#0c1a2e]/50 border border-[#c49028]/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserX className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-500">Inactive</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            {admins.filter((a) => !a.is_active).length}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search admins by email, name, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#0c1a2e] border border-[#c49028]/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c49028]/50"
        />
      </div>

      {/* Admin List */}
      <div className="bg-[#0c1a2e]/60 border border-[#c49028]/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#c49028]/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c49028]/5">
              {filteredAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className={`hover:bg-[#c49028]/5 transition-colors ${
                    currentAdmin?.id === admin.id ? 'bg-[#c49028]/5' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c49028]/20 to-[#a67820]/10 flex items-center justify-center text-[#c49028] font-semibold">
                        {admin.name?.[0]?.toUpperCase() || admin.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {admin.name || 'No name'}
                          {currentAdmin?.id === admin.id && (
                            <span className="ml-2 text-xs text-[#c49028]">(You)</span>
                          )}
                        </p>
                        <p className="text-gray-500 text-xs">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${ROLE_COLORS[admin.role as AdminRole]}`}>
                      {ROLE_LABELS[admin.role as AdminRole] || admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${
                      admin.is_active ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {admin.is_active ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-400 text-xs">
                      {admin.last_login
                        ? new Date(admin.last_login).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Never'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {canManageAdmins && currentAdmin?.id !== admin.id && (
                        <button
                          onClick={() => handleToggleActive(admin)}
                          className={`p-2 rounded-lg transition-all ${
                            admin.is_active
                              ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                              : 'text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                          title={admin.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {admin.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      )}
                      {canManageAdmins && (
                        <button
                          onClick={() => handleOpenEdit(admin)}
                          className="p-2 text-gray-500 hover:text-[#c49028] hover:bg-[#c49028]/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {canManageAdmins && currentAdmin?.id !== admin.id && (
                        <button
                          onClick={() => setDeleteConfirm(admin.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAdmins.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Shield className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-gray-400 font-medium">No admins found</p>
            {searchQuery && (
              <p className="text-gray-600 text-sm mt-1">Try adjusting your search</p>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c1a2e] border border-[#c49028]/20 rounded-2xl w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#c49028]/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#c49028]/10 flex items-center justify-center">
                    {modalMode === 'create' ? (
                      <Plus className="w-4 h-4 text-[#c49028]" />
                    ) : (
                      <Edit2 className="w-4 h-4 text-[#c49028]" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {modalMode === 'create' ? 'Add New Admin' : 'Edit Admin'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-gray-500 hover:text-white hover:bg-[#c49028]/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-4">
                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-[#060d18] border rounded-lg text-white text-sm focus:outline-none focus:border-[#c49028]/50 ${
                      formErrors.email ? 'border-red-500/50' : 'border-[#c49028]/20'
                    }`}
                    placeholder="admin@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                    <User className="w-3.5 h-3.5" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#c49028]/50"
                    placeholder="John Doe"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(ROLE_LABELS) as AdminRole[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, role })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          formData.role === role
                            ? 'border-[#c49028]/50 bg-[#c49028]/10'
                            : 'border-[#c49028]/10 hover:border-[#c49028]/30'
                        }`}
                      >
                        <p className={`text-sm font-medium ${
                          formData.role === role ? 'text-[#c49028]' : 'text-white'
                        }`}>
                          {ROLE_LABELS[role]}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {ROLE_DESCRIPTIONS[role]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Password {modalMode === 'edit' && (
                      <span className="text-gray-600">(leave empty to keep current)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full px-3 py-2.5 pr-10 bg-[#060d18] border rounded-lg text-white text-sm focus:outline-none focus:border-[#c49028]/50 ${
                        formErrors.password ? 'border-red-500/50' : 'border-[#c49028]/20'
                      }`}
                      placeholder={modalMode === 'edit' ? '••••••••' : 'Enter password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-3 bg-[#060d18] rounded-lg border border-[#c49028]/10">
                  <div>
                    <p className="text-sm font-medium text-white">Active Status</p>
                    <p className="text-xs text-gray-500">Allow this admin to log in</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                    className={`w-12 h-6 rounded-full transition-all ${
                      formData.is_active ? 'bg-[#c49028]' : 'bg-gray-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      formData.is_active ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-4 border-t border-[#c49028]/10">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-[#030810] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Create Admin' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c1a2e] border border-red-500/20 rounded-2xl w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white text-center mb-2">
                  Delete Admin Account?
                </h3>
                <p className="text-gray-400 text-center text-sm mb-6">
                  This action cannot be undone. The admin will permanently lose access to the system.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 bg-[#060d18] border border-[#c49028]/20 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
