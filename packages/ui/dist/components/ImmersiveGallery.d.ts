import * as React from "react";
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
    images?: {
        src: string;
        alt?: string;
        id?: string;
        title?: string;
        url?: string;
        type?: "image" | "video";
    }[];
    isOpen?: boolean;
    open?: boolean;
    onClose?: () => void;
    initialIndex?: number;
    aspectRatio?: "aspect-video" | "aspect-square" | "aspect-[4/3]";
    showControls?: boolean;
    showThumbnails?: boolean;
    allowDownload?: boolean;
    allowShare?: boolean;
}
declare const ImmersiveGallery: React.ForwardRefExoticComponent<ImmersiveGalleryProps & React.RefAttributes<HTMLDivElement>>;
export { ImmersiveGallery };
