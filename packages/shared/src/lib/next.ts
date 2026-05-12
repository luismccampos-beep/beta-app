// Next.js utilities wrapper
// This file ensures the next dependency is properly referenced in the shared package

// Re-export next utilities for SSR and server-side operations
// Note: next should be used as a peer dependency in consuming packages

export const NEXT_TELEMETRY_DISABLED = true;

// Next.js configuration helpers
export const getNextConfig = () => ({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'pt', 'es', 'fr'],
    defaultLocale: 'en',
  },
});

// Image optimization configuration
export const imageConfig = {
  domains: ['images.unsplash.com', 'res.cloudinary.com'],
  formats: ['image/avif', 'image/webp'],
};

// Export Next.js constants
export const IMAGE_BLUR_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
