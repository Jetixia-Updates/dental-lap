import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [".", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();

      // PRE-HOOK 1: Express API routes run BEFORE Vite so /api/* is handled by Express
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/api")) {
          // Express app has a broader request type than Vite's middleware, cast to any to avoid TS mismatch
          (app as any)(req, res, next);
        } else {
          next();
        }
      });

      // PRE-HOOK 2: SPA fallback rewrites client-side routes to /index.html
      // so Vite can serve the HTML and React Router handles routing
      server.middlewares.use((req, res, next) => {
        if (
          req.url &&
          !req.url.startsWith("/api") &&
          !req.url.startsWith("/@") &&
          !req.url.startsWith("/__") &&
          !req.url.startsWith("/node_modules") &&
          !req.url.startsWith("/client") &&
          !req.url.startsWith("/shared") &&
          !path.extname(req.url) &&
          !req.url.startsWith("/.")
        ) {
          req.url = "/index.html";
        }
        next();
      });
    },
  };
}
