import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image, Video, Play, Building2 } from 'lucide-react';
import { useGallery, usePageContent } from '../hooks/useData';
import type { GalleryItem } from '../lib/supabase';

export default function GalleryPage() {
  const { data: galleryItems } = useGallery();
  const pageContent = usePageContent('gallery');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const gallery = galleryItems;
  const categories = ['all', ...new Set(gallery.map(item => item.category).filter(Boolean))];

  const filteredGallery = filter === 'all'
    ? gallery
    : gallery.filter(item => item.category === filter);

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const navigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + filteredGallery.length) % filteredGallery.length
      : (currentIndex + 1) % filteredGallery.length;
    setCurrentIndex(newIndex);
    setSelectedItem(filteredGallery[newIndex]);
  };

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
              {c('gallery.hero', 'badge', 'Our Gallery')}
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              {c('gallery.hero', 'title', 'Project Gallery')}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {c('gallery.hero', 'description', 'Visual showcase of our completed projects, construction sites, and engineering achievements.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-navy-950 border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat as string}
                onClick={() => setFilter(cat as string)}
                className={`px-5 py-2 rounded-full capitalize font-medium transition-all ${
                  filter === cat
                    ? 'bg-gold-500 text-navy-950'
                    : 'bg-navy-800/50 text-gray-400 hover:text-white border border-gold-500/20'
                }`}
              >
                {cat === 'all' ? c('gallery.filters', 'all_text', 'All Projects') : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className={`group relative cursor-pointer ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                  onClick={() => openLightbox(item, index)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title || 'Gallery Image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gold-500/80 flex items-center justify-center">
                          <Play className="w-8 h-8 text-navy-950" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-gold-400 text-sm">{item.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredGallery.length === 0 && (
            <div className="text-center py-16">
              <Image className="w-16 h-16 text-gold-500/50 mx-auto mb-4" />
              <p className="text-gray-400">{c('gallery.empty', 'no_results', 'No images found in this category.')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-lg flex items-center justify-center"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-navy-800/80 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-950 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {filteredGallery.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-navy-800/80 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-950 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-navy-800/80 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-950 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-6xl max-h-[80vh] px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.image_url}
                alt={selectedItem.title || 'Gallery Image'}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-white text-lg">{selectedItem.title}</p>
                <p className="text-gold-400">{selectedItem.category}</p>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <span className="text-gray-400">
                {currentIndex + 1} / {filteredGallery.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
