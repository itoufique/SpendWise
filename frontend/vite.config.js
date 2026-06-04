import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE_URL ? env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/images': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
