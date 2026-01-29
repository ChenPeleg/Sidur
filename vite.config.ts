import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    // Determine base path based on environment
    let base = "/";
    if (mode === "production-github") {
        base = "/Sidur/";
    }

    return {
        plugins: [react()],
        base,
        build: {
            outDir: "build",
            sourcemap: true,
        },
        server: {
            port: 3000,
            open: true,
        },
        preview: {
            port: 3000,
        },
        define: {
            "process.env.REACT_APP_ENV": JSON.stringify(
                env.VITE_APP_ENV || mode
            ),
        },
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: "./src/setupTests.ts",
            css: true,
        },
    };
});
