import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import cssonly from 'rollup-plugin-css-only';
export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            fileName: 'extension.global',
            name: 'extension',
        },
        rollupOptions: {
            plugins: [
                cssonly({
                    output: false,
                }),
            ],
        },
    },
    plugins: [svelte()],
});
