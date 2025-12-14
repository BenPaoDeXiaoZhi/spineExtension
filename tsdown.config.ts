import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: {
        extension: 'src/index.ts',
        index: 'src/dev/index.ts',
        component: 'src/dev/file.ts',
        report: 'src/dev/htmlReport.ts',
    },
    sourcemap: false,
    clean: true,
    format: 'iife',
    loader: {
        '.css': 'text',
        '.svg': 'text',
        '.png': 'dataurl',
    },
    copy: './public',
})