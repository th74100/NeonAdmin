<template>
    <template
        v-for="item in menuList"
        :key="item.path">
        <!--有子节点-->
        <el-sub-menu
            v-if="item?.children?.length"
            :index="item.path">
            <template #title>
                <el-icon
                    v-if="item.meta?.icon"
                    :size="16">
                    <component :is="item.meta?.icon" />
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <span
                v-if="globalStore.isCollapse"
                class="block pl-[6px] mb-[10px] text-gray-400">
                {{ item.meta?.title }}
            </span>
            <neon-aside-menu :menuList="item.children" />
        </el-sub-menu>
        <!--没有子节点-->
        <el-menu-item
            v-else
            :index="item.path">
            <el-icon
                v-if="item.meta?.icon"
                :size="16">
                <component :is="item.meta?.icon" />
            </el-icon>
            <template #title>
                <span>{{ item.meta.title }}</span>
            </template>
        </el-menu-item>
    </template>
</template>

<script setup>
import NeonAsideMenu from '@/components/NeonAsideMenu'
import useGlobalStore from '@/stores/modules/global'

const globalStore = useGlobalStore()

defineProps({
    menuList: {
        type: Array,
        default: () => [],
    },
})
</script>

<style lang="scss" scoped></style>
