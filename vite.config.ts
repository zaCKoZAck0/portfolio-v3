import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite plugin: reads src/seo.ts at build/dev time and replaces
 * placeholder tokens in index.html with the centralized SEO values.
 *
 * Placeholders used in index.html:
 *   %SEO_TITLE%          %SEO_DESCRIPTION%    %SEO_KEYWORDS%
 *   %SEO_URL%            %SEO_THEME_COLOR%    %SEO_LOCALE%
 *   %SEO_OG_TYPE%        %SEO_OG_SITE_NAME%   %SEO_OG_IMAGE%
 *   %SEO_OG_IMAGE_ALT%   %SEO_OG_IMAGE_W%     %SEO_OG_IMAGE_H%
 *   %SEO_TW_CARD%        %SEO_TW_HANDLE%      %SEO_TW_SITE%
 *   %SEO_JSON_LD%
 */
function seoPlugin(): Plugin {
  return {
    name: 'seo-inject',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        // Dynamic import so Vite resolves the TS module correctly.
        const { SEO } = await import('./src/seo.js')
        return html
          .replace(/%SEO_TITLE%/g, SEO.title)
          .replace(/%SEO_DESCRIPTION%/g, SEO.description)
          .replace(/%SEO_KEYWORDS%/g, SEO.keywords)
          .replace(/%SEO_URL%/g, SEO.url)
          .replace(/%SEO_THEME_COLOR%/g, SEO.themeColor)
          .replace(/%SEO_LOCALE%/g, SEO.locale)
          .replace(/%SEO_OG_TYPE%/g, SEO.og.type)
          .replace(/%SEO_OG_SITE_NAME%/g, SEO.og.siteName)
          .replace(/%SEO_OG_IMAGE%/g, SEO.og.image)
          .replace(/%SEO_OG_IMAGE_ALT%/g, SEO.og.imageAlt)
          .replace(/%SEO_OG_IMAGE_W%/g, SEO.og.imageWidth)
          .replace(/%SEO_OG_IMAGE_H%/g, SEO.og.imageHeight)
          .replace(/%SEO_TW_CARD%/g, SEO.twitter.card)
          .replace(/%SEO_TW_HANDLE%/g, SEO.twitter.handle)
          .replace(/%SEO_TW_SITE%/g, SEO.twitter.site)
          .replace(/%SEO_JSON_LD%/g, JSON.stringify(SEO.jsonLd, null, 2))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    seoPlugin(),
    react(),
    tailwindcss(),
  ],
})
