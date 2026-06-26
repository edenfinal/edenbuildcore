import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Layouts
import Layout from './components/Layout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import ClientsPage from './pages/ClientsPage';
import CertificationsPage from './pages/CertificationsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CRUDPage from './pages/admin/CRUDPage';
import SettingsPage from './pages/admin/SettingsPage';
import ContentEditorPage from './pages/admin/ContentEditorPage';
import HeroManagerPage from './pages/admin/HeroManagerPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Admin CRUD Pages Configuration
const adminPages = [
  {
    path: 'hero',
    title: 'Hero Slides',
    tableName: 'hero_slides',
    columns: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'background_image_url', label: 'Background Image', type: 'image' },
      { key: 'button_text', label: 'Button Text', type: 'text' },
      { key: 'button_link', label: 'Button Link', type: 'text' },
      { key: 'overlay_opacity', label: 'Overlay Opacity (0-1)', type: 'number' },
      { key: 'order_index', label: 'Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
    ],
    displayFields: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, overlay_opacity: 0.6, order_index: 0 },
  },
  {
    path: 'projects',
    title: 'Projects',
    tableName: 'projects',
    columns: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug (URL)', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['Commercial', 'Residential', 'Industrial', 'Infrastructure', 'Healthcare', 'Energy'] },
      { key: 'description', label: 'Short Description', type: 'textarea' },
      { key: 'detailed_description', label: 'Detailed Description', type: 'textarea' },
      { key: 'client_name', label: 'Client Name', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['planning', 'ongoing', 'completed'] },
      { key: 'thumbnail_url', label: 'Thumbnail URL', type: 'url' },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      { key: 'is_published', label: 'Published', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'thumbnail_url', label: 'Image' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'status', label: 'Status' },
      { key: 'featured', label: 'Featured' },
    ],
    defaultValues: { is_published: true, featured: false, status: 'ongoing', order_index: 0 },
  },
  {
    path: 'services',
    title: 'Services',
    tableName: 'services',
    columns: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'short_description', label: 'Short Description', type: 'textarea' },
      { key: 'detailed_description', label: 'Detailed Description', type: 'textarea' },
      { key: 'icon_name', label: 'Icon Name', type: 'text' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'title', label: 'Title' },
      { key: 'short_description', label: 'Description' },
      { key: 'is_featured', label: 'Featured' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, is_featured: false, order_index: 0 },
  },
  {
    path: 'clients',
    title: 'Clients',
    tableName: 'clients',
    columns: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'logo_url', label: 'Logo', type: 'image' },
      { key: 'website_url', label: 'Website URL', type: 'url' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'client_type', label: 'Client Type', type: 'select', options: ['government', 'private', 'corporate'] },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'logo_url', label: 'Logo' },
      { key: 'name', label: 'Name' },
      { key: 'client_type', label: 'Type' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, is_featured: false, client_type: 'private', order_index: 0 },
  },
  {
    path: 'testimonials',
    title: 'Testimonials',
    tableName: 'testimonials',
    columns: [
      { key: 'client_name', label: 'Client Name', type: 'text', required: true },
      { key: 'client_designation', label: 'Designation', type: 'text' },
      { key: 'client_company', label: 'Company', type: 'text' },
      { key: 'client_image_url', label: 'Client Image', type: 'image' },
      { key: 'content', label: 'Testimonial', type: 'textarea', required: true },
      { key: 'rating', label: 'Rating (1-5)', type: 'number' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'client_name', label: 'Name' },
      { key: 'client_company', label: 'Company' },
      { key: 'rating', label: 'Rating' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, is_featured: false, rating: 5, order_index: 0 },
  },
  {
    path: 'team',
    title: 'Team Members',
    tableName: 'team_members',
    columns: [
      { key: 'full_name', label: 'Full Name', type: 'text', required: true },
      { key: 'designation', label: 'Designation', type: 'text' },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'image_url', label: 'Image' },
      { key: 'full_name', label: 'Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, order_index: 0 },
  },
  {
    path: 'certifications',
    title: 'Certifications',
    tableName: 'certifications',
    columns: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'issuing_authority', label: 'Issuing Authority', type: 'text' },
      { key: 'certificate_number', label: 'Certificate Number', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'document_url', label: 'Document URL', type: 'url' },
      { key: 'category', label: 'Category', type: 'select', options: ['Quality', 'Environmental', 'Safety', 'Registration'] },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'issuing_authority', label: 'Authority' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, is_featured: false, order_index: 0 },
  },
  {
    path: 'gallery',
    title: 'Gallery',
    tableName: 'gallery_items',
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image_url', label: 'Image', type: 'image', required: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'project_id', label: 'Project ID (optional)', type: 'text' },
      { key: 'type', label: 'Type', type: 'select', options: ['image', 'video'] },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'image_url', label: 'Image' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, is_featured: false, type: 'image', order_index: 0 },
  },
  {
    path: 'blog',
    title: 'Blog Posts',
    tableName: 'blog_posts',
    columns: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'featured_image_url', label: 'Featured Image', type: 'image' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'is_published', label: 'Published', type: 'boolean' },
    ],
    displayFields: [
      { key: 'featured_image_url', label: 'Image' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'is_published', label: 'Published' },
    ],
    defaultValues: { is_published: false, is_featured: false },
  },
  {
    path: 'careers',
    title: 'Job Listings',
    tableName: 'jobs',
    columns: [
      { key: 'title', label: 'Job Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'employment_type', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Remote'] },
      { key: 'experience_level', label: 'Experience Level', type: 'text' },
      { key: 'salary_range', label: 'Salary Range', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'openings', label: 'Openings', type: 'number' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
    ],
    displayFields: [
      { key: 'title', label: 'Title' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, is_featured: false, openings: 1 },
  },
  {
    path: 'statistics',
    title: 'Statistics',
    tableName: 'statistics',
    columns: [
      { key: 'stat_key', label: 'Key', type: 'text', required: true },
      { key: 'stat_value', label: 'Value', type: 'text' },
      { key: 'stat_prefix', label: 'Prefix', type: 'text' },
      { key: 'stat_suffix', label: 'Suffix', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'stat_key', label: 'Key' },
      { key: 'stat_value', label: 'Value' },
      { key: 'description', label: 'Description' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, order_index: 0 },
  },
];

// Inquiries Page
const inquiriesColumns = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'subject', label: 'Subject', type: 'text' },
  { key: 'message', label: 'Message', type: 'textarea', required: true },
  { key: 'status', label: 'Status', type: 'select', options: ['new', 'read', 'responded', 'closed'] },
  { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'normal', 'high', 'urgent'] },
  { key: 'notes', label: 'Admin Notes', type: 'textarea' },
];
const inquiriesDisplayFields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Subject' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
];

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="careers" element={<CareersPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsOfServicePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="content" element={<ContentEditorPage />} />
        <Route path="heroes" element={<HeroManagerPage />} />
        <Route path="admins" element={<AdminUsersPage />} />
        <Route
          path="inquiries"
          element={
            <CRUDPage
              title="Inquiries"
              tableName="contact_inquiries"
              columns={inquiriesColumns}
              displayFields={inquiriesDisplayFields}
              defaultValues={{ status: 'new', priority: 'normal' }}
            />
          }
        />
        {adminPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={
              <CRUDPage
                title={page.title}
                tableName={page.tableName}
                columns={page.columns}
                displayFields={page.displayFields}
                defaultValues={page.defaultValues}
              />
            }
          />
        ))}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
