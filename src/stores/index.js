// 创建仓库
import { createPinia } from "pinia"

// pinia持久化
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

// 创建pinia实例
const pinia = createPinia()

// 使用pinia持久化插件
pinia.use(piniaPluginPersistedstate)

// 导出pinia实例
export default pinia
