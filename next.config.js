import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Using next.config.js');

const withNextIntl = createNextIntlPlugin(
  './src/i18n.ts'
);

const baseImageConfig = {
  remotePatterns: [
    { protocol: 'https', hostname: 'www.akmleva.pt' },
    { protocol: 'https', hostname: 'akmleva.pt' },
    { protocol: 'https', hostname: 'beta.akmleva.pt' },
    { protocol: 'https', hostname: 'beta.admin.akmleva.pt' },
    { protocol: 'https', hostname: 'images.akmleva.pt' },
    { protocol: 'http', hostname: 'localhost' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'plus.unsplash.com' },
    { protocol: 'https', hostname: 'images.pexels.com' },
    { protocol: 'https', hostname: 'ui-avatars.com' },
    { protocol: 'https', hostname: 'pixabay.com' },
    { protocol: 'https', hostname: '**.wikivoyage.org' },
    { protocol: 'https', hostname: 'commons.wikimedia.org' },
    { protocol: 'https', hostname: 'upload.wikimedia.org' },
    { protocol: 'https', hostname: '**.wikipedia.org' },
    { protocol: 'https', hostname: 'images.openverse.org' },
    { protocol: 'https', hostname: 'api.openverse.org' },
    { protocol: 'https', hostname: 'live.staticflickr.com' },
  ],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Avoid Next.js picking an incorrect monorepo root when multiple lockfiles exist.
  outputFileTracingRoot: __dirname,
  transpilePackages: [],
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'lodash',
      'date-fns',
      'framer-motion',
      'recharts',
      'react-use',
      '@radix-ui/react-icons'
    ],
    serverMinification: true,
    // optimizeCss: true, // Habilitar se causar problemas de CSS
  },
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development'
              ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: https:; connect-src 'self' *.akmleva.pt *.google-analytics.com http://localhost:3001 http://127.0.0.1:3001 ws://localhost:3001 ws://127.0.0.1:3001; font-src 'self' *.googleapis.com *.gstatic.com; frame-src 'self' *.google.com openstreetmap.org; object-src 'none';"
              : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: https:; connect-src 'self' *.akmleva.pt *.google-analytics.com; font-src 'self' *.googleapis.com *.gstatic.com; frame-src 'self' *.google.com openstreetmap.org; object-src 'none';"
          },

          // X-Frame-Options
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },

          // X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },

          // X-XSS-Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },

          // Referrer-Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },

          // Permissions-Policy
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
              'autoplay=()',
              'encrypted-media=()',
              'fullscreen=()',
              'display-capture=()',
              'sync-xhr=()',
              'midi=()',
              'picture-in-picture=()',
              'publickey-credentials-get=()',
              'screen-wake-lock=()',
              'web-share=()'
            ].join(', ')
          },

          // Strict-Transport-Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },

          // Cross-Origin-Embedder-Policy
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },

          // Cross-Origin-Opener-Policy
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },

          // Cross-Origin-Resource-Policy
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
          }
        ]
      },

      // CORS handled in middleware.ts (dynamic origin check against whitelist)
    ];
  },

  // ESLint and TypeScript errors are enforced during build — no ignores needed
  eslint: {},
  typescript: {},

  images: {
    remotePatterns: baseImageConfig.remotePatterns,
    formats: baseImageConfig.formats,
    unoptimized: process.env.NODE_ENV === 'production' ? false : true,
  },

  // Compression
  compress: true,

  // Performance
  poweredByHeader: false,

  // Development
  ...(process.env.NODE_ENV === 'development' && {
    // Enable source maps in development
    productionBrowserSourceMaps: true,
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Disable sourcemaps in production to avoid sourcemap errors
    productionBrowserSourceMaps: false,
  }),

  // NOTE: Domain redirects (www ↔ non-www) are handled by the Vercel domain config,
  // NOT here. Adding a redirect() rule for domain redirects will cause ERR_TOO_MANY_REDIRECTS
  // because Vercel's infrastructure-level redirect and Next.js redirect fight each other.
  // If you need to change domain redirect direction, do it in Vercel Dashboard > Settings > Domains.

  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/v1/wb/pulse',
        destination: '/api/v1/wb/perf',
      },
      {
        source: '/api/v1/telemetry/client',
        destination: '/api/v1/wb/perf',
      },
      {
        source: '/api/v1/:path*',
        destination: `${process.env.API_URL || 'https://api.akmleva.pt'}/api/:path*`,
      },
    ];
  },

  // Environment variables
  env: {
    // Add any environment variables that should be available in the browser
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://www.akmleva.pt',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? '/api' : 'https://api.akmleva.pt'),
    NEXT_PUBLIC_VERSION: process.env.npm_package_version || '1.0.0',
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@opentelemetry/instrumentation': 'commonjs @opentelemetry/instrumentation',
      });
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
