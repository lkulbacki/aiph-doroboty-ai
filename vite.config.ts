import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { projectAiPlugin } from "./src/server/project-ai-plugin";

function localLandingPreview(): Plugin {
  const folder = new URL("./artifacts/landing/", import.meta.url);
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ttf": "font/ttf",
    ".txt": "text/plain; charset=utf-8",
  };

  return {
    name: "local-landing-preview",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split("?")[0];
        if (pathname === "/landing") {
          response.writeHead(302, { Location: "/landing/" }).end();
          return;
        }
        if (!pathname?.startsWith("/landing/")) return next();

        const file = pathname.slice("/landing/".length) || "index.html";
        const extension = extname(file);
        if (
          (request.method === "GET" || request.method === "HEAD") &&
          /^(?:assets\/)?[\w-]+\.(?:html|css|js|svg|webp|ttf|txt)$/.test(file) &&
          Object.hasOwn(types, extension)
        ) {
          try {
            const content = await readFile(new URL(file, folder));
            response.writeHead(200, { "Content-Type": types[extension as keyof typeof types] });
            response.end(request.method === "HEAD" ? undefined : content);
            return;
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== "ENOENT") return next(error);
          }
        }
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Copy the landing dist files to artifacts/landing to open this preview.");
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    localLandingPreview(),
    projectAiPlugin(loadEnv(mode, process.cwd(), "OPENROUTER_")),
    react(),
    tailwindcss(),
  ],
  base: "./",
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
}));
