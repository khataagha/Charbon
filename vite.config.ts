import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'apk-downloads-server-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0] || '';

          // File explorer route alias
          if (url === '/files' || url === '/explorer' || url === '/downloads/') {
            const htmlPath = path.resolve(__dirname, 'public/index-files.html');
            if (fs.existsSync(htmlPath)) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              return res.end(fs.readFileSync(htmlPath));
            }
          }

          // Force download headers and proper MIME types for APK and AAB binaries
          if (url.endsWith('.apk')) {
            res.setHeader('Content-Type', 'application/vnd.android.package-archive');
            res.setHeader('Content-Disposition', 'attachment');
          } else if (url.endsWith('.aab')) {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment');
          }
          next();
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
