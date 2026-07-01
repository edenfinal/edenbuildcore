import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Layouts
import Layout from './components/Layout';

// Public Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const CertificationsPage = lazy(() => import('./pages/CertificationsPage'));
const OurTeamPage = lazy(() => import('./pages/OurTeamPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const CRUDPage = lazy(() => import('./pages/admin/CRUDPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const ContentEditorPage = lazy(() => import('./pages/admin/ContentEditorPage'));
const HeroManagerPage = lazy(() => import('./pages/admin/HeroManagerPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

// Protected Route Component
function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: AdminRole[];
}) {
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

  if (roles && !roles.includes(admin.role as AdminRole)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

// Admin CRUD Pages Configuration
const adminPages = [
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
      { key: 'thumbnail_url', label: 'Thumbnail Image', type: 'image' },
      { key: 'images', label: 'Additional Images (Gallery)', type: 'multi-image' },
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
      { key: 'client_type', label: 'Client Type', type: 'select', options: ['government', 'private', 'corporate', 'ngo'] },
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
      { key: 'twitter_url', label: 'Twitter/X URL', type: 'url' },
      { key: 'is_featured', label: 'Featured (Leadership)', type: 'boolean' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'order_index', label: 'Order', type: 'number' },
    ],
    displayFields: [
      { key: 'image_url', label: 'Image' },
      { key: 'full_name', label: 'Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'department', label: 'Department' },
      { key: 'is_featured', label: 'Featured' },
      { key: 'is_active', label: 'Active' },
    ],
    defaultValues: { is_active: true, is_featured: false, order_index: 0 },
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
      { key: 'images_bulk', label: 'Bulk Upload Images', type: 'bulk-gallery' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'project_id', label: 'Link to Project', type: 'project-select' },
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

function lazyElement(Component: ComponentType) {
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={lazyElement(HomePage)} />
        <Route path="about" element={lazyElement(AboutPage)} />
        <Route path="our-team" element={lazyElement(OurTeamPage)} />
        <Route path="projects" element={lazyElement(ProjectsPage)} />
        <Route path="projects/:slug" element={lazyElement(ProjectsPage)} />
        <Route path="services" element={lazyElement(ServicesPage)} />
        <Route path="gallery" element={lazyElement(GalleryPage)} />
        <Route path="contact" element={lazyElement(ContactPage)} />
        <Route path="careers" element={lazyElement(CareersPage)} />
        <Route path="blog" element={lazyElement(BlogPage)} />
        <Route path="blog/:slug" element={lazyElement(BlogPage)} />
        <Route path="clients" element={lazyElement(ClientsPage)} />
        <Route path="certifications" element={lazyElement(CertificationsPage)} />
        <Route path="certifications/:id" element={lazyElement(CertificationsPage)} />
        <Route path="privacy" element={lazyElement(PrivacyPolicyPage)} />
        <Route path="terms" element={lazyElement(TermsOfServicePage)} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={lazyElement(AdminLogin)} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={null}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={lazyElement(Dashboard)} />
        <Route
          path="settings"
          element={<ProtectedRoute roles={['super_admin', 'admin']}>{lazyElement(SettingsPage)}</ProtectedRoute>}
        />
        <Route
          path="content"
          element={<ProtectedRoute roles={['super_admin', 'admin', 'editor']}>{lazyElement(ContentEditorPage)}</ProtectedRoute>}
        />
        <Route
          path="heroes"
          element={<ProtectedRoute roles={['super_admin', 'admin', 'editor']}>{lazyElement(HeroManagerPage)}</ProtectedRoute>}
        />
        <Route
          path="admins"
          element={<ProtectedRoute roles={['super_admin']}>{lazyElement(AdminUsersPage)}</ProtectedRoute>}
        />
        <Route
          path="inquiries"
          element={
            <Suspense fallback={null}>
              <CRUDPage
                title="Inquiries"
                tableName="contact_inquiries"
                columns={inquiriesColumns}
                displayFields={inquiriesDisplayFields}
                defaultValues={{ status: 'new', priority: 'normal' }}
              />
            </Suspense>
          }
        />
        {adminPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={
              <Suspense fallback={null}>
                <CRUDPage
                  title={page.title}
                  tableName={page.tableName}
                  columns={page.columns}
                  displayFields={page.displayFields}
                  defaultValues={page.defaultValues}
                />
              </Suspense>
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
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
