import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "package.json"), "utf-8")
);

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  proxy: {
    target: API_BASE_URL,
    changeOrigin: true,
    secure: false,
  },
});
