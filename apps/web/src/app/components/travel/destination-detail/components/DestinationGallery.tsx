'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DESTINATION_PLACEHOLDER } from '../../../travel/destination-image-fallback';

export function DestinationGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const safeSrc = useCallback((url: string) => {
    if (failedImages.has(url)) return DESTINATION_PLACEHOLDER;
    return url;
  }, [failedImages]);

  const handleImageError = useCallback((url: string) => {
    if (url === DESTINATION_PLACEHOLDER) return;
    setFailedImages((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  const prev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setCurrentIndex((i) => (i + 1) % images.length),
    [images.length],
  );
  const close = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    closeButtonRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, prev, next, close]);

  if (!images.length) return null;

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-4xl font-black text-gray-950 dark:text-white uppercase tracking-tighter flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-primary-300">
            <Camera className="h-6 w-6" />
          </div>
          {title}
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {images.map((url, i) => (
            <motion.button
              key={url}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentIndex(i);
                setLightboxOpen(true);
              }}
              aria-label={`${title} ${i + 1} of ${images.length}`}
              className="relative shrink-0 w-64 aspect-[16/10] rounded-2xl overflow-hidden snap-start cursor-pointer border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={safeSrc(url)}
                alt={`${title} ${i + 1}`}
                fill
                sizes="160px"
                className="object-cover"
                unoptimized
                onError={() => handleImageError(url)}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            ref={(ref) => {
              if (ref) {
                ref.setAttribute('role', 'dialog');
                ref.setAttribute('aria-modal', 'true');
                ref.setAttribute('aria-label', `${title} - image ${currentIndex + 1} of ${images.length}`);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close gallery"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={close}
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              src={safeSrc(images[currentIndex])}
              alt={`${title} ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onError={() => handleImageError(images[currentIndex])}
            />
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
