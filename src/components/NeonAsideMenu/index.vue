<template>
    <template
        v-for="item in menuList"
        :key="item.path">
        <!--有子节点-->
        <el-sub-menu
            v-if="item?.children?.length"
            :index="item.path">
            <template #title>
                <div class="neon-sub-menu-content">
                    <el-icon
                        v-if="item.meta?.icon"
                        :size="16">
                        <component :is="item.meta?.icon" />
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </div>
            </template>
            <neon-aside-menu :menuList="item.children" />
        </el-sub-menu>
        <!--没有子节点-->
        <el-menu-item
            v-else
            :index="item.path">
            <template #default>
                <div class="neon-sub-menu-content">
                    <el-icon
                        v-if="item.meta?.icon"
                        :size="16">
                        <component :is="item.meta?.icon" />
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </div>
            </template>
        </el-menu-item>
    </template>
</template>

<script setup>
import NeonAsideMenu from '@/components/NeonAsideMenu'

defineProps({
    menuList: {
        type: Array,
        default: () => [],
    },
})
</script>

<style lang="scss" scoped></style>
