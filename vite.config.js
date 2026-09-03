import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

// Корень проекта (папка, где лежит этот файл)
const root = import.meta.dirname;

export default defineConfig({
  // './' — сайт будет работать и на nick.github.io, и на nick.github.io/folio/
  base: './',

  plugins: [
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
