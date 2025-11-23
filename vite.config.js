import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            fileName: 'extension.global',
            name: 'extension',
        },
        rollupOptions: {
            plugins: [],
        },
        cssCodeSplit: false,
    },
    plugins: [
        svelte({
            emitCss: false,
        }),
    ],
});
