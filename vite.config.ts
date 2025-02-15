import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@components": path.resolve(dirname, "components"),
			"@audio": path.resolve(dirname, "audio"),
			"@lib": path.resolve(dirname, "lib"),
			"@": dirname,
		},
	},
});
