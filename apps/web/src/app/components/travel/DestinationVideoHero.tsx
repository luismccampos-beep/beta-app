'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Camera, Play } from 'lucide-react';
import { VideoPlayer } from '../ui/VideoPlayer';

type VideoData = {
  url: string;
  thumbUrl?: string | null;
  posterUrl?: string | null;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  author?: string | null;
  license: string;
  sourceUrl?: string | null;
  isVerified: boolean;
};

type DestinationVideoHeroProps = {
  imageUrl: string;
  imageAlt: string;
  video: VideoData | null;
};

export function DestinationVideoHero({ imageUrl, imageAlt, video }: DestinationVideoHeroProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hasVerifiedVideo = video !== null && video.isVerified && !prefersReducedMotion;

  const toggleVideo = useCallback(() => {
    if (videoFailed) return;
    setShowVideo((v) => !v);
  }, [videoFailed]);

  return (
    <div className="relative h-[50vh] min-h-[320px] max-h-[520px] w-full overflow-hidden">
      {/* Video */}
      {showVideo && video && !videoFailed && (
        <VideoPlayer
          src={video.url}
          poster={video.posterUrl ?? video.thumbUrl ?? imageUrl}
          className="absolute inset-0 h-full w-full"
          autoPlay
          loop
          controls
          onError={() => { setVideoFailed(true); setShowVideo(false); }}
        />
      )}

      {/* Image (fallback or default) */}
      {(!showVideo || videoFailed) && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105"
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />

      {/* Toggle buttons */}
      <div className="absolute top-20 right-4 z-20 flex gap-2">
        {hasVerifiedVideo && (
          <>
            <button
              type="button"
              onClick={toggleVideo}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm hover:bg-white/25 transition-colors"
              aria-label={showVideo ? 'Show photo' : 'Show video'}
            >
              {showVideo ? (
                <>
                  <Camera className="h-4 w-4" />
                  Photo
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Video
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Video attribution */}
      {showVideo && video?.author && (
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href={video.sourceUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs hover:bg-black/50 hover:text-white transition-all"
          >
            <Camera className="h-3 w-3" />
            <span>Video: {video.author} &middot; {video.license}</span>
          </a>
        </div>
      )}
    </div>
  );
}
