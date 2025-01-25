import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
function customHeadersMiddleware() {
  return {
    name: 'custom-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Permission-Policy', "");
        next();
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    customHeadersMiddleware()
  ],
  base: "/car-shop-frontend/"
});
