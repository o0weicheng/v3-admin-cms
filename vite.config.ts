import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// element 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// mock
import { vitePluginFakeServer } from 'vite-plugin-fake-server'

import UnoCSS from '@unocss/vite'
import unoConfig from './uno.config'

// https://vite.dev/config/
export default defineConfig(({mode}) => {

  const isDev = mode === 'development'
  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router'],
      }),
      Components({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
        dts: 'src/components.d.ts',
      }),
      ...(isDev ?[vitePluginFakeServer({
        logger: true,
        enableProd: true,
      })]: []),
      UnoCSS(unoConfig),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element.scss" as *;`,
        },
      },
    },
    optimizeDeps: {
      exclude: ['fsevents'],
    },
    build: {
      rollupOptions: {
        external: ['fsevents'],
      },
    },
  }
})
