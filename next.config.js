const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.io/api/event https://plausible.io/js/plausible.js https://www.paypal.com/sdk/js;
  child-src 'self' https://www.sandbox.paypal.com/;
  object-src 'none';
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, '')
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  }
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  swcMinify: true,

  experimental: {
    runtime: 'experimental-edge'
  },

  images: {
    domains: ['res.cloudinary.com', 'cdn.remote.work'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400
  },

  headers: () => [
    {
      source: '/',
      headers: securityHeaders
    },
    {
      source: '/:path*',
      headers: securityHeaders
    }
  ]
}

module.exports = nextConfig
