import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: "./",
    build: {
        outDir: "./dist",
        rollupOptions: {
            input: "index.html",
        },
        target: "es2015",
    },
});