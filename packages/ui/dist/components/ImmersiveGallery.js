import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
const ImmersiveGallery = React.forwardRef(({ items = [], images = [], isOpen, open, onClose, initialIndex = 0, aspectRatio = "aspect-video", showControls: _showControls = true, showThumbnails: _showThumbnails = true, allowDownload: _allowDownload = false, allowShare: _allowShare = false, className, ...props }, ref) => {
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
            description: img.description || "",
        }));
    }, [items, images]);
    if (!isModalOpen)
        return null;
    const safeIndex = Math.max(0, Math.min(initialIndex, normalized.length - 1));
    // eslint-disable-next-line security/detect-object-injection
    const currentItem = normalized[safeIndex];
    return (_jsxs("div", { ref: ref, className: cn("fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6", className), "aria-modal": "true", role: "dialog", ...props, children: [_jsx("div", { className: "absolute top-4 right-4", children: _jsx("button", { type: "button", className: "px-3 py-1.5 rounded-md bg-white/90 text-gray-900 text-sm shadow hover:bg-white", onClick: onClose, children: "Fechar" }) }), _jsxs("div", { className: "relative max-w-6xl w-full flex flex-col items-center", children: [currentItem && (_jsx("div", { className: cn("w-full overflow-hidden rounded-lg", aspectRatio), children: currentItem.type === "video" ? (_jsx("video", { src: currentItem.src, controls: true, className: "w-full h-full object-contain" })) : (_jsx("img", { src: currentItem.src, alt: currentItem.alt, className: "w-full h-full object-contain" })) })), _jsxs("div", { className: "text-white text-center mt-4", children: [currentItem?.title && _jsx("h3", { className: "text-lg font-semibold", children: currentItem.title }), currentItem?.description && (_jsx("p", { className: "text-sm text-gray-300 mt-1", children: currentItem.description }))] })] })] }));
});
ImmersiveGallery.displayName = "ImmersiveGallery";
export { ImmersiveGallery };
//# sourceMappingURL=ImmersiveGallery.js.map