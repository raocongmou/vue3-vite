import { defineConfig, loadEnv } from 'vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 读取 env 文件
  const env = loadEnv(mode, process.cwd())

  return {
    baseURL: '/',
    server: {
      port: 97,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: 'http://127.0.0.1:1995',
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueSetupExtend(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(), // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        imports: [
          // presets
          'vue',
          // example type import
          {
            from: 'vue-router',
            imports: ['RouteLocationRaw'],
            type: true,
          },
        ],
        dts: path.resolve(__dirname, 'src/auto-imports.d.ts'), // ⭐ 必须
      }),
      Components({
        dirs: ['src/components'],
        resolvers: [
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          }),
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      lazyImport({
        resolvers: [
          VxeResolver({
            libraryName: 'vxe-table',
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置,使用@代替src
      },
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/styles/variables.scss" as *;
        `,
        },
      },
    },
  }
})
