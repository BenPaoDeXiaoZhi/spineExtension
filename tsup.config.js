import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  watch: true,
  esbuildOptions: (options) => {
    options.charset = 'utf8'
  }
})