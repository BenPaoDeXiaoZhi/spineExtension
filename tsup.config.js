import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    extension: 'src/index.ts',
    index: 'src/dev/index.ts'
  },
  splitting: false,
  sourcemap: false,
  clean: true,
  format:'iife',
  esbuildOptions: (options) => {
    options.charset = 'utf8'
  }
})
