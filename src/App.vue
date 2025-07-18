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
    if (loading) {
        loading.classList.add('h-loading')
        loading.addEventListener(
            'transitionend',
            () => {
                loading.remove()
            },
            {
                once: false,
            },
        )
    }
}

onMounted(() => {
    handleLoading()

    tool.initTheme(globalStore)
})
</script>
