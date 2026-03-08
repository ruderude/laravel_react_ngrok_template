import {ConfigEnv, defineConfig, loadEnv} from "vite"
import laravel from "laravel-vite-plugin"
import react from "@vitejs/plugin-react"
import {resolve} from 'path';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(async ({mode}: ConfigEnv) => {
    const env: Record<string, string> = loadEnv(mode, process.cwd(), "")

    const plugins = [
        tailwindcss(),
        react(),
    ]
    plugins.push(laravel({
        input: [
            "resources/ts/App.tsx",
            "resources/ts/Line.tsx",
            "resources/ts/Main.tsx",
        ],
        refresh: true
    }))
    return {
        plugins: plugins,
        server: {
            host: true,
            port: env.VITE_PORT ? Number.parseInt(env.VITE_PORT) : 5173,
            strictPort: true,
            origin: env.VITE_ORIGIN || undefined,
            hmr: env.VITE_HMR_HOST
                ? {
                    host: env.VITE_HMR_HOST,
                    protocol: "wss",
                    clientPort: 443,
                    path: "/@vite-hmr",
                }
                : {
                    host: "localhost",
                },
            cors: {
                origin: true,
                credentials: true,
            },
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, 'resources/ts'),
            },
        },
    }
})
