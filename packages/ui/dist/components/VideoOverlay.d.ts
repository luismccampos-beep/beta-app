import React from "react";
export interface VideoOverlayProps {
    overlay?: boolean;
    overlayColor?: string;
    overlayOpacity?: number;
    poster?: string;
    isLoading?: boolean;
    hasError?: boolean;
    contentClassName?: string;
    children?: React.ReactNode;
}
export declare const VideoOverlay: React.FC<VideoOverlayProps>;
