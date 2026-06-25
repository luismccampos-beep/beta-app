'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function DestinationGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setCurrentIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  if (!images.length) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => { setCurrentIndex(i); setLightboxOpen(true); }}
            className="relative w-20 h-20 rounded-lg overflow-hidden hover:ring-2 hover:ring-teal-500 transition-all"
          >
            <img src={img} alt="" className="object-cover w-full h-full" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={prev}
              className="absolute left-4 p-2 text-white/80 hover:text-white z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt=""
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />

            <button
              type="button"
              onClick={next}
              className="absolute right-4 p-2 text-white/80 hover:text-white z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <div className="absolute bottom-4 text-white/60 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DestinationGallery;
