import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({mode}) => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      viteCompression({ algorithm: 'gzip' }),
      viteCompression({ algorithm: 'brotliCompress' })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist/client',
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion': ['motion/react'],
            'icons': ['lucide-react'],
            'charts': ['recharts']
          }
        }
      }
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
