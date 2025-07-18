import js from "@eslint/js"
import globals from "globals"
import pluginVue from "eslint-plugin-vue"
import { defineConfig } from "eslint/config"

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,vue}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,vue}"],
        languageOptions: { globals: globals.browser },
    },
    pluginVue.configs["flat/essential"],
    {
        rules: {
            // 关闭组件命名规则 https://eslint.vuejs.org/rules/multi-word-component-names.html
            "vue/multi-word-component-names": "off",

            // vue (https://eslint.vuejs.org/rules)
            "vue/no-mutating-props": "error", // 禁止在组件中修改 props
            "vue/require-default-prop": "off", // prop 为必填时，必须提供默认值
        },
    },
])
