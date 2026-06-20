import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Building2, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects, useProjectCategories, usePageContent } from '../hooks/useData';
import type { Project } from '../lib/supabase';

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link to={`/projects/${project.slug || project.id}`}>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
          <img
            src={project.thumbnail_url || 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-navy-950 text-xs font-semibold rounded-full">
            {project.category || 'Construction'}
          </div>

          {/* Status Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full ${
            project.status === 'completed' ? 'bg-green-500 text-white' :
            project.status === 'ongoing' ? 'bg-blue-500 text-white' :
            'bg-orange-500 text-white'
          }`}>
            {project.status}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center shadow-gold-lg">
              <ArrowRight className="w-6 h-6 text-navy-950" />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-heading font-semibold text-white group-hover:text-gold-400 transition-colors">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-2 px-1">
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gold-500" />
                {project.location}
              </span>
            )}
            {project.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gold-500" />
                {new Date(project.start_date).getFullYear()}
              </span>
            )}
          </div>
          {project.description && (
            <p className="text-gray-500 text-sm line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function ProjectDetail() {
  const { slug } = useParams();
  const { data: projects } = useProjects();
  const pageContent = usePageContent('projects');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  const project = projects.find(p => p.slug === slug || p.id === slug);
  const [currentImage, setCurrentImage] = useState(0);

  if (!project) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gold-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-white mb-2">{c('projects.detail', 'not_found', 'Project Not Found')}</h2>
          <Link to="/projects" className="text-gold-500 hover:text-gold-400">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const images = project.images && Array.isArray(project.images) ? project.images as string[] : [];

  return (
    <div className="min-h-screen bg-navy-950 pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={project.thumbnail_url || 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg'}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="px-3 py-1 bg-gold-500 text-navy-950 text-sm font-semibold rounded-full mb-4 inline-block">
                {project.category || 'Construction'}
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-gray-300">
                {project.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold-500" />
                    {project.location}
                  </span>
                )}
                {project.client_name && (
                  <span className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gold-500" />
                    Client: {project.client_name}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-white mb-4">{c('projects.detail', 'overview_title', 'Project Overview')}</h2>
                <p className="text-gray-400 leading-relaxed">
                  {project.detailed_description || project.description || 'No description available for this project.'}
                </p>
              </motion.div>

              {/* Gallery */}
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-heading font-bold text-white mb-6">{c('projects.detail', 'gallery_title', 'Project Gallery')}</h2>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                    <img
                      src={images[currentImage] || project.thumbnail_url || ''}
                      alt={`Image ${currentImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-900/80 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-950 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-900/80 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-950 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.slice(0, 4).map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                            currentImage === index ? 'border-gold-500' : 'border-transparent'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-6">{c('projects.detail', 'sidebar_title', 'Project Details')}</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Status', value: project.status },
                    { label: 'Category', value: project.category },
                    { label: 'Client', value: project.client_name },
                    { label: 'Location', value: project.location },
                    { label: 'Budget', value: project.budget },
                    { label: 'Start Date', value: project.start_date ? new Date(project.start_date).toLocaleDateString() : null },
                    { label: 'End Date', value: project.end_date ? new Date(project.end_date).toLocaleDateString() : null },
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <Link
                to="/contact"
                className="block text-center py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all"
              >
                {c('projects.detail', 'cta_button', 'Start Similar Project')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  const { slug } = useParams();
  const { data: projects } = useProjects();
  const { data: categories } = useProjectCategories();
  const pageContent = usePageContent('projects');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);
  const [filter, setFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // If slug exists, show project detail
  if (slug) {
    return <ProjectDetail />;
  }

  const displayProjects = projects.length > 0 ? projects : [
    { id: '1', title: 'Commercial Tower Complex', category: 'Commercial', status: 'completed', location: 'Karachi', description: 'A 25-story commercial tower with modern amenities.' },
    { id: '2', title: 'Highway Expansion Project', category: 'Infrastructure', status: 'ongoing', location: 'Lahore', description: 'Major highway expansion spanning 50 kilometers.' },
    { id: '3', title: 'Residential Township', category: 'Residential', status: 'ongoing', location: 'Islamabad', description: 'Premium residential community with 500 units.' },
    { id: '4', title: 'Industrial Complex', category: 'Industrial', status: 'completed', location: 'Faisalabad', description: 'Modern manufacturing facility with warehouse.' },
    { id: '5', title: 'Solar Power Plant', category: 'Energy', status: 'planning', location: 'Multan', description: '100MW solar power generation facility.' },
    { id: '6', title: 'Hospital Building', category: 'Healthcare', status: 'completed', location: 'Peshawar', description: '500-bed modern healthcare facility.' },
  ] as Project[];

  const filteredProjects = filter === 'all'
    ? displayProjects
    : displayProjects.filter(p => p.category === filter);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4 border border-gold-500/30">
              {c('projects.hero', 'badge', 'Our Portfolio')}
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              {c('projects.hero', 'title', 'Featured Projects')}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {c('projects.hero', 'description', 'Explore our portfolio of successfully completed construction and engineering projects across various sectors.')}
            </p>
          </motion.div>

          {/* Filter Toggle (Mobile) */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-navy-800 rounded-lg text-white"
            >
              <Filter className="w-5 h-5" />
              Filter by Category
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap justify-center gap-3 mb-12"
              >
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-gold-500 text-navy-950'
                      : 'bg-navy-800/50 text-gray-400 hover:text-white border border-gold-500/20'
                  }`}
                >
                  {c('projects.filters', 'all_text', 'All Projects')}
                </button>
                {['Commercial', 'Residential', 'Industrial', 'Infrastructure', 'Healthcare', 'Energy'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      filter === cat
                        ? 'bg-gold-500 text-navy-950'
                        : 'bg-navy-800/50 text-gray-400 hover:text-white border border-gold-500/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-gold-500/50 mx-auto mb-4" />
              <p className="text-gray-400">{c('projects.empty', 'no_results', 'No projects found in this category.')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
