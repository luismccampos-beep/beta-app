import React from "react";
export interface VideoBackgroundProps {
    src: string;
    sources?: Array<{
        src: string;
        type: string;
    }>;
    poster?: string;
    className?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    overlay?: boolean;
    overlayOpacity?: number;
    overlayColor?: string;
    children?: React.ReactNode;
    onLoad?: () => void;
    onError?: (error: string) => void;
    contentClassName?: string;
    objectPosition?: string;
    playWhenVisible?: boolean;
}
declare const VideoBackground: React.FC<VideoBackgroundProps>;
export { VideoBackground };
export default VideoBackground;
