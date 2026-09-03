import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://lamine2004sow.github.io',
  integrations: [tailwind(), mdx()],
  output: 'static',
});
