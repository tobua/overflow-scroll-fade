import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export const rsbuild = defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './index.tsx',
    },
  },
  html: {
    title: 'overflow-scroll-fade',
    favicon: '../logo.png',
  },
  output: {
    assetPrefix: '/overflow-scroll-fade/',
  },
})

export const gitignore = 'bundle'
export const vscode = 'biome'
export const biome = {
  extends: 'recommended',
  linter: {
    rules: {
      style: {
        useFilenamingConvention: 'off',
      },
      suspicious: {
        noArrayIndexKey: 'off',
      },
    },
  },
  files: {
    ignore: ['rsbuild.config.ts'],
  },
}

export const typescript = {
  compilerOptions: {
    skipLibCheck: true,
    target: 'ESNext',
    lib: ['DOM', 'ESNext'],
    module: 'Preserve',
    jsx: 'react-jsx',
    noEmit: true,
  },
  include: ['index.tsx'],
}
