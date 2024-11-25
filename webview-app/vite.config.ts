import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vuetify({ autoImport: true })],
    base: "./",
    build: {
        outDir: "../dist-webview-app",
        rollupOptions: {
            input: "index.html",
        },
        target: "es2015",
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
    },
});
