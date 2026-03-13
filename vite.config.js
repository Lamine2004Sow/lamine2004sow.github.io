import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        rl: resolve(__dirname, 'pages/rl.html'),
        ml: resolve(__dirname, 'pages/ml.html'),
        or: resolve(__dirname, 'pages/or.html'),
        articles: resolve(__dirname, 'pages/articles.html'),
        article: resolve(__dirname, 'pages/article.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
});
