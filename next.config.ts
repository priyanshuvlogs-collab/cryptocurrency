import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy. The live stream host is not known in advance
 * (and may change), so media/connect allow any HTTPS origin; scripts and
 * frames are locked to the handful of services the site actually uses.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://cdn.sanity.io https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "media-src 'self' https: blob:",
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
  "worker-src 'self' blob:",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self \"https://checkout.stripe.com\")" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/(llms.txt|llms-full.txt)",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
    ];
  },
  /**
   * 301s from the old WordPress site (indiradio.ca) so existing links and
   * search rankings carry over. Add any others from the old sitemap before
   * launch – see docs/06-launch-checklist.md.
   */
  async redirects() {
    const old: [string, string][] = [
      ["/radio", "/en/listen-live"],
      ["/listen", "/en/listen-live"],
      ["/live", "/en/listen-live"],
      ["/contact-us", "/en/contact"],
      ["/Contact", "/en/contact"],
      ["/contact-classic", "/en/contact"],
      ["/about-us", "/en/about"],
      ["/services-standard", "/en/advertise"],
      ["/services", "/en/advertise"],
      ["/help", "/en/faq"],
      ["/category/:slug*", "/en/episodes"],
      ["/blog/:slug*", "/en/episodes"],
      ["/shop/:slug*", "/en/dedications"],
    ];
    return [
      ...old.map(([source, destination]) => ({ source, destination, permanent: true })),
      ...old
        .filter(([s]) => !s.includes(":"))
        .map(([source, destination]) => ({ source: `${source}/`, destination, permanent: true })),
      { source: "/wp-admin/:path*", destination: "/en", permanent: false },
      { source: "/feed", destination: "/en/episodes", permanent: true },
    ];
  },
};

export default nextConfig;
