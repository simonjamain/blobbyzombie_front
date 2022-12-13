import { ViteEjsPlugin } from "vite-plugin-ejs";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return {
    base: './',
    plugins: [
      // Without Data
      ViteEjsPlugin({
        backendUrl: process.env['VITE_BACKEND_URL'],
      }),
    ]
  };
});