import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image, Play, ZoomIn, Filter } from 'lucide-react';
import { useGallery, useProjects, usePageContent } from '../hooks/useData';
import PageHero from '../components/PageHero';
import type { GalleryItem } from '../lib/supabase';

export default function GalleryPage() {
  const { data: galleryItems } = useGallery();
  const { data: projects } = useProjects();
  const pageContent = usePageContent('gallery');
  const c = (section: string, key: string, fallback: string) => pageContent.get(section, key, fallback);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const gallery = galleryItems.filter(item => item.is_active !== false);
  const categories = ['all', ...new Set(gallery.map(item => item.category).filter(Boolean))];

  const filtered = gallery.filter(item => filter === 'all' || item.category === filter);

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };
  const navigateLightbox = (dir: 'prev' | 'next') => {
    const newIdx = dir === 'prev'
      ? (currentIndex - 1 + filtered.length) % filtered.length
      : (currentIndex + 1) % filtered.length;
    setCurrentIndex(newIdx);
    setSelectedItem(filtered[newIdx]);
  };

  // Masonry-style column distribution
  const cols = 3;
  const columns: GalleryItem[][] = Array.from({ length: cols }, () => []);
  filtered.forEach((item, i) => columns[i % cols].push(item));

  return (
    <>
      <PageHero pageId="gallery" />

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="py-8 bg-[#030810] border-b border-[#c49028]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat as string}
                  onClick={() => setFilter(cat as string)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    filter === cat
                      ? 'bg-gradient-to-r from-[#a67820] to-[#c49028] text-[#030810] shadow-[0_0_15px_rgba(196,144,40,0.3)]'
                      : 'bg-[#0c1a2e] text-gray-400 border border-[#c49028]/15 hover:border-[#c49028]/30 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? (
                    <><Filter className="w-3.5 h-3.5" /> All</>
                  ) : cat as string}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Masonry Grid */}
      <section className="py-12 bg-[#030810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-[#c49028]/30 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-white mb-2">No Images Yet</h3>
              <p className="text-gray-500">Gallery images will appear here once added from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-4">
                  {col.map((item, ii) => {
                    const globalIdx = filtered.indexOf(item);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ii * 0.07 }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#0c1a2e] border border-[#c49028]/10 hover:border-[#c49028]/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(196,144,40,0.08)]"
                        onClick={() => openLightbox(item, globalIdx)}
                      >
                        {/* Vary aspect ratio for visual interest */}
                        <div className={`relative overflow-hidden ${(ci + ii) % 3 === 0 ? 'aspect-square' : (ci + ii) % 3 === 1 ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
                          <img
                            src={item.image_url}
                            alt={item.title || 'Gallery Image'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#030810]/90 via-[#030810]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Video indicator */}
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-[#c49028]/90 flex items-center justify-center">
                                <Play className="w-6 h-6 text-[#030810]" fill="currentColor" />
                              </div>
                            </div>
                          )}

                          {/* Hover content */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            {item.title && (
                              <p className="text-white font-semibold text-sm leading-tight">{item.title}</p>
                            )}
                            {item.category && (
                              <p className="text-[#c49028] text-xs mt-1">{item.category}</p>
                            )}
                          </div>

                          {/* Zoom icon */}
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#030810]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="w-4 h-4 text-white" />
                          </div>

                          {/* Featured badge */}
                          {item.is_featured && (
                            <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#c49028] text-[#030810] text-[10px] font-bold rounded-full uppercase">
                              Featured
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
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
            className="fixed inset-0 z-50 bg-[#030810]/95 backdrop-blur-lg flex items-center justify-center"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0c1a2e]/80 flex items-center justify-center text-white hover:bg-[#c49028] hover:text-[#030810] transition-colors z-10 border border-[#c49028]/20"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Nav */}
            {filtered.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0c1a2e]/80 flex items-center justify-center text-white hover:bg-[#c49028] hover:text-[#030810] transition-colors border border-[#c49028]/20"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0c1a2e]/80 flex items-center justify-center text-white hover:bg-[#c49028] hover:text-[#030810] transition-colors border border-[#c49028]/20"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl w-full px-16 sm:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.image_url}
                alt={selectedItem.title || 'Gallery Image'}
                className="max-w-full max-h-[80vh] object-contain rounded-xl mx-auto shadow-2xl"
              />
              {(selectedItem.title || selectedItem.category) && (
                <div className="text-center mt-5 space-y-1">
                  {selectedItem.title && <p className="text-white text-lg font-semibold">{selectedItem.title}</p>}
                  {selectedItem.category && <p className="text-[#c49028] text-sm">{selectedItem.category}</p>}
                  {selectedItem.description && <p className="text-gray-400 text-sm max-w-xl mx-auto">{selectedItem.description}</p>}
                </div>
              )}
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#0c1a2e]/80 rounded-full border border-[#c49028]/20">
              <span className="text-gray-300 text-sm tabular-nums">{currentIndex + 1} / {filtered.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
