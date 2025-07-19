<template>
    <div
        class="flex items-center h-[38px] border-b border-default bg-[var(--ne-header)] transition-all">
        <div
            ref="tabBox"
            class="flex flex-1 pt-[3px] h-full overflow-hidden">
            <div
                class="neon-tabs-content flex w-max h-full pr-6 overflow-hidden">
                <div
                    v-for="(item, index) in visitedViews"
                    :key="item.path"
                    :class="[
                        { 'is-active': item.path === activeTab },
                        { home: item.path === HOME_PATH },
                    ]"
                    @click="handleChangeTab(item.path)"
                    class="neon-tabs__item shrink-0 relative -mr-3 flex items-center h-full select-none cursor-pointer">
                    <div class="relative wh-full px-1">
                        <div
                            class="neon-tabs__background absolute z-[1] wh-full px-[6px] transition-opacity duration-150">
                            <div
                                class="neon-tabs__background-content h-full rounded-tl-md rounded-tr-md duration-150" />
                            <svg-icon
                                name="ne-corner-before"
                                width="7"
                                height="7"
                                class="neon-tabs__background-before absolute bottom-0 left-[-1px] fill-transparent transition-all duration-150" />
                            <svg-icon
                                name="ne-corner-after"
                                width="7"
                                height="7"
                                class="neon-tabs__background-after absolute bottom-0 right-[-1px] fill-transparent transition-all duration-150" />
                        </div>
                        <div
                            v-if="visitedViews.length > 1"
                            class="absolute right-[10px] top-1/2 z-[3] size-4 translate-y-[-50%]">
                            <neon-fixed
                                v-if="
                                    (item.path === HOME_PATH || index == 0) &&
                                    isFixed
                                "
                                class="mt-[2px] size-3.2 cursor-pointer rounded-full transition-all"
                                @click.stop="isFixed = false" />
                            <neon-close
                                v-else
                                @click.stop="removeTab(item.path)"
                                class="neon-tabs__close mt-[2px] size-3 cursor-pointer rounded-full transition-all" />
                        </div>
                        <div
                            class="neon-tabs__name"
                            :class="{ 'pr-4': visitedViews.length > 1 }">
                            <el-icon
                                v-if="item.meta?.icon"
                                :size="15">
                                <component :is="item.meta.icon" />
                            </el-icon>
                            <el-icon
                                v-else
                                :size="15">
                                <neon-activity />
                            </el-icon>
                            <span class="text-nowrap">
                                {{ item.meta?.title }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="shrink-0 grid h-full"
            :class="affixTabs.length ? 'grid-cols-2' : 'grid-cols-1'">
            <el-dropdown
                ref="dropdown"
                v-if="affixTabs.length"
                :max-height="200"
                trigger="hover"
                @command="handleChangeTab">
                <div class="neon-tabs__tool">
                    <el-icon>
                        <ArrowDown />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            v-for="item in affixTabs"
                            :key="item.path"
                            :command="item.path"
                            class="group/tab !text-[var(--ne-muted-foreground)] !hover:text-[var(--ne-foreground)] !hover:bg-[var(--ne-accent)] !focus:bg-[var(--ne-accent)]">
                            <el-icon
                                v-if="item.meta?.icon"
                                :size="15">
                                <component :is="item.meta.icon" />
                            </el-icon>
                            <el-icon
                                v-else
                                :size="15">
                                <NeonActivity />
                            </el-icon>
                            <span>{{ item.meta.title }}</span>
                            <span
                                class="fx-center ml-2 w-[14px] h-[14px] rounded-full invisible group-hover/tab:visible hover:text-[var(--ne-foreground)] hover:bg-[var(--ne-accent)]"
                                @click.stop="removeTab(item.path, true)">
                                <neon-close class="size-3" />
                            </span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

            <div
                class="neon-tabs__tool"
                @click="reload">
                <el-icon>
                    <Refresh />
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    computed,
    useTemplateRef,
    watch,
    nextTick,
    inject,
    onMounted,
} from 'vue'
import { useElementSize, useResizeObserver, useDebounceFn } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { flatTree, tool } from '@/utils'
import useAuthStore from '@/stores/modules/auth'
import useTabsStore from '@/stores/modules/tabs'
import { HOME_PATH } from '@/config'

const { reload } = inject('reload')
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const tabsStore = useTabsStore()

