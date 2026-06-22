import { useState, ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Layers, Briefcase, Image, FileText, Users,
  Award, Settings, LogOut, Menu, X, ChevronRight, MessageSquare, BarChart3,
  Newspaper, Mail, Shield, Home, ExternalLink, Bell, Search, Moon, Sun,
  Activity, HardHat, UsersRound, FolderKanban, Megaphone, Check, CheckCheck,
  Trash2, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface Notification {
  id: string;
  type: 'inquiry' | 'application' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

const menuSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, badge: null },
      { name: 'Statistics', path: '/admin/statistics', icon: BarChart3, badge: null },
      { name: 'Inquiries', path: '/admin/inquiries', icon: Mail, badge: 'new' },
    ]
  },
  {
    title: 'Content Management',
    items: [
      { name: 'Hero Slides', path: '/admin/hero', icon: Image },
      { name: 'Projects', path: '/admin/projects', icon: Building2 },
      { name: 'Services', path: '/admin/services', icon: Layers },
      { name: 'Gallery', path: '/admin/gallery', icon: FolderKanban },
      { name: 'Blog Posts', path: '/admin/blog', icon: Newspaper },
      { name: 'Careers', path: '/admin/careers', icon: Briefcase },
    ]
  },
  {
    title: 'Company Profile',
    items: [
      { name: 'Team Members', path: '/admin/team', icon: UsersRound },
      { name: 'Clients', path: '/admin/clients', icon: Users },
      { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
      { name: 'Certifications', path: '/admin/certifications', icon: Award },
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Hero Manager', path: '/admin/heroes', icon: Image },
      { name: 'Content Editor', path: '/admin/content', icon: FileText },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Site Settings', path: '/admin/settings', icon: Settings },
    ]
  }
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Subscribe to new inquiries
  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'contact_inquiries'
      }, (payload) => {
        const inquiry = payload.new as any;
        const notification: Notification = {
          id: inquiry.id,
          type: 'inquiry',
          title: 'New Inquiry Received',
          message: `${inquiry.name} sent a message${inquiry.subject ? `: ${inquiry.subject}` : ''}`,
          read: false,
          created_at: inquiry.created_at,
          data: inquiry
        };
        setNotifications(prev => [notification, ...prev].slice(0, 20));
        setUnreadCount(prev => prev + 1);
        setNewInquiriesCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      // Get new inquiries count
      const { count: newCount } = await supabase
        .from('contact_inquiries')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new');

      setNewInquiriesCount(newCount || 0);

      // Get recent inquiries for notifications
      const { data: recentInquiries } = await supabase
        .from('contact_inquiries')
        .select('id, name, email, subject, message, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      const notifs: Notification[] = (recentInquiries || []).map((inq: any) => ({
        id: inq.id,
        type: 'inquiry' as const,
        title: 'New Inquiry',
        message: `${inq.name} sent a message${inq.subject ? `: ${inq.subject}` : ''}`,
        read: inq.status !== 'new',
        created_at: inq.created_at,
        data: inq
      }));

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Update inquiry status in database
    await supabase
      .from('contact_inquiries')
      .update({ status: 'read' })
      .eq('id', id);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    // Update all new inquiries in database
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      await supabase
        .from('contact_inquiries')
        .update({ status: 'read' })
        .in('id', unreadIds);
    }
    setNewInquiriesCount(0);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  };

  const filteredSections = searchQuery
    ? menuSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : menuSections;

  return (
    <div className="min-h-screen bg-[#020609]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-[#0c1a2e] to-[#060d18] border-r border-[#c49028]/10 pt-6 overflow-y-auto">
          {/* Logo Header */}
          <div className="px-6 mb-6">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c49028] to-[#a67820] flex items-center justify-center shadow-[0_4px_15px_rgba(196,144,40,0.3)]">
                  <Building2 className="w-5 h-5 text-[#030810]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0c1a2e]" />
              </div>
              <div>
                <h1 className="text-lg font-heading font-bold text-white tracking-tight">Eden Buildcore</h1>
                <p className="text-[10px] text-[#c49028] tracking-widest uppercase font-medium">Admin Portal</p>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="px-4 mb-4">
            <div className={`relative transition-all duration-300 ${searchFocused ? 'ring-1 ring-[#c49028]/50' : ''}`}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#030810]/60 border border-[#c49028]/10 rounded-xl text-sm text-white placeholder-[#606060] focus:outline-none focus:border-[#c49028]/30 transition-all"
              />
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 px-4 overflow-y-auto">
            {filteredSections.map((section, sIdx) => (
              <div key={section.title} className="mb-6">
                <h3 className="px-4 mb-2 text-[10px] font-bold text-[#606060] uppercase tracking-widest">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path ||
                      (item.path !== '/admin' && location.pathname.startsWith(item.path));

                    // Show badge count for inquiries
                    let badgeCount = 0;
                    if (item.badge === 'new' && item.path === '/admin/inquiries') {
                      badgeCount = newInquiriesCount;
                    }

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                          isActive
                            ? 'bg-[#c49028]/10 text-[#c49028]'
                            : 'text-[#909090] hover:text-white hover:bg-[#0c1a2e]/80'
                        }`}
                      >
                        <item.icon className={`w-[18px] h-[18px] transition-colors ${
                          isActive ? 'text-[#c49028]' : 'text-[#606060] group-hover:text-[#c49028]'
                        }`} />
                        <span className="font-medium text-sm">{item.name}</span>
                        {badgeCount > 0 && (
                          <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center">
                            {badgeCount}
                          </span>
                        )}
                        {item.badge === 'new' && badgeCount === 0 && (
                          <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-[#c49028] text-[#030810] rounded">
                            NEW
                          </span>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#c49028] rounded-r-full"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="px-4 mb-4">
            <div className="bg-[#030810]/60 border border-[#c49028]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-[#c49028]" />
                <span className="text-xs font-bold text-[#a0a0a0] uppercase tracking-wider">System Health</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-lg font-bold text-white">99.9%</p>
                  <p className="text-[10px] text-[#606060]">Uptime</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-400">Active</p>
                  <p className="text-[10px] text-[#606060]">Database</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-[#c49028]/10">
            <div className="flex items-center gap-3 px-3 py-3 bg-[#030810]/60 border border-[#c49028]/10 rounded-xl">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c49028]/20 to-[#c49028]/5 flex items-center justify-center text-[#c49028] font-bold text-sm border border-[#c49028]/20">
                  {admin?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0c1a2e]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{admin?.full_name || 'Administrator'}</p>
                <p className="text-[#606060] text-xs truncate capitalize">{admin?.role || 'Super Admin'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-[#606060] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#020609]/90 backdrop-blur-lg lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-[#0c1a2e] to-[#060d18] lg:hidden overflow-y-auto"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#c49028]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c49028] to-[#a67820] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#030810]" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white font-heading">Eden Buildcore</span>
                    <p className="text-[10px] text-[#c49028] tracking-widest">ADMIN</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-[#909090] hover:text-white rounded-lg hover:bg-[#0c1a2e] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="p-4">
                {menuSections.map((section) => (
                  <div key={section.title} className="mb-6">
                    <h3 className="px-4 mb-2 text-[10px] font-bold text-[#606060] uppercase tracking-widest">
                      {section.title}
                    </h3>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = location.pathname === item.path ||
                          (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        let badgeCount = 0;
                        if (item.badge === 'new' && item.path === '/admin/inquiries') {
                          badgeCount = newInquiriesCount;
                        }
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                              isActive
                                ? 'bg-[#c49028]/10 text-[#c49028]'
                                : 'text-[#909090] hover:text-white hover:bg-[#0c1a2e]/80'
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                            {badgeCount > 0 && (
                              <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                {badgeCount}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Mobile User */}
              <div className="p-4 border-t border-[#c49028]/10">
                <div className="flex items-center gap-3 px-3 py-3 bg-[#030810]/60 border border-[#c49028]/10 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#c49028]/20 flex items-center justify-center text-[#c49028] font-bold">
                    {admin?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{admin?.full_name || 'Administrator'}</p>
                    <p className="text-[#606060] text-xs">{admin?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 mt-2 text-[#909090] hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#020609]/95 backdrop-blur-xl border-b border-[#c49028]/10">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 text-[#909090] hover:text-white bg-[#0c1a2e] rounded-xl border border-[#c49028]/10 hover:border-[#c49028]/30 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumbs */}
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span className="text-[#c49028]">Admin</span>
                <ChevronRight className="w-4 h-4 text-[#404040]" />
                <span className="text-[#909090]">
                  {menuSections.flatMap(s => s.items).find(i => i.path === location.pathname)?.name || 'Dashboard'}
                </span>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  to="/"
                  target="_blank"
                  className="hidden sm:flex items-center gap-2 text-sm text-[#909090] hover:text-[#c49028] transition-colors group"
                >
                  <Home className="w-4 h-4" />
                  <span>View Website</span>
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </Link>

                <div className="hidden sm:block w-px h-5 bg-[#c49028]/10" />

                {/* Date */}
                <div className="hidden md:flex items-center gap-2 text-sm text-[#606060]">
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-[#909090] hover:text-[#c49028] hover:bg-[#c49028]/10 rounded-xl transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {notificationsOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setNotificationsOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0c1a2e] border border-[#c49028]/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between px-4 py-3 border-b border-[#c49028]/10 bg-[#030810]/50">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-[#c49028]" />
                              <span className="text-white font-semibold text-sm">Notifications</span>
                              {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-[#909090] hover:text-[#c49028] text-xs transition-colors"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                              </button>
                            )}
                          </div>

                          {/* Notifications List */}
                          <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="p-8 text-center">
                                <Bell className="w-10 h-10 text-[#2a3a4a] mx-auto mb-2" />
                                <p className="text-[#606060] text-sm">No notifications yet</p>
                              </div>
                            ) : (
                              notifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  className={`relative px-4 py-3 border-b border-[#1e2d3d] hover:bg-[#0f2035] transition-colors ${
                                    !notif.read ? 'bg-[#c49028]/5' : ''
                                  }`}
                                >
                                  {/* Unread indicator */}
                                  {!notif.read && (
                                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#c49028]" />
                                  )}

                                  <div className="flex items-start gap-3 ml-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      notif.type === 'inquiry' ? 'bg-[#c49028]/10 text-[#c49028]' : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                      {notif.type === 'inquiry' ? <Mail className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-sm font-medium truncate">{notif.title}</p>
                                      <p className="text-[#909090] text-xs truncate">{notif.message}</p>
                                      <p className="text-[#606060] text-xs mt-1">{formatTimeAgo(notif.created_at)}</p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {!notif.read && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notif.id);
                                          }}
                                          className="p-1.5 text-[#909090] hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all"
                                          title="Mark as read"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notif.id);
                                        }}
                                        className="p-1.5 text-[#909090] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        title="Remove"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Footer */}
                          {notifications.length > 0 && (
                            <div className="px-4 py-2 border-t border-[#1e2d3d] bg-[#030810]/50">
                              <Link
                                to="/admin/inquiries"
                                onClick={() => setNotificationsOpen(false)}
                                className="flex items-center justify-center gap-2 text-[#c49028] text-xs font-medium hover:text-[#e8b84a] transition-colors"
                              >
                                View All Inquiries
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
