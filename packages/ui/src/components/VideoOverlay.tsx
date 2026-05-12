import React from "react";

import { cn } from "../utils/cn";

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

export const VideoOverlay: React.FC<VideoOverlayProps> = ({
  overlay,
  overlayColor,
  overlayOpacity,
  poster,
  isLoading,
  hasError,
  contentClassName,
  children,
}) => {
  const showPoster = (isLoading || hasError) && poster;

  return (
    <>
      {/* Poster / Loading / Error Fallback */}
      {showPoster && (
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center z-10",
            isLoading && "animate-pulse",
          )}
          style={{ backgroundImage: `url(${poster})` }}
          role="img"
          aria-label={
            hasError ? "Imagem de fundo alternativa" : "Carregando vídeo"
          }
        />
      )}

      {/* Dark Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      {children && (
        <div className={cn("relative z-20", contentClassName)}>{children}</div>
      )}
    </>
  );
};
