"use client";
import React, { useEffect, useRef } from "react";

import { cn } from "../utils/cn";

export interface VideoPlayerProps {
  src: string;
  sources?: Array<{ src: string; type: string }>;
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

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  sources,
  poster,
  autoPlay,
  muted,
  loop,
  controls,
  objectPosition,
  playWhenVisible,
  onLoad,
  onError,
  isLoading,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // IntersectionObserver para lazy loading
  useEffect(() => {
    if (!playWhenVisible || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current
              .play()
              .catch((e) => console.warn("Autoplay prevented:", e));
          } else if (videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [playWhenVisible]);

  // AutoPlay padrão na montagem
  useEffect(() => {
    if (!autoPlay || playWhenVisible || !videoRef.current) return;
    videoRef.current
      .play()
      .catch((e) => console.warn("Mount autoplay prevented:", e));
  }, [autoPlay, playWhenVisible]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      autoPlay={playWhenVisible ? false : autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline
      preload="metadata"
      onLoadedData={onLoad}
      onError={onError}
      className={cn(
        "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
        isLoading ? "opacity-0" : "opacity-100",
      )}
      style={{ objectPosition }}
      aria-hidden="true"
    >
      <track kind="captions" />
      {sources ? (
        sources.map((s, i) => <source key={i} src={s.src} type={s.type} />)
      ) : (
        <source src={src} type="video/mp4" />
      )}
    </video>
  );
};
