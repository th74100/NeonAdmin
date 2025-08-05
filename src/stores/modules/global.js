import { defineStore } from 'pinia'
import { tool } from '@/utils'
import {
    PINIA_PREFIX,
    ELEMENT_PLUS_SIZE,
    DEFAULT_LAYOUT,
    ROUTER_ANIMATION,
    APP_COLOR,
    APP_PREDEFINE_COLOR,
} from '@/config'

const globalStore = defineStore('global', {
    persist: {
        enabled: true,
        key: `${PINIA_PREFIX}GLOBAL`,
        storage: localStorage,
        serializer: {
            serialize(value) {
                return tool.serialize(value)
            },
            deserialize(value) {
                return tool.deserialize(value)
            },
        },
    },
    state: () => {
        return {
            // 大小
            globalSize: ELEMENT_PLUS_SIZE,

            // 全局布局
            layout: DEFAULT_LAYOUT,

            // 主题色
            colorPrimary: APP_COLOR,
            predefineColors: APP_PREDEFINE_COLOR,

            // 是否开启路由动画
            routerAnimation: true,

            // 路由动画
            transition: ROUTER_ANIMATION,

            // 是否折叠侧边栏
            isCollapse: false,

            // 菜单栏展开宽度
            menuWidth: 230,

            // 菜单栏折叠宽度
            menuCollapseWidth: 60,

            // 是否只保持一个子菜单展开
            uniqueOpened: true,

            // 暗黑模式
            darkMode: false,

            // 深色侧边栏
            darkSlide: false,

            // 色弱模式
            invertMode: false,

            // 灰色模式
            grayMode: false,
        }
    },
    actions: {
        // 设置当前global所有参数值
        set(...args) {
            this.$patch({ [args[0]]: args[1] })
        },

        theme(value) {
            const el = document.documentElement
            el.style.setProperty(
                '--el-color-primary',
                this.darkMode ? `${tool.darken(value, 0.2)}` : `${value}`,
            )
            for (let i = 1; i <= 9; i++) {
                const color = this.darkMode
                    ? tool.darken(value, i / 10)
                    : tool.lighten(value, i / 10)
                el.style.setProperty(`--el-color-primary-light-${i}`, color)

                //el.style.setProperty(`--el-color-primary-dark-${i}`, color)
            }

            if (this.invertMode) {
                el.classList.add('invert')
            }

            if (this.grayMode) {
                el.classList.add('grayscale')
            }

            if (this.darkMode) {
                el.classList.add('dark')
            }
            this.colorPrimary = value
        },
    },
    getters: {
        getDarkMode: (state) => state.darkMode,
    },
})

export default globalStore
