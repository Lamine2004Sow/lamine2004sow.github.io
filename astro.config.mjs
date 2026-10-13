import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lamine-sow.me',
  integrations: [tailwind()],
  output: 'static',
  redirects: {
    '/cv': '/',
  },
});
