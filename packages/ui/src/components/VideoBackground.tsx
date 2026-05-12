"use client";
import React, { useCallback, useState } from "react";

import { cn } from "../utils/cn";
import { VideoPlayer } from "./VideoPlayer";
import { VideoOverlay } from "./VideoOverlay";

export interface VideoBackgroundProps {
  src: string;
  sources?: Array<{ src: string; type: string }>;
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

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  sources,
  poster,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  overlay = true,
  overlayOpacity = 0.4,
  overlayColor = "black",
  children,
  onLoad,
  onError,
  contentClassName,
  objectPosition = "center",
  playWhenVisible = false,
}) => {
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

  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {!hasError && (
        <VideoPlayer
          src={src}
          sources={sources}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          objectPosition={objectPosition}
          playWhenVisible={playWhenVisible}
          isLoading={isLoading}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      <VideoOverlay
        overlay={overlay}
        overlayColor={overlayColor}
        overlayOpacity={overlayOpacity}
        poster={poster}
        isLoading={isLoading}
        hasError={hasError}
        contentClassName={contentClassName}
      >
        {children}
      </VideoOverlay>
    </div>
  );
};

export { VideoBackground };
export default VideoBackground;
