import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons/register'
import { loadVuePlugins } from '@/utils/loadVuePlugins'

import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import '@unocss/reset/tailwind-compat.css'
import 'element-plus/theme-chalk/src/index.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'nprogress/nprogress.css'
import './styles/style.scss'
import './styles/transition.scss'

const app = createApp(App)
loadVuePlugins(app)
app.mount('#app')
