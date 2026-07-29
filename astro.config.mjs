// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.i-studio.sk',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      // ďakovacia stránka po odoslaní formulára do indexu nepatrí
      filter: (page) => !page.includes('/dakujeme'),
    }),
  ],
});
