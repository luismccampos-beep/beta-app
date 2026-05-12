import React from "react";
export interface VideoPlayerProps {
    src: string;
    sources?: Array<{
        src: string;
        type: string;
    }>;
    poster?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    objectPosition?: string;
    playWhenVisible?: boolean;
    onLoad: () => void;
    onError: () => void;
    isLoading: boolean;
}
export declare const VideoPlayer: React.FC<VideoPlayerProps>;
