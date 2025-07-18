import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import UnoCSS from 'unocss/vite'
import autoprefixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // eslint-disable-next-line
    const env = loadEnv(mode, process.cwd())
    return {
        plugins: [
            vue(),
            UnoCSS(),

            AutoImport({
                imports: ['vue', '@vueuse/core'],
                resolvers: [
                    ElementPlusResolver({
                        importStyle: 'sass',
                    }),
                ],
            }),
            Components({
                resolvers: [
                    ElementPlusResolver({
                        importStyle: 'sass',
                    }),
                ],
                directoryAsNamespace: true,
                dts: true,
            }),
        ],
        resolve: {
            // 配置路径别名
            alias: {
                '@': path.resolve('./src'),
                '~': path.resolve('./src/views'),
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
            mainFiles: ['index'],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    additionalData: `@use "@/styles/theme.scss" as *;`,
                },
            },
            postcss: {
                plugins: [
                    autoprefixer({
                        overrideBrowserslist: [
                            'last 2 versions',
                            '> 0.5%',
                            'ie >= 11',
                        ],
                        grid: true,
                    }),
                ],
            },
        },
        server: {
            port: env.VITE_APP_PORT || 3000,
            host: '0.0.0.0', // 允许本机IP访问 0.0.0.0
            hmr: true,
            watch: {
                // 确保监视index.vue文件
                ignored: ['!**/index.vue'],
            },
            proxy: {
                '/dev-api': {
                    target: env.VITE_APP_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/dev-api/, ''),
                },
            },
        },
    }
})
