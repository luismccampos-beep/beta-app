"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useState } from "react";
import { cn } from "../utils/cn";
import { VideoPlayer } from "./VideoPlayer";
import { VideoOverlay } from "./VideoOverlay";
const VideoBackground = ({ src, sources, poster, className, autoPlay = true, muted = true, loop = true, controls = false, overlay = true, overlayOpacity = 0.4, overlayColor = "black", children, onLoad, onError, contentClassName, objectPosition = "center", playWhenVisible = false, }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setHasError(false);
        onLoad?.();
    }, [onLoad]);
    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
        onError?.("Falha ao carregar o vídeo");
    }, [onError]);
    return (_jsxs("div", { className: cn("relative overflow-hidden w-full h-full", className), children: [!hasError && (_jsx(VideoPlayer, { src: src, sources: sources, poster: poster, autoPlay: autoPlay, muted: muted, loop: loop, controls: controls, objectPosition: objectPosition, playWhenVisible: playWhenVisible, isLoading: isLoading, onLoad: handleLoad, onError: handleError })), _jsx(VideoOverlay, { overlay: overlay, overlayColor: overlayColor, overlayOpacity: overlayOpacity, poster: poster, isLoading: isLoading, hasError: hasError, contentClassName: contentClassName, children: children })] }));
};
export { VideoBackground };
export default VideoBackground;
//# sourceMappingURL=VideoBackground.js.map