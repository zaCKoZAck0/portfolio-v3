/**
 * Centralized SEO configuration.
 * This is the single source of truth for all meta tags, OG tags,
 * structured data, and social handles.
 *
 * To audit or update SEO: edit this file, then rebuild.
 * The Vite plugin in vite.config.ts injects these values into index.html.
 */

// ---------------------------------------------------------------------------
// Update SITE_URL once deployed.
// ---------------------------------------------------------------------------
export const SITE_URL = "https://zackozack.xyz";

export const SEO = {
  // ---- Core ----------------------------------------------------------------
  title: "zackozack | Software Developer",
  description: "Portfolio",
  keywords:
    "zackozack, software developer, portfolio, react, aws, typescript, frontend, full stack, web development",
  themeColor: "#2d1b69",

  // ---- Canonical & URL -----------------------------------------------------
  url: SITE_URL,
  locale: "en_US",

  // ---- Open Graph ----------------------------------------------------------
  og: {
    type: "website",
    siteName: "zackozack",
    // Replace with a real 1200×628 image once you have one.
    image: `${SITE_URL}/og-image.png`,
    imageAlt: "zackozack - portfolio",
    imageWidth: "1200",
    imageHeight: "628",
  },

  // ---- Twitter / X ---------------------------------------------------------
  twitter: {
    card: "summary_large_image",
    // Update if you have a Twitter/X handle.
    handle: "@zackozack",
    site: "@zackozack",
  },

  // ---- Structured data (JSON-LD Person schema) -----------------------------
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "zackozack",
    url: SITE_URL,
    sameAs: [
      "https://github.com/zackozack0",
      // Add LinkedIn, Twitter, etc. here.
    ],
    jobTitle: "Software Developer",
    description: "Software development Engineer II @ Autodesk",
  },
} as const;
