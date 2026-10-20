import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lamine-sow.me',
  output: 'static',
  redirects: {
    '/cv': '/',
  },
});
