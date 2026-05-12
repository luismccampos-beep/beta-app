import * as React from "react"

import { cn } from "../utils/cn"

export interface GalleryItem {
  id: string;
  url: string;
  title?: string;
  type?: "image" | "video";
  thumbnail?: string;
  alt?: string;
  description?: string;
}

export interface ImmersiveGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: GalleryItem[];
  images?: { src: string; alt?: string; id?: string; title?: string; url?: string; type?: "image" | "video" }[];
  isOpen?: boolean;
  open?: boolean; // alternate naming
  onClose?: () => void;
  initialIndex?: number;
  aspectRatio?: "aspect-video" | "aspect-square" | "aspect-[4/3]";
  showControls?: boolean;
  showThumbnails?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
}

const ImmersiveGallery = React.forwardRef<HTMLDivElement, ImmersiveGalleryProps>(
  ({ 
    items = [], 
    images = [], 
    isOpen, 
    open, 
    onClose, 
    initialIndex = 0, 
    aspectRatio = "aspect-video", 
    showControls: _showControls = true,
    showThumbnails: _showThumbnails = true,
    allowDownload: _allowDownload = false,
    allowShare: _allowShare = false,
    className, 
    ...props 
  }, ref) => {
    const isModalOpen = Boolean(isOpen ?? open);

    // Normalize incoming data
    const normalized = React.useMemo(() => {
      if (items.length > 0) {
        return items.map((it) => ({
          src: it.url || it.thumbnail || "",
          alt: it.alt || it.title || "",
          id: it.id,
          title: it.title,
          type: it.type,
          description: it.description,
        }));
      }
      return images.map((img) => ({
        ...img,
        src: img.src || img.url || "",
        alt: img.alt || img.title || "",
        description: (img as { description?: string }).description || "",
      }));
    }, [items, images]);

    if (!isModalOpen) return null;

    const safeIndex = Math.max(0, Math.min(initialIndex, normalized.length - 1));
    // eslint-disable-next-line security/detect-object-injection
    const currentItem = normalized[safeIndex];

    return (
      <div
        ref={ref}
        className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6", className)}
        aria-modal="true"
        role="dialog"
        {...props}
      >
        <div className="absolute top-4 right-4">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md bg-white/90 text-gray-900 text-sm shadow hover:bg-white"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div className="relative max-w-6xl w-full flex flex-col items-center">
          {currentItem && (
            <div className={cn("w-full overflow-hidden rounded-lg", aspectRatio)}>
              {currentItem.type === "video" ? (
                <video
                  src={currentItem.src}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={currentItem.src}
                  alt={currentItem.alt}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}

          <div className="text-white text-center mt-4">
            {currentItem?.title && <h3 className="text-lg font-semibold">{currentItem.title}</h3>}
            {currentItem?.description && (
              <p className="text-sm text-gray-300 mt-1">{currentItem.description}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)
ImmersiveGallery.displayName = "ImmersiveGallery"

export { ImmersiveGallery }
