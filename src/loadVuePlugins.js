import router from './router'
import pinia from './stores'

import * as elIcons from '@element-plus/icons-vue'
import neonIcons from '@/components/NeonIcons'

export function loadVuePlugins(app) {
    // 注册 Element Plus 图标
    for (const [key, component] of Object.entries(elIcons)) {
        app.component(key, component)
    }

    // 注册本地扩展图标 如：<NeonHome/> || <component :is="'NeonHome'" /> || <component :is="'ne-home'" />
    for (const [key, component] of Object.entries(neonIcons)) {
        app.component(`Neon${key}`, component)
    }
    app.use(router)
    app.use(pinia)
}
