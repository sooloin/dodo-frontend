import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

/**
 * 개발 서버에서 /admin/* 경로를 admin.html로 서빙 (배포 환경은 vercel.json rewrites가 담당)
 * - 정적 파일 요청(확장자 있는 경로)은 그대로 통과시킨다
 */
function adminHistoryFallback(): Plugin {
  return {
    name: 'admin-history-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? '';
        const pathname = url.split('?')[0];

        if (pathname === '/admin' || (pathname.startsWith('/admin/') && !path.extname(pathname))) {
          req.url = '/admin.html';
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tailwindcss(), adminHistoryFallback()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
    },
  },
});
