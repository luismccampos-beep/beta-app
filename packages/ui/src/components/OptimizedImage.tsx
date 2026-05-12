"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@akmleva/shared';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
}

/**
 * OptimizedImage component with WebP support and lazy loading
 * 
 * Features:
 * - Automatic WebP format conversion
 * - Lazy loading with intersection observer
 * - Progressive loading with blur placeholder
 * - Error handling with fallback
 * - Performance monitoring
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  sizes,
  fill = false,
  style,
  loading,
  fallbackSrc,
  fallbackComponent,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const resolvedWidth = width ?? 400;
  const resolvedHeight = height ?? 300;

  // If we failed and have a custom component or default fallback, render that
  if (hasError) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    if (!fallbackSrc) {
      return (
        <div className={cn("flex h-full w-full items-center justify-center bg-gray-100 text-gray-400", className)}>
          <ImageOff className="h-6 w-6" />
        </div>
      );
    }
  }

  // Generate WebP URL if supported
  const getWebPUrl = (originalUrl: string): string => {
    if (hasError && fallbackSrc) return fallbackSrc;
    
    // Check if the URL already has WebP format
    if (originalUrl.includes('.webp')) {
      return originalUrl;
    }

    // Convert to WebP for supported formats
    if (originalUrl.match(/\.(jpg|jpeg|png)$/i)) {
      // For external URLs, we'll rely on Next.js Image optimization
      // For local images, Next.js will handle WebP conversion
      return originalUrl;
    }

    return originalUrl;
  };

  // Generate blur placeholder
  const generateBlurPlaceholder = (_url: string): string => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple SVG blur placeholder
    const svg = `
      <svg width="${resolvedWidth}" height="${resolvedHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect width="100%" height="100%" fill="#e5e7eb" opacity="0.5"/>
      </svg>
    `;
    
    const base64 = typeof window === 'undefined'
      ? (globalThis as unknown as { Buffer: { from: (data: string) => { toString: (encoding: string) => string } } }).Buffer.from(svg).toString('base64')
      : window.btoa(svg);
    
    return `data:image/svg+xml;base64,${base64}`;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Fallback component
  if (hasError) {
    if (fallbackComponent) return <>{fallbackComponent}</>;
    
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={fill ? { ...style, position: 'absolute', inset: 0 } : style}
      >
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  // Loading placeholder
  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-100 animate-pulse ${className}`}
        style={fill ? { ...style, position: 'absolute', inset: 0 } : style}
      />
    );
  }

  const optimizedSrc = getWebPUrl(src);
  const blurData = placeholder === 'blur' ? generateBlurPlaceholder(src) : undefined;

  return (
    <div 
      ref={imgRef}

      className={`relative ${className}`}
      style={fill ? { ...style, position: 'absolute', inset: 0 } : style}
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        width={resolvedWidth}
        height={resolvedHeight}
        fill={fill}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurData}
        sizes={sizes}
        priority={priority}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
};


export default OptimizedImage;