const isFixed = ref(true)
const visibleLength = ref(0)
const visitedViews = computed(() => tabsStore.getVisitedViews)
const affixTabs = computed(() => tabsStore.getAffixTabs)

/** 计算tab列表 */
const tabBoxEl = useTemplateRef('tabBox')
const getVisibleLength = () => {
    const { width } = useElementSize(tabBoxEl)
    const minWidth = 120
    visibleLength.value = Math.floor(width.value / minWidth)
}

const getRoute = (route) => {
    const { name, meta, path } = route
    const omitMeta = tool.omit(meta, ['breadcrumb'])
    const routeItem = {
        name,
        meta: { ...omitMeta },
        path,
        closeIcon: path === HOME_PATH ? false : true,
    }
    return routeItem
}

/** 初始化tab */
const initTabs = () => {
    const tabs = flatTree(authStore.menuList)
    tabs.forEach((item) => {
        const tabItem = getRoute(item)

        // 默认当前路由
        if (item.path === HOME_PATH || item.path === route.path) {
            tabsStore.addTab(tabItem, visibleLength.value)
        }
    })
}

/** 添加tab */
const addTab = () => {
    const tabItem = getRoute(route)
    tabsStore.addTab(tabItem, visibleLength.value)
}

/** 设置当前tab */
const activeTab = ref(route.path ?? '')
const setActiveTab = () => {
    activeTab.value = route.path
}

/** tab切换 */
const dropdownEl = useTemplateRef('dropdown')
const dropdowntrigger = ref('hover')
const handleChangeTab = (path) => {
    dropdowntrigger.value = 'click'
    dropdownEl.value?.popperRef?.hide()
    setTimeout(() => {
        dropdowntrigger.value = 'hover'
    }, 10)
    router.push(path)
}

/** 更新可视数量 */
const updateTab = () => {
    const viw = visitedViews.value.length
    const vil = visibleLength.value
    const diff = viw > vil ? viw - vil : vil - viw
    const tabItem = getRoute(route)
    for (let i = 0; i < diff; i++) {
        if (i < visitedViews.value.length) {
            tabsStore.updateVisitedViews(tabItem, vil)
        }
    }
}

/** 关闭tab */
const removeTab = (path, affix = false) => {
    const index = tabsStore.getTabsList.filter(
        (item) => typeof item === 'object',
    ).length

    // 最后一个tab不能关闭
    if (index === 1) {
        return
    }

    tabsStore.removeTab(path, path === route.path, affix)

    nextTick(() => {
        isFixed.value = visitedViews.value.length === 1
    })
}

/**
 * * @description 监听路由
 */
watch(
    () => route.fullPath,
    async () => {
        setActiveTab()
        addTab()
    },
)

const debounceFn = useDebounceFn(() => {
    getVisibleLength()
    updateTab()
}, 0)

onMounted(() => {
    nextTick(() => {
        getVisibleLength()
        initTabs()
        setActiveTab(route.fullPath)
    })

    useResizeObserver(tabBoxEl, debounceFn)
})
</script>

<style lang="scss" scoped>
.neon-tabs-content {
    .neon-tabs__item {
        @apply min-w-[120px];
        .neon-tabs__name {
            @apply relative fx-center gap-[5px] h-full pl-1 mx-[14px] z-2 text-sm dark:text-[var(--ne-foreground)] duration-150;
        }
        &.is-active {
            .neon-tabs__background-content {
                @apply bg-[var(--ne-primary-light-9)] dark:bg-[var(--ne-accent)];
            }
            .neon-tabs__background-before,
            .neon-tabs__background-after {
                @apply fill-[var(--ne-primary-light-9)] dark:fill-[var(--ne-accent)];
            }
            .neon-tabs__name {
                @apply text-[var(--ne-primary)] dark:text-[var(--ne-foreground)];
            }
            .neon-tabs__close {
                @apply hover:bg-white dark:hover:bg-black;
            }
        }
        &:hover {
            &:not(.is-active) {
                .neon-tabs__background {
                    @apply pb-[2px];
                }
                .neon-tabs__background-content {
                    @apply mx-[2px] rounded-md bg-[var(--ne-accent)];
                }
            }
        }
    }
}

.neon-tabs__tool {
    @apply fx-center w-[35px] h-full border-l border-[var(--ne-border)] text-[var(--ne-foreground)] hover:text-gray-800 dark:hover:text-[var(--ne-foreground)] hover:bg-[var(--ne-accent)] transition-all cursor-pointer;
}
</style>
