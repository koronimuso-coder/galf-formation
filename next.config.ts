import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://my.spline.design https://*.firebaseapp.com https://*.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com https://my.spline.design wss://*.firebaseio.com",
      "frame-src 'self' https://my.spline.design",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  /* ── Image Optimization ── */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  /* ── Compression ── */
  compress: true,

  /* ── Powered By Header (security: hide) ── */
  poweredByHeader: false,

  /* ── Security Headers ── */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Cache static assets aggressively
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts
        source: '/(.*)\\.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  /* ── Redirects for common typos/old URLs ── */
  async redirects() {
    return [
      {
        source: '/formation',
        destination: '/formations',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/a-propos',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/connexion',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/inscription',
        permanent: true,
      },
      {
        source: '/programme-parrainage',
        destination: '/programme-ambassadeur',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
