import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  esbuildOptions: (options) => {
    options.charset = 'utf8'
  }
})
