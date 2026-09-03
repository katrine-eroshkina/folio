import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

// Корень проекта (папка, где лежит этот файл)
const root = import.meta.dirname;

// Все современные браузеры понимают woff2. Выкидываем .woff-запаску из @font-face,
// чтобы Vite не тащил лишние файлы в сборку.
const dropWoffFallback = {
  name: 'drop-woff-fallback',
  generateBundle(_options, bundle) {
    for (const [name, chunk] of Object.entries(bundle)) {
      if (name.endsWith('.css') && chunk.type === 'asset') {
        chunk.source = String(chunk.source).replace(
          /,\s*url\([^)]+?\.woff\)\s*format\((["']?)woff\1\)/g,
          '',
        );
      } else if (name.endsWith('.woff') && name.includes('assets/')) {
        delete bundle[name];
      }
    }
  },
};

export default defineConfig({
  // './' — сайт будет работать и на nick.github.io, и на nick.github.io/folio/
  base: './',

  plugins: [
    dropWoffFallback,
    // Позволяет вставлять общие куски: {{> header }}, {{> footer }} из src/partials/
    handlebars({
      partialDirectory: resolve(root, 'src/partials'),
    }),
  ],

  build: {
    rollupOptions: {
      // Каждая страница сайта перечислена здесь, иначе Vite её не соберёт
      input: {
        index: resolve(root, 'index.html'),
        caseRiskAnalytics: resolve(root, 'case-risk-analytics.html'),
        caseTravelTogether: resolve(root, 'case-travel-together.html'),
        caseGiftCertificate: resolve(root, 'case-gift-certificate.html'),
      },
    },
  },
});
