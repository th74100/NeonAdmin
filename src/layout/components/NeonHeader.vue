<template>
    <header
        class="fx-center shrink-0 w-full h-[50px] px-[15px] border-b border-default bg-[var(--ne-header)]">
        <el-breadcrumb
            separator-icon="ArrowRight"
            class="neon-breadcrumb">
            <template
                v-for="item in breadcrumbList"
                :key="item.path">
                <el-breadcrumb-item v-if="item.path == route.path">
                    <div class="fx-center gap-1">
                        <el-icon
                            v-if="item.meta?.icon"
                            :size="15">
                            <component :is="item.meta.icon" />
                        </el-icon>
                        <span>{{ item.meta.title }}</span>
                    </div>
                </el-breadcrumb-item>
                <el-breadcrumb-item
                    v-else
                    :to="item.path">
                    <div class="fx-center gap-1">
                        <el-icon
                            v-if="item.meta?.icon"
                            :size="15">
                            <component :is="item.meta.icon" />
                        </el-icon>
                        <span>{{ item.meta.title }}</span>
                    </div>
                </el-breadcrumb-item>
            </template>
        </el-breadcrumb>
        <div class="flex-1"></div>
        <template v-if="$slots.default">
            <div class="fx-center shrink-0">
                <slot></slot>
            </div>
        </template>
    </header>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

/** 面包屑 */
const breadcrumbList = ref([])
const getBreadcrumb = () => {
    const matched = route.meta.breadcrumb
    breadcrumbList.value = matched
}

watch(
    () => route.path,
    () => {
        getBreadcrumb()
    },
)

onMounted(() => {
    getBreadcrumb()
})
</script>
