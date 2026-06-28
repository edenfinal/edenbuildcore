import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight, Clock, Search, FileText } from 'lucide-react';
import { useBlogPosts, useBlogCategories, usePageContent } from '../hooks/useData';
import PageHero from '../components/PageHero';
import type { BlogPost } from '../lib/supabase';

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
        <div className={`relative rounded-2xl overflow-hidden mb-4 bg-navy-800/50 ${featured ? 'aspect-[16/9]' : 'aspect-video'}`}>
          {post.featured_image_url ? (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-gold-500/20" />
            </div>
          )}
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
  const { data: allPosts } = useBlogPosts();
  const pageContent = usePageContent('blog');
  const c = (section: string, key: string, fallback = '') => pageContent.get(section, key, fallback);

  const posts = allPosts.filter(p => p.is_published);
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
    <div className="min-h-screen bg-navy-950">
      {/* Hero image fills full width, starts at top behind navbar */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        {post.featured_image_url ? (
          <img src={post.featured_image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-950 flex items-center justify-center">
            <FileText className="w-24 h-24 text-gold-500/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-navy-950/20" />
        <div className="absolute inset-x-0 bottom-0 p-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <span className="px-3 py-1 bg-gold-500 text-navy-950 text-sm font-semibold rounded-full mb-4 inline-block">
                {post.category || 'Article'}
              </span>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                {post.published_at && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gold-500" />
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-500" />
                  {post.reading_time || 5} min read
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {post.excerpt && (
              <p className="text-xl text-gray-300 leading-relaxed mb-10 pb-10 border-b border-gold-500/10">{post.excerpt}</p>
            )}
            <div className="prose-content text-gray-300 leading-relaxed space-y-4">
              {(post.content || '').split(/\n\n+/).map((para, i) => {
                const trimmed = para.trim();
                if (!trimmed) return null;
                // Heading lines starting with #
                if (trimmed.startsWith('### ')) return <h3 key={i} className="text-xl font-heading font-bold text-white mt-8 mb-3">{trimmed.slice(4)}</h3>;
                if (trimmed.startsWith('## ')) return <h2 key={i} className="text-2xl font-heading font-bold text-white mt-10 mb-4">{trimmed.slice(3)}</h2>;
                if (trimmed.startsWith('# ')) return <h1 key={i} className="text-3xl font-heading font-bold text-white mt-10 mb-4">{trimmed.slice(2)}</h1>;
                // Bullet lists
                const lines = trimmed.split('\n');
                const isList = lines.every(l => l.startsWith('- ') || l.startsWith('* ') || l.startsWith('• ') || /^\d+\.\s/.test(l));
                if (isList) {
                  return (
                    <ul key={i} className="list-disc list-inside space-y-1 pl-2">
                      {lines.map((l, j) => <li key={j} className="text-gray-300">{l.replace(/^[-*•]\s|^\d+\.\s/, '')}</li>)}
                    </ul>
                  );
                }
                // Normal paragraph — handle inline line breaks
                return <p key={i} className="text-gray-300">{lines.map((l, j) => j === 0 ? l : [<br key={j} />, l])}</p>;
              })}
              {!post.content && <p className="text-gray-500 italic">Full article content coming soon...</p>}
            </div>
          </motion.div>

          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gold-500/10">
              <h4 className="text-white font-semibold mb-4">{c('filters', 'tags_title', 'Tags')}</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-navy-800/50 text-gray-300 rounded-full text-sm">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium transition-colors">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BlogPage() {
  const { slug } = useParams();
  const { data: allPosts } = useBlogPosts();
  const pageContent = usePageContent('blog');
  const c = (section: string, key: string, fallback = '') => pageContent.get(section, key, fallback);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  if (slug) return <PostDetail />;

  // Only show published posts — no hardcoded fallback data
  const posts = allPosts.filter(p => p.is_published);
  const featuredPost = posts.find(p => p.is_featured) || posts[0] || null;

  const filteredPosts = posts
    .filter(p => p.id !== featuredPost?.id)
    .filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

  const blogCategories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean) as string[])];

  return (
    <>
      <PageHero pageId="blog" />

      {/* Search & Filter */}
      <section className="py-8 bg-navy-900 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={c('filters', 'search_placeholder', 'Search articles...')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-navy-800/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-gold-500 text-navy-950'
                      : 'bg-navy-800/50 text-gray-400 hover:text-white border border-gold-500/20'
                  }`}
                >
                  {cat === 'all' ? c('filters', 'all_text', 'All') : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* No posts state */}
      {posts.length === 0 && (
        <section className="py-32 bg-navy-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FileText className="w-20 h-20 text-gold-500/20 mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold text-white mb-3">No Articles Yet</h2>
            <p className="text-gray-400">Blog posts added from the admin panel will appear here.</p>
          </div>
        </section>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-navy-950">
          <div className="max-w-7xl mx-auto px-6">
            <span className="text-gold-500 text-sm font-medium tracking-wider uppercase mb-6 block">
              {c('detail', 'featured_label', 'Featured Article')}
            </span>
            <PostCard post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 0 && (
        <section className="py-16 bg-navy-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {filteredPosts.length === 0 && searchQuery && (
              <div className="text-center py-16">
                <p className="text-gray-400">{c('empty', 'no_results', 'No articles found.')}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
