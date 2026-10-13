import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve('./src'),
            '~': path.resolve('./src/views'),
        },
        extensions: ['.js', '.ts', '.json', '.vue'],
        mainFiles: ['index'],
    },
    test: {
        environment: 'jsdom',
        include: ['tests/**/*.spec.js'],
        globals: true,
    },
})