import { ref, nextTick } from 'vue'
import router from '@/router'
import pinia from '@/stores'

// codemirror 进阶版
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

import Prism from 'prismjs'

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror'

// mode
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/yaml/yaml'

// edit
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'

// placeholder
import 'codemirror/addon/display/placeholder'

// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'

// style
import 'codemirror/lib/codemirror.css'

VMdEditor.Codemirror = Codemirror
VMdEditor.use(vuepressTheme, {
    Prism,
})
VMdEditor.use(createCopyCodePlugin())

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
    app.use(VMdEditor)
    //app.use(VueMarkdownEditor) // markdown编辑器
    app.use(router)
    app.use(pinia)
}
