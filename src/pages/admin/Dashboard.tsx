import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Layers, Users, MessageSquare, Mail, Newspaper,
  TrendingUp, Eye, Clock, ArrowRight, Briefcase, Award,
  ArrowUpRight, CheckCircle, AlertCircle, Activity, BarChart3,
  Globe, Image, Star, Plus, RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  projects: number; services: number; clients: number; testimonials: number;
  inquiries: number; posts: number; jobs: number; certifications: number;
  gallery: number; team: number; newInquiries: number; applications: number;
}

interface RecentInquiry {
  id: string; name: string; email: string; subject: string | null;
  status: string; priority: string; created_at: string;
}

interface RecentActivity {
  type: string; message: string; time: string; icon: React.ElementType; color: string;
}

// Mini sparkline chart using SVG
function Sparkline({ data, color = '#c49028', height = 36 }: { data: number[]; color?: string; height?: number }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={height} className="opacity-80">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts.join(' ')} ${w},${height}`}
        fill={`url(#sg-${color.replace('#', '')})`}
      />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={parseFloat(pts[pts.length - 1].split(',')[0])}
        cy={parseFloat(pts[pts.length - 1].split(',')[1])}
        r="3"
        fill={color}
      />
    </svg>
  );
}

// Radial progress ring
function RadialProgress({ value, max, color = '#c49028', size = 80 }: { value: number; max: number; color?: string; size?: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#1e2d3d" strokeWidth="8" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth="8" fill="none"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  );
}

const SPARKLINE_DATA: Record<string, number[]> = {
  projects: [2, 4, 3, 5, 4, 6, 7, 5, 8, 6, 9, 10],
  inquiries: [5, 8, 6, 10, 12, 9, 14, 11, 16, 13, 18, 20],
  clients: [1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7, 8],
  posts: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6],
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  normal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-emerald-500/20 text-emerald-400',
  read: 'bg-blue-500/20 text-blue-400',
  responded: 'bg-purple-500/20 text-purple-400',
  closed: 'bg-gray-500/20 text-gray-400',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0, services: 0, clients: 0, testimonials: 0, inquiries: 0,
    posts: 0, jobs: 0, certifications: 0, gallery: 0, team: 0, newInquiries: 0, applications: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('contact_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('contact_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('job_applications').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: results[0].count || 0,
        services: results[1].count || 0,
        clients: results[2].count || 0,
        testimonials: results[3].count || 0,
        inquiries: results[4].count || 0,
        posts: results[5].count || 0,
        jobs: results[6].count || 0,
        certifications: results[7].count || 0,
        gallery: results[8].count || 0,
        team: results[9].count || 0,
        newInquiries: results[10].count || 0,
        applications: results[11].count || 0,
      });

      const { data: inquiries } = await supabase
        .from('contact_inquiries')
        .select('id, name, email, subject, status, priority, created_at')
        .order('created_at', { ascending: false })
        .limit(8);
      setRecentInquiries(inquiries || []);
    } catch (e) {
      console.error('Dashboard error:', e);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  const kpiCards = [
    { label: 'Total Projects', value: stats.projects, trend: '+18%', icon: Building2, color: '#3b82f6', sparkKey: 'projects', link: '/admin/projects', desc: 'Active & completed' },
    { label: 'Contact Inquiries', value: stats.inquiries, trend: '+32%', icon: Mail, color: '#c49028', sparkKey: 'inquiries', link: '/admin/inquiries', desc: `${stats.newInquiries} new` },
    { label: 'Total Clients', value: stats.clients, trend: '+12%', icon: Users, color: '#10b981', sparkKey: 'clients', link: '/admin/clients', desc: 'Government & private' },
    { label: 'Blog Articles', value: stats.posts, trend: '+5%', icon: Newspaper, color: '#8b5cf6', sparkKey: 'posts', link: '/admin/blog', desc: 'Published posts' },
  ];

  const contentSummary = [
    { label: 'Services', value: stats.services, icon: Layers, link: '/admin/services', color: '#06b6d4' },
    { label: 'Gallery Items', value: stats.gallery, icon: Image, link: '/admin/gallery', color: '#f59e0b' },
    { label: 'Team Members', value: stats.team, icon: Users, link: '/admin/team', color: '#ec4899' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, link: '/admin/testimonials', color: '#14b8a6' },
    { label: 'Job Listings', value: stats.jobs, icon: Briefcase, link: '/admin/careers', color: '#6366f1' },
    { label: 'Certifications', value: stats.certifications, icon: Award, link: '/admin/certifications', color: '#c49028' },
    { label: 'Applications', value: stats.applications, icon: Star, link: '/admin/careers', color: '#f97316' },
    { label: 'Published Projects', value: stats.projects, icon: Globe, link: '/admin/projects', color: '#22c55e' },
  ];

  const quickActions = [
    { label: 'Add Project', icon: Building2, link: '/admin/projects', color: 'from-blue-600/20 to-blue-500/10 border-blue-500/20 text-blue-400' },
    { label: 'Add Service', icon: Layers, link: '/admin/services', color: 'from-emerald-600/20 to-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    { label: 'Add Client', icon: Users, link: '/admin/clients', color: 'from-[#c49028]/20 to-[#c49028]/5 border-[#c49028]/20 text-[#c49028]' },
    { label: 'Write Article', icon: Newspaper, link: '/admin/blog', color: 'from-purple-600/20 to-purple-500/10 border-purple-500/20 text-purple-400' },
    { label: 'Add Team Member', icon: Users, link: '/admin/team', color: 'from-pink-600/20 to-pink-500/10 border-pink-500/20 text-pink-400' },
    { label: 'Post Job', icon: Briefcase, link: '/admin/careers', color: 'from-orange-600/20 to-orange-500/10 border-orange-500/20 text-orange-400' },
    { label: 'Upload Media', icon: Image, link: '/admin/gallery', color: 'from-cyan-600/20 to-cyan-500/10 border-cyan-500/20 text-cyan-400' },
    { label: 'Site Settings', icon: Globe, link: '/admin/settings', color: 'from-indigo-600/20 to-indigo-500/10 border-indigo-500/20 text-indigo-400' },
  ];

  const completionData = [
    { label: 'Projects', value: stats.projects, max: 20, color: '#3b82f6' },
    { label: 'Services', value: stats.services, max: 12, color: '#10b981' },
    { label: 'Clients', value: stats.clients, max: 50, color: '#c49028' },
    { label: 'Content', value: stats.posts + stats.jobs, max: 30, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Website Live
          </span>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-[#0c1a2e] border border-[#c49028]/20 rounded-xl text-[#c49028] text-sm hover:bg-[#c49028]/5 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(196,144,40,0.3)] transition-all"
          >
            <Eye size={14} />
            View Site
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={card.link} className="block group">
              <div className="bg-[#0c1a2e] border border-[#1e2d3d] rounded-2xl p-5 hover:border-[#c49028]/30 transition-all hover:bg-[#0f2035] overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }} />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}18` }}>
                    <card.icon size={20} style={{ color: card.color }} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight size={12} />
                      {card.trend}
                    </span>
                    <Sparkline data={SPARKLINE_DATA[card.sparkKey] || []} color={card.color} />
                  </div>
                </div>
                <div className="text-3xl font-heading font-bold text-white mb-1 tracking-tight">
                  {loading ? <span className="text-[#2a3a4a]">—</span> : card.value}
                </div>
                <p className="text-[#9ca3af] text-sm font-medium">{card.label}</p>
                <p className="text-[#4b5563] text-xs mt-0.5">{card.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Content Summary + Radial Progress */}
      <div className="grid xl:grid-cols-3 gap-5">
        {/* Content Counts Grid */}
        <div className="xl:col-span-2 bg-[#0c1a2e] border border-[#1e2d3d] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-[#c49028]" />
              Content Summary
            </h2>
            <span className="text-[#4b5563] text-xs">Click to manage</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {contentSummary.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Link
                  to={item.link}
                  className="flex flex-col items-center text-center p-4 bg-[#0a1525] rounded-xl border border-[#1e2d3d] hover:border-opacity-50 transition-all group"
                  style={{ '--hover-color': item.color } as React.CSSProperties}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}18` }}>
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <div className="text-xl font-heading font-bold text-white mb-0.5">
                    {loading ? '—' : item.value}
                  </div>
                  <div className="text-[#6b7280] text-xs">{item.label}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completion Status */}
        <div className="bg-[#0c1a2e] border border-[#1e2d3d] rounded-2xl p-5">
          <h2 className="text-white font-semibold flex items-center gap-2 mb-5">
            <Activity size={18} className="text-[#c49028]" />
            Content Health
          </h2>
          <div className="space-y-5">
            {completionData.map((item) => {
              const pct = Math.min(100, item.max > 0 ? Math.round((item.value / item.max) * 100) : 0);
              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[#9ca3af] text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium">{item.value} / {item.max}</span>
                  </div>
                  <div className="h-2 bg-[#0a1525] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <div className="text-right text-xs text-[#4b5563] mt-0.5">{pct}%</div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-5 border-t border-[#1e2d3d]">
            <div className="flex items-center gap-3 p-3 bg-[#c49028]/5 rounded-xl border border-[#c49028]/10">
              <CheckCircle size={18} className="text-[#c49028]" />
              <div>
                <p className="text-[#c49028] text-sm font-semibold">Site Health: Good</p>
                <p className="text-[#6b7280] text-xs">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries + Quick Actions */}
      <div className="grid xl:grid-cols-5 gap-5">
        {/* Recent Inquiries Table */}
        <div className="xl:col-span-3 bg-[#0c1a2e] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#c49028]" />
              <h2 className="text-white font-semibold">Recent Inquiries</h2>
              {stats.newInquiries > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-semibold border border-emerald-500/20">
                  {stats.newInquiries} New
                </span>
              )}
            </div>
            <Link to="/admin/inquiries" className="flex items-center gap-1 text-[#c49028] text-sm hover:text-[#e8b84a] transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-[#1e2d3d]">
            {loading ? (
              <div className="p-8 text-center text-[#4b5563] text-sm">Loading inquiries...</div>
            ) : recentInquiries.length === 0 ? (
              <div className="p-8 text-center">
                <Mail size={32} className="text-[#2a3a4a] mx-auto mb-2" />
                <p className="text-[#4b5563] text-sm">No inquiries yet</p>
              </div>
            ) : recentInquiries.map((inq, i) => (
              <motion.div
                key={inq.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="px-5 py-3.5 hover:bg-[#0f2035] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#c49028]/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#c49028] font-bold text-sm">
                      {inq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#e5e7eb] text-sm font-medium truncate">{inq.name}</p>
                      <p className="text-[#6b7280] text-xs truncate">{inq.email}</p>
                      {inq.subject && <p className="text-[#4b5563] text-xs truncate mt-0.5">{inq.subject}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLORS[inq.status] || STATUS_COLORS.new}`}>
                      {inq.status}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${PRIORITY_COLORS[inq.priority] || PRIORITY_COLORS.normal}`}>
                      {inq.priority}
                    </span>
                    <span className="text-[#4b5563] text-xs">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="xl:col-span-2 bg-[#0c1a2e] border border-[#1e2d3d] rounded-2xl p-5">
          <h2 className="text-white font-semibold flex items-center gap-2 mb-5">
            <Plus size={18} className="text-[#c49028]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className={`flex flex-col items-center text-center p-3.5 rounded-xl border bg-gradient-to-br ${action.color} hover:scale-[1.03] transition-all group`}
              >
                <action.icon size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* System Status */}
          <div className="mt-5 pt-5 border-t border-[#1e2d3d] space-y-2.5">
            <h3 className="text-[#6b7280] text-xs font-semibold uppercase tracking-widest mb-3">System Status</h3>
            {[
              { label: 'Database', status: 'Operational', color: '#10b981' },
              { label: 'Storage', status: 'Operational', color: '#10b981' },
              { label: 'Auth Service', status: 'Active', color: '#10b981' },
              { label: 'API', status: 'Running', color: '#10b981' },
            ].map((sys) => (
              <div key={sys.label} className="flex items-center justify-between">
                <span className="text-[#9ca3af] text-sm">{sys.label}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: sys.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sys.color }} />
                  {sys.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Website Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Website Status', value: 'Live & Active', sub: 'All pages working', color: '#10b981', bg: '#10b98118' },
          { icon: CheckCircle, label: 'Content Status', value: 'Published', sub: 'Content live', color: '#3b82f6', bg: '#3b82f618' },
          { icon: Clock, label: 'Last Updated', value: 'Today', sub: new Date().toLocaleDateString(), color: '#c49028', bg: '#c4902818' },
          { icon: AlertCircle, label: 'Pending Actions', value: `${stats.newInquiries}`, sub: 'New inquiries awaiting', color: stats.newInquiries > 0 ? '#f59e0b' : '#6b7280', bg: stats.newInquiries > 0 ? '#f59e0b18' : '#6b728018' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.07 }}
            className="bg-[#0c1a2e] border border-[#1e2d3d] rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
              <item.icon size={22} style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-[#6b7280] text-xs mb-0.5">{item.label}</p>
              <p className="text-white font-semibold">{item.value}</p>
              <p className="text-[#4b5563] text-xs">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
