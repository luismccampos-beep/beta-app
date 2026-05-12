import { useState, useEffect, useRef, useCallback } from "react";

interface UseImageOptimizationOptions {
  threshold?: number;
  rootMargin?: string;
  placeholder?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseImageOptimizationReturn {
  isLoaded: boolean;
  isInView: boolean;
  hasError: boolean;
  isLoading: boolean;
  retryCount: number;
  imageRef: React.RefObject<HTMLDivElement | null>;
  optimizedSrc: string;
  handleLoad: () => void;
  handleError: () => void;
  retry: () => void;
  generateWebPUrl: (src: string) => string;
  generatePlaceholder: (width?: number, height?: number) => string;
}

/**
 * Hook for optimizing images with WebP conversion and lazy loading
 */
export const useImageOptimization = (
  options: UseImageOptimizationOptions = {},
): UseImageOptimizationReturn => {
  const {
    threshold = 0.01,
    rootMargin = "50px",
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate WebP URL
  const generateWebPUrl = useCallback((src: string): string => {
    if (!src) return "";

    // Check if already WebP
    if (src.includes(".webp")) return src;

    // For Next.js Image optimization, let it handle WebP conversion
    // Just return the original URL - Next.js will optimize it
    return src;
  }, []);

  // Generate placeholder SVG
  const generatePlaceholder = useCallback(
    (width = 400, height = 300): string => {
      const colors = ["#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <rect width="100%" height="100%" fill="#000" opacity="0.05"/>
        <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 8}" fill="#000" opacity="0.1"/>
      </svg>
    `;

      return `data:image/svg+xml;base64,${btoa(svg)}`;
    },
    [],
  );

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    setRetryCount(0);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  // Handle image error
  const handleError = useCallback(() => {
    if (retryCount < retryAttempts) {
      // Schedule retry
      retryTimeoutRef.current = setTimeout(
        () => {
          setRetryCount((prev) => prev + 1);
          setHasError(false);
        },
        retryDelay * Math.pow(2, retryCount),
      ); // Exponential backoff
    } else {
      setHasError(true);
    }
  }, [retryCount, retryAttempts, retryDelay]);

  // Manual retry
  const retry = useCallback(() => {
    setRetryCount(0);
    setHasError(false);
    setIsLoaded(false);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imageRef.current) return;

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
        threshold,
        rootMargin,
      },
    );

    observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [threshold, rootMargin]);

  return {
    isLoaded,
    isInView,
    hasError,
    isLoading: isInView && !isLoaded && !hasError,
    retryCount,
    imageRef,
    optimizedSrc: "", // Will be set by component
    handleLoad,
    handleError,
    retry,
    generateWebPUrl,
    generatePlaceholder,
  };
};

interface UseImagePreloaderReturn {
  loadedImages: Set<string>;
  failedImages: Set<string>;
  isLoaded: (url: string) => boolean;
  hasFailed: (url: string) => boolean;
  allLoaded: boolean;
  loadingProgress: number;
}

/**
 * Hook for preloading critical images
 */
export const useImagePreloader = (urls: string[]): UseImagePreloaderReturn => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImage = (_url: string) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(_url));
      };
      img.onerror = () => {
        setFailedImages((prev) => new Set(prev).add(_url));
      };
      img.src = _url;
    };

    urls.forEach(preloadImage);
  }, [urls]);

  const totalImages = urls.length;
  const completedImages = loadedImages.size + failedImages.size;
  const allLoaded = totalImages > 0 && completedImages === totalImages;
  const loadingProgress =
    totalImages > 0 ? (completedImages / totalImages) * 100 : 0;

  return {
    loadedImages,
    failedImages,
    isLoaded: (url: string) => loadedImages.has(url),
    hasFailed: (url: string) => failedImages.has(url),
    allLoaded,
    loadingProgress,
  };
};

interface UseResponsiveImagesReturn {
  generateSrcSet: (baseUrl: string, sizes: number[]) => string;
  generateWebPSrcSet: (baseUrl: string, sizes: number[]) => string;
  generateAVIFSrcSet: (baseUrl: string, sizes: number[]) => string;
  generateSizes: (
    breakpoints: Array<{ minWidth: string; size: string }>,
    defaultSize: string,
  ) => string;
}

/**
 * Hook for responsive image sources
 */
export const useResponsiveImages = (): UseResponsiveImagesReturn => {
  const generateSrcSet = useCallback(
    (baseUrl: string, sizes: number[]): string => {
      return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ");
    },
    [],
  );

  const generateWebPSrcSet = useCallback(
    (baseUrl: string, sizes: number[]): string => {
      return sizes
        .map((size) => `${baseUrl}?w=${size}&format=webp ${size}w`)
        .join(", ");
    },
    [],
  );

  const generateAVIFSrcSet = useCallback(
    (baseUrl: string, sizes: number[]): string => {
      return sizes
        .map((size) => `${baseUrl}?w=${size}&format=avif ${size}w`)
        .join(", ");
    },
    [],
  );

  const generateSizes = useCallback(
    (
      breakpoints: Array<{ minWidth: string; size: string }>,
      defaultSize: string,
    ): string => {
      const sizesArray = breakpoints.map(
        (bp) => `(min-width: ${bp.minWidth}) ${bp.size}`,
      );
      sizesArray.push(defaultSize);
      return sizesArray.join(", ");
    },
    [],
  );

  return {
    generateSrcSet,
    generateWebPSrcSet,
    generateAVIFSrcSet,
    generateSizes,
  };
};

interface ImageMetrics {
  loadTime: number;
  fileSize: number;
  dimensions: { width: number; height: number };
  compressionRatio?: number;
  format?: string;
}

interface UseImagePerformanceReturn {
  metrics: ImageMetrics | null;
  measureImage: (imgElement: HTMLImageElement) => void;
  averageLoadTime: number;
  totalMeasurements: number;
}

/**
 * Hook for image performance monitoring
 */
export const useImagePerformance = (): UseImagePerformanceReturn => {
  const [metrics, setMetrics] = useState<ImageMetrics | null>(null);
  const [loadTimes, setLoadTimes] = useState<number[]>([]);

  const measureImage = useCallback((imgElement: HTMLImageElement) => {
    const performance = window.performance;
    if (!performance) return;

    const entries = performance.getEntriesByName(imgElement.src);
    const entry = entries[entries.length - 1] as PerformanceResourceTiming;

    if (entry) {
      const loadTime = entry.responseEnd - entry.requestStart;
      const fileSize = entry.transferSize || 0;

      const newMetrics: ImageMetrics = {
        loadTime,
        fileSize,
        dimensions: {
          width: imgElement.naturalWidth,
          height: imgElement.naturalHeight,
        },
        compressionRatio:
          fileSize > 0
            ? (imgElement.naturalWidth * imgElement.naturalHeight * 4) /
              fileSize
            : undefined,
        format: imgElement.src.split(".").pop()?.split("?")[0],
      };

      setMetrics(newMetrics);
      setLoadTimes((prev) => [...prev, loadTime]);
    }
  }, []);

  const averageLoadTime =
    loadTimes.length > 0
      ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length
      : 0;

  return {
    metrics,
    measureImage,
    averageLoadTime,
    totalMeasurements: loadTimes.length,
  };
};

export default useImageOptimization;
