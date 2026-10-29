import type { NextConfig } from 'next';

// Export statique pour GitHub Pages : toutes les routes sont générées à la compilation.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
