import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import fs from 'fs/promises'
import { glob } from 'glob'

const entry = {
  index: './src/index.ts',
}
export default defineConfig({
  build: {
    lib: {
      entry,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'cjs') return `${entryName}.cjs`
        if (format === 'es') return `${entryName}.mjs`
        return `${entryName}.${format}`
      },
    },
    rollupOptions: {
      // 确保不将 Vue 打包进组件库
      external: ['vue'],
      output: {
        // 确保导出正确的组件
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
      outDir: 'dist/types',
      tsconfigPath: 'tsconfig.json',
      afterBuild: async () => {
        const files = glob.sync('dist/types/**/*.d.{ts,ts.map}', {
          nodir: true,
        })
        for (const file of files) {
          const newFilePath = file.replace(/\.d\.ts(\.map)?$/, '.d.cts$1')
          await fs.copyFile(file, newFilePath)
        }
      },
    }),
  ],
})
