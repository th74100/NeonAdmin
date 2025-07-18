import { ref, nextTick } from 'vue'
import router from '@/router'
import pinia from '@/stores'

import * as elIcons from '@element-plus/icons-vue'
import neonIcons from '@/components/NeonIcons'

const isRouterAlive = ref(true)
const reload = () => {
    isRouterAlive.value = false
    nextTick(() => {
        isRouterAlive.value = true
    })
}

export function loadVuePlugins(app) {
    // 注册 Element Plus 图标
    for (const [key, component] of Object.entries(elIcons)) {
        app.component(key, component)
    }

    // 注册本地扩展图标 如：<NeIconHome/> || <component :is="'NeIconHome'" /> || <component :is="'ne-icon-home'" />
    for (const [key, component] of Object.entries(neonIcons)) {
        app.component(`Neon${key}`, component)
    }

    // 注入 reload 方法，可以被后代组件使用
    app.provide('reload', {
        isRouterAlive,
        reload,
    })

    app.use(router)
    app.use(pinia)
}
