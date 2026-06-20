import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight, Clock, Search, FileText } from 'lucide-react';
import { useBlogPosts, useBlogCategories, usePageContent } from '../hooks/useData';
import type { BlogPost, BlogCategory } from '../lib/supabase';

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Sustainable Construction',
    slug: 'future-sustainable-construction',
    excerpt: 'Exploring green building practices and sustainable construction methods for a better tomorrow.',
    content: 'Full article content here...',
    category: 'Sustainability',
    featured_image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    author_id: null,
    is_featured: true,
    is_published: true,
    published_at: '2024-01-15',
    reading_time: 5,
    tags: ['sustainability', 'green building', 'environment'],
    view_count: 245,
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Modern Construction Technologies',
    slug: 'modern-construction-technologies',
    excerpt: 'How technology is transforming the construction industry with AI, drones, and smart materials.',
    content: 'Full article content here...',
    category: 'Technology',
    featured_image_url: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg',
    author_id: null,
    is_featured: false,
    is_published: true,
    published_at: '2024-01-10',
    reading_time: 7,
    tags: ['technology', 'innovation', 'AI'],
    view_count: 189,
    created_at: '2024-01-10',
    updated_at: '2024-01-10'
  },
  {
    id: '3',
    title: 'Best Practices in Project Management',
    slug: 'best-practices-project-management',
    excerpt: 'Essential project management strategies for successful construction projects.',
    content: 'Full article content here...',
    category: 'Management',
    featured_image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    author_id: null,
    is_featured: false,
    is_published: true,
    published_at: '2024-01-05',
    reading_time: 6,
    tags: ['management', 'projects', 'planning'],
    view_count: 156,
    created_at: '2024-01-05',
    updated_at: '2024-01-05'
  },
];

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const tags = post.tags as string[] || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group ${featured ? 'md:flex gap-8' : ''}`}
    >
      <Link to={`/blog/${post.slug || post.id}`} className={`block ${featured ? 'md:w-1/2' : ''}`}>
        <div className={`relative rounded-2xl overflow-hidden mb-4 ${featured ? 'aspect-[16/9]' : 'aspect-video'}`}>
          <img
            src={post.featured_image_url || 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-navy-950 text-xs font-semibold rounded-full">
            {post.category || 'Article'}
          </div>
        </div>
      </Link>

      <div className={featured ? 'md:w-1/2 md:flex md:flex-col md:justify-center' : ''}>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.reading_time || 5} min read
          </span>
        </div>

        <Link to={`/blog/${post.slug || post.id}`}>
          <h3 className={`font-heading font-semibold text-white mb-3 group-hover:text-gold-400 transition-colors ${featured ? 'text-3xl' : 'text-xl'}`}>
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-3 py-1 bg-navy-800/50 text-gray-400 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/blog/${post.slug || post.id}`}
          className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium text-sm transition-colors group/link"
        >
          Read More
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}

function PostDetail() {
  const { slug } = useParams();
  const { data: posts } = useBlogPosts();
  const pageContent = usePageContent('blog');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);

  const post = posts.find(p => p.slug === slug || p.id === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gold-500/50 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Article Not Found</h2>
          <Link to="/blog" className="text-gold-500 hover:text-gold-400">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const tags = post.tags as string[] || [];

  return (
    <div className="min-h-screen bg-navy-950 pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[300px]">
        <img
          src={post.featured_image_url || 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="px-3 py-1 bg-gold-500 text-navy-950 text-sm font-semibold rounded-full mb-4 inline-block">
                {post.category || 'Article'}
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold-500" />
                  {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-500" />
                  {post.reading_time || 5} min read
                </span>
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-500" />
                  Eden Buildcore
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-xl text-gray-300 leading-relaxed mb-8">{post.excerpt}</p>
            <div className="text-gray-400 leading-relaxed whitespace-pre-line">
              {post.content || 'Full article content coming soon...'}
            </div>
          </motion.div>

          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gold-500/10">
              <h4 className="text-white font-semibold mb-4">{c('blog.detail', 'tags_title', 'Tags')}</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-navy-800/50 text-gray-300 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function BlogPage() {
  const { slug } = useParams();
  const { data: posts } = useBlogPosts();
  const { data: categories } = useBlogCategories();
  const pageContent = usePageContent('blog');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // If slug exists, show post detail
  if (slug) {
    return <PostDetail />;
  }

  const displayPosts = posts.length > 0 ? posts : defaultPosts;
  const featuredPost = displayPosts.find(p => p.is_featured) || displayPosts[0];

  const filteredPosts = displayPosts
    .filter(p => p.id !== featuredPost?.id)
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

  const blogCategories = ['all', ...new Set(displayPosts.map(p => p.category).filter(Boolean))];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium tracking-wider uppercase mb-4 border border-gold-500/30">
              {c('blog.hero', 'badge', 'Our Blog')}
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              {c('blog.hero', 'title', 'News & Insights')}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {c('blog.hero', 'description', 'Stay updated with the latest trends, insights, and news from the construction industry.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-navy-900 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={c('blog.filters', 'search_placeholder', 'Search articles...')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-navy-800/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((cat) => (
                <button
                  key={cat as string}
                  onClick={() => setActiveCategory(cat as string)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-gold-500 text-navy-950'
                      : 'bg-navy-800/50 text-gray-400 hover:text-white border border-gold-500/20'
                  }`}
                >
                  {cat === 'all' ? c('blog.filters', 'all_text', 'All') : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-navy-950">
          <div className="max-w-7xl mx-auto px-6">
            <span className="text-gold-500 text-sm font-medium tracking-wider uppercase mb-6 block">
              {c('blog.detail', 'featured_label', 'Featured Article')}
            </span>
            <PostCard post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-16 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gold-500/50 mx-auto mb-4" />
              <p className="text-gray-400">{c('blog.empty', 'no_results', 'No articles found matching your criteria.')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
