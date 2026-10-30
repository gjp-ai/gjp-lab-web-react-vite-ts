import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { appearanceHeadScript } from './build/appearance-head.ts';
import menuConfig from './src/features/navigation/config/menu.json' with { type: 'json' };
import { parseMenu } from './src/features/navigation/model/menu-schema.ts';

parseMenu(menuConfig);

export default defineConfig({
  base: '/lab/react/v2/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'appearance-before-paint',
      transformIndexHtml() {
        return [{ tag: 'script', children: appearanceHeadScript(), injectTo: 'head-prepend' }];
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    open: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom/client'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'react-vendor', test: /\/node_modules\/(react|react-dom|scheduler)\// }],
        },
      },
    },
  },
});
