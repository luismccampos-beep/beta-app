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
  domains: [
    'www.akmleva.pt',
    'akmleva.pt',
    'beta.akmleva.pt',
    'beta.admin.akmleva.pt',
    'images.akmleva.pt',
    'localhost',
    '127.0.0.1',
    'images.unsplash.com',
    'plus.unsplash.com',
    'ui-avatars.com',
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
  transpilePackages: ['@akmleva/shared', '@akmleva/auth', '@akmleva/ui', '@akmleva/frontend'],
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
              ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: https:; connect-src 'self' *.akmleva.pt *.google-analytics.com http://localhost:3001 http://127.0.0.1:3001 ws://localhost:3001 ws://127.0.0.1:3001; font-src 'self' *.googleapis.com *.gstatic.com; frame-src 'self' *.google.com; object-src 'none';"
              : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: https:; connect-src 'self' *.akmleva.pt *.google-analytics.com; font-src 'self' *.googleapis.com *.gstatic.com; frame-src 'self' *.google.com; object-src 'none';"
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

      // API routes specific headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL || 'https://www.akmleva.pt'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, X-Correlation-Id, X-Request-Id, X-API-Key, Cache-Control'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          }
        ]
      }
    ];
  },

  eslint: {
    // Keep `next build` working even if the monorepo/root eslint config isn't present.
    ignoreDuringBuilds: true,
  },

  images: {
    domains: baseImageConfig.domains,
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

  // Redirects
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.akmleva.pt',
          },
        ],
        destination: 'https://akmleva.pt/:path*',
        permanent: true,
      },
    ];
  },

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
