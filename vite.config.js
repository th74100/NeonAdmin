import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import UnoCSS from 'unocss/vite'
import autoprefixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // eslint-disable-next-line
    const env = loadEnv(mode, process.cwd())
    return {
        plugins: [
            vue(),
            UnoCSS(),
            ViteImageOptimizer(),
            createSvgIconsPlugin({
                // eslint-disable-next-line
                iconDirs: [path.resolve(process.cwd(), 'src/icons')],
                symbolId: 'icon-[dir]-[name]',
            }),
            createHtmlPlugin({
                minify: true,
                entry: 'src/main.js',
                inject: {
                    data: {
                        title: 'Vue3 NeonAdmin',
                    },
                },
            }),
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
        build: {
            minify: 'terser',
            outDir: 'dist',
            sourcemap: false,
            terserOptions: {
                compress: {
                    drop_console: true,
                    pure_funcs: ['console.log'],
                },
            },
            chunkSizeWarningLimit: 800,
            reportCompressedSize: false,
            assetsInlineLimit: 5 * 1024,
            rollupOptions: {
                output: {
                    hashCharacters: 'hex',
                    entryFileNames: 'assets/js/app.[hash].js',
                    chunkFileNames: 'assets/js/[hash].js',
                    assetFileNames(assetInfo) {
                        // css
                        if (Array.isArray(assetInfo.names)) {
                            const name = assetInfo.names[0]
                            if (name.endsWith('.css')) {
                                return 'assets/css/[hash].css'
                            }

                            // 图片
                            const imgExts = [
                                '.png',
                                '.jpg',
                                '.jpeg',
                                '.gif',
                                '.ico',
                                '.svg',
                                '.webp',
                            ]
                            if (imgExts.some((ext) => name.endsWith(ext))) {
                                return 'assets/images/[hash].[ext]'
                            }

                            // 字体
                            const fontExts = [
                                '.woff',
                                '.woff2',
                                '.eot',
                                '.ttf',
                                '.otf',
                            ]
                            if (fontExts.some((ext) => name.endsWith(ext))) {
                                return 'assets/fonts/[hash].[ext]'
                            }
                        }
                        return 'assets/[hash].[ext]'
                    },
                    experimentalMinChunkSize: 50 * 1024, // 60kb
                    manualChunks: {
                        vendor: ['vue', 'vue-router'],
                        pinia: ['pinia', 'pinia-plugin-persistedstate'],
                        element: ['element-plus'],
                        libs: ['@element-plus/icons-vue'],
                    },
                },
            },
        },
        optimizeDeps: {
            include: ['vue', 'vue-router', 'element-plus'],
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
