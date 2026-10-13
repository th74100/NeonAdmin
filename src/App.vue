<template>
    <el-config-provider
        :locale="zhCn"
        :size="globalStore.globalSize">
        <router-view />
    </el-config-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { tool } from '@/utils'
import useGlobalsStore from '@/stores/modules/global'

const globalStore = useGlobalsStore()

const handleLoading = () => {
    const loading = document.querySelector('#preloader')
    if (!loading) return

    let removeTimer = null
    const removeLoading = () => {
        clearTimeout(removeTimer)
        removeTimer = null
        loading.remove()
    }

    loading.addEventListener('transitionend', removeLoading, { once: true })
    loading.classList.add('h-loading')
    removeTimer = setTimeout(removeLoading, 1000)
}

onMounted(async () => {
    handleLoading()

    tool.initTheme(globalStore)
})
</script>
