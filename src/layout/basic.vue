<template>
    <el-container class="neon-wrapper">
        <!--双列布局-->
        <el-aside
            v-if="globalStore.layout === 'default'"
            class="neon-slide"
            :class="[
                { 'is-close': subMenu.length === 0 },
                { 'is-collapse': globalStore.isCollapse },
            ]">
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
                                class="neon-menu-item__content"
                                :class="{
                                    'is-active': activeMenu?.path === item.path,
                                }"
                                @click="handleSwitchMenu(item)">
                                <el-icon :size="20">
                                    <component :is="item.meta?.icon" />
                                </el-icon>
                                <span class="neon-normal-menu__name">
                                    {{ item.meta.title }}
                                </span>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
            <div
                class="neon-menu"
                :style="{
                    width: globalStore.isCollapse
                        ? `${globalStore.menuCollapseWidth}px`
                        : `${globalStore.menuWidth}px`,
                }">
                <div
                    class="neon-menu__heading"
                    :class="{
                        hidden: globalStore.isCollapse,
                    }">
                    {{ APP_TITLE }}
                </div>
                <div
                    class="flex-1 w-full h-[calc(100%_-_80px)] p-[8px] ovhflow-hidden">
                    <el-scrollbar>
                        <el-menu
                            :default-active="subActiveMenu"
                            :collapse="globalStore.isCollapse"
                            :router="true"
                            :unique-opened="globalStore.uniqueOpened"
                            popper-class="layout-menu-popper">
                            <neon-aside-menu :menu-list="subMenu" />
                        </el-menu>
                    </el-scrollbar>
                </div>
                <collapse-comp class="absolute left-2 bottom-2 h-[25px]" />
            </div>
        </el-aside>

        <!--垂直布局-->
        <el-aside
            v-else
            class="neon-slide border-r border-default"
            :class="{
                'is-dark': globalStore.darkSlide,
            }"
            :style="{
                width: globalStore.isCollapse
                    ? `${globalStore.menuCollapseWidth}px`
                    : `${globalStore.menuWidth}px`,
            }">
            <div class="fx-col w-full">
                <div class="neon-logo text-nowrap overflow-hidden">
                    <router-link
                        to="/"
                        class="shrink-0">
                        <img src="@/assets/vite.svg" />
                    </router-link>
                    <span
                        class="text-nowrap font-semibold text-[var(--ne-foreground)]">
                        {{ APP_TITLE }}
                    </span>
                </div>
                <el-scrollbar class="w-full">
                    <el-menu
                        :default-active="subActiveMenu"
                        :collapse="globalStore.isCollapse"
                        :router="true"
                        :unique-opened="globalStore.uniqueOpened"
                        class="vertical-slide"
                        popper-class="layout-menu-popper">
                        <neon-aside-menu :menu-list="menu" />
                    </el-menu>
                </el-scrollbar>
                <collapse-comp class="mt-3 px-3 pb-3" />
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
import {
    h,
    ref,
    watch,
    computed,
    inject,
    resolveComponent,
    onMounted,
} from 'vue'
import { ElIcon } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { $notification, timeFix } from '@/utils'
import useGlobalStore from '@/stores/modules/global'
import useAuthStore from '@/stores/modules/auth'
import useKeepliveStore from '@/stores/modules/keeplive'
import NeonHeader from './components/NeonHeader.vue'
import NeonUser from './components/NeonUser.vue'
import NeonTabs from './components/NeonTabs.vue'

const { isRouterAlive } = inject('reload')
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const keepLive = useKeepliveStore()

const APP_TITLE = import.meta.env.VITE_APP_TITLE
const user = computed(() => authStore.getUserInfo)
const transition = computed(() => {
    if (globalStore.routerAnimation) {
        return globalStore.transition
    }
    return ''
})

/** 菜单 */
const menu = computed(() => authStore.getMenuList) // 主菜单
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

/** 折叠、展开按钮组件 */
const CollapseComp = {
    setup() {
        return () =>
            h('div', {}, [
                h(
                    'button',
                    {
                        class: 'fx-center w-[24px] h-[24px] rounded-md text-[var(--ne-foreground)] bg-[var(--ne-accent)] hover:bg-[var(--ne-accent-deep)]',
                        onClick: () => {
                            globalStore.set(
                                'isCollapse',
                                !globalStore.isCollapse,
                            )
                        },
                    },
                    [
                        h(
                            ElIcon,
                            { size: 14 },
                            {
                                default: () =>
                                    h(
                                        globalStore.isCollapse
                                            ? resolveComponent('DArrowRight')
                                            : resolveComponent('DArrowLeft'),
                                    ),
                            },
                        ),
                    ],
                ),
            ])
    },
}

onMounted(() => {
    settingMenu()

    $notification.success(`Hi, ${user.value.username}`, timeFix())
})
</script>

<style lang="scss" scoped></style>
