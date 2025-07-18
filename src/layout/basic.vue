<template>
    <el-container class="neon-wrapper">
        <el-aside
            v-if="globalStore.layout === 'default'"
            class="neon-slide"
            :class="{ 'is-close': subMenu.length === 0 }">
            <div
                class="neon-menu-bar"
                :class="{
                    'is-dark': globalStore.darkSlide,
                }">
                <div class="neon-logo">
                    <router-link to="/">
                        <img src="@/assets/vite.svg" />
                    </router-link>
                </div>
                <div class="neon-normal-menu">
                    <el-scrollbar>
                        <ul>
                            <li
                                v-for="item in menu"
                                :key="item.path"
                                class="neon-sub-menu-content"
                                :class="{
                                    'is-active': activeMenu?.path === item.path,
                                }"
                                @click="handleSwitchMenu(item)">
                                <i class="el-icon">
                                    <component :is="item.meta?.icon" />
                                </i>
                                <span class="neon-normal-menu__name">
                                    {{ item.meta.title }}
                                </span>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
            <div class="neon-menu">
                <div class="neon-menu__title">Neon Admin</div>
                <div class="flex-1 w-full h-[calc(100%_-_50px)] ovhflow-hidden">
                    <el-scrollbar>
                        <el-menu
                            :default-active="subActiveMenu"
                            :collapse="false"
                            :router="true"
                            :collapse-transition="false"
                            :unique-opened="true"
                            class="neon-sub-menu">
                            <neon-aside-menu :menuList="subMenu" />
                        </el-menu>
                    </el-scrollbar>
                </div>
            </div>
        </el-aside>
        <el-aside
            v-else
            class="neon-slide vertical-slide border-r border-default"
            :class="{
                'is-dark': globalStore.darkSlide,
            }">
            <div class="fx-col w-full">
                <div class="neon-logo">
                    <router-link to="/">
                        <img src="@/assets/vite.svg" />
                    </router-link>
                    <span
                        class="text-nowrap font-semibold text-[var(--ne-foreground)]">
                        NeonAdmin
                    </span>
                </div>
                <el-scrollbar class="w-full">
                    <el-menu
                        :default-active="subActiveMenu"
                        :collapse="false"
                        :router="true"
                        :collapse-transition="false"
                        :unique-opened="true"
                        class="neon-sub-menu">
                        <neon-aside-menu :menuList="menu" />
                    </el-menu>
                </el-scrollbar>
            </div>
        </el-aside>
        <div class="neon-main">
            <div class="fx-col">
                <neon-header>
                    <neon-user />
                </neon-header>
                <neon-tabs />
            </div>
            <el-main
                v-if="isRouterAlive"
                class="neon-main__content">
                <router-view v-slot="{ Component, route }">
                    <transition
                        :name="transition"
                        mode="out-in"
                        appear>
                        <keep-alive :include="keepLive.getKeepLive">
                            <component
                                :is="Component"
                                :key="route.fullPath" />
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>
        </div>
    </el-container>
</template>

<script setup>
import { ref, watch, computed, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { $notification, timeFix } from '@/utils'
import useGlobalStore from '@/stores/modules/global'
import useAuthStore from '@/stores/modules/auth'
import useKeepLive from '@/stores/modules/keepLive'
import NeonHeader from './components/NeonHeader.vue'
import NeonUser from './components/NeonUser.vue'
import NeonTabs from './components/NeonTabs.vue'

const { isRouterAlive } = inject('reload')
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const keepLive = useKeepLive()

const transition = computed(() => globalStore.transition)

/** 菜单 */
const menu = ref([]) // 主菜单
const subMenu = ref([]) // 子菜单
const activeMenu = ref({}) // 当前主激活菜单
const subActiveMenu = ref('') // 当前子激活菜单

/** 设置菜单高亮 */
const settingMenu = () => {
    const { breadcrumb } = route.meta
    activeMenu.value = breadcrumb ? breadcrumb[0] : {}
    subMenu.value = filterUrl(activeMenu.value.children)
    subActiveMenu.value = route.path
}

/** 菜单切换 */
const handleSwitchMenu = (item) => {
    activeMenu.value = item
    subMenu.value = filterUrl(item.children)
    if (item.redirect) {
        router.push(item.redirect)
        return
    }
    if ((!item.children || item.children.length === 0) && item.component) {
        router.push(item.path)
    }
}

/** 过滤一些路由 */
const filterUrl = (data) => {
    let newMap = []
    data &&
        data.map((item) => {
            item.meta = item.meta ? item.meta : {}

            // 处理菜单隐藏和按钮
            if (item.meta.hidden || item.meta.type === 'button') {
                return false
            }

            if (item.children && item.children.length > 0) {
                item.children = filterUrl(item.children)
            }
            newMap.push(item)
        })
    return newMap
}

/** 监听路由变化 */
watch(
    () => route.path,
    () => {
        settingMenu()
    },
)

onMounted(() => {
    menu.value = authStore.getMenuList
    settingMenu()

    $notification.success(`Hi, ${authStore.getUserInfo.username}`, timeFix())
})
</script>

<style lang="scss" scoped></style>
