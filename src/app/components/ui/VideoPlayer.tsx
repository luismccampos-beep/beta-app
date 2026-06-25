'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

type VideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onError?: () => void;
  onEnded?: () => void;
};

export function VideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = false,
  muted: initialMuted = true,
  controls = false,
  onError,
  onEnded,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = useCallback(() => {
    if (!videoRef.current || hasError) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [hasError]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  useEffect(() => {
    if (!autoPlay || !videoRef.current || hasError) return;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [autoPlay, hasError]);

  if (hasError) return null;

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop={loop}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onError={handleError}
        onEnded={handleEnded}
      />

      {controls && !hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <button
            type="button"
            onClick={togglePlay}
            className="p-4 rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-all"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
        </div>
      )}

      {controls && !hasError && (
        <div className="absolute bottom-4 right-4 z-10">
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
