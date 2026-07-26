// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.i-studio.sk',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
