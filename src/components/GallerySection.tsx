import React, { useState } from 'react';
import { ZoomIn, Eye } from 'lucide-react';
import { GalleryImage, SystemSettings } from '../types.js';

interface GallerySectionProps {
  gallery: GalleryImage[];
  settings?: SystemSettings;
}

export default function GallerySection({ gallery, settings }: GallerySectionProps) {
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'performance' | 'behind_scenes' | 'portrait'>('all');
  const [zoomedImage, setZoomedImage] = useState<GalleryImage | null>(null);

  // Filter gallery photo categories
  const filteredGallery = gallery.filter(img => {
    if (galleryCategory === 'all') return true;
    return img.category === galleryCategory;
  });

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 text-white relative z-10">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-bold block mb-2">
          {settings?.gallerySectionSubtitle || "Stage Graphics"}
        </span>
        <h2 className="text-3xl md:text-5xl font-black">
          {settings?.gallerySectionTitle || "Visual Symphony"}
        </h2>
        <div className="w-16 h-[1.5px] bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] mx-auto mt-4" />
      </div>

      {/* Filter tags */}
      <div className="flex flex-wrap gap-2 justify-center text-xs font-mono">
        {(['all', 'performance', 'behind_scenes', 'portrait'] as const).map(cat => (
          <button
            key={cat}
            id={`gallery-cat-${cat}`}
            onClick={() => setGalleryCategory(cat)}
            className={`px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
              galleryCategory === cat 
                ? 'border-[#D4AF37] text-[#D4AF37] bg-amber-500/5' 
                : 'border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {cat.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Masonry Layout grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map(img => (
          <div
            key={img.id}
            id={`gallery-item-${img.id}`}
            onClick={() => setZoomedImage(img)}
            className="group bg-[#181524]/40 border border-[#8A2BE2]/15 rounded-2xl overflow-hidden cursor-pointer relative shadow-lg hover:border-[#D4AF37]/30 transition-all aspect-[4/3]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-10 transition-opacity" />
            <img
              src={img.url}
              alt={img.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            
            <div className="absolute bottom-4 left-4 z-20 right-4 flex items-center justify-between pointer-events-none">
              <div>
                <span className="text-[9px] text-[#D4AF37] uppercase font-mono tracking-widest">{img.category.replace('_', ' ')}</span>
                <h4 className="text-sm font-semibold text-white tracking-tight truncate max-w-[200px]">{img.title}</h4>
              </div>
              <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-[#D4AF37] group-hover:scale-110 transition-transform">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GALLERY DETAIL OVERLAY VIEW WINDOW */}
      {zoomedImage && (
        <div 
          id="gallery-zoom-modal"
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer animate-in fade-in"
        >
          <div className="max-w-3xl w-full text-center space-y-4">
            <img
              src={zoomedImage.url}
              alt={zoomedImage.title}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto mx-auto rounded-xl border border-white/15 object-contain"
            />
            <div className="text-xs font-mono">
              <span className="text-[#D4AF37] uppercase block text-[10px]">{zoomedImage.category.replace('_', ' ')}</span>
              <span className="text-zinc-200 text-sm font-bold block mt-1">{zoomedImage.title}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
