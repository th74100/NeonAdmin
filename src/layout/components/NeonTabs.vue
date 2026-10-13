<template>
    <div
        class="flex items-center h-[38px] border-b border-default bg-[var(--ne-header)]">
        <div
            ref="tabBox"
            class="flex flex-1 pt-[3px] h-full overflow-hidden">
            <div
                ref="tabList"
                class="neon-tabs-content flex w-max h-full pr-6 overflow-hidden">
                <div
                    v-for="item in visitedViews"
                    :key="item.path"
                    :class="[
                        { 'is-active': item.path === activeTab },
                        { 'affix-tab': item.fixate },
                    ]"
                    @click="handleChangeTab(item.path)"
                    @contextmenu.prevent="handleContextMenu($event, item)"
                    class="neon-tabs__item draggable shrink-0 relative -mr-3 flex items-center h-full select-none cursor-pointer">
                    <div class="relative wh-full px-1">
                        <div
                            class="neon-tabs__background absolute z-[1] wh-full px-[6px]">
                            <div
                                class="neon-tabs__background-content h-full rounded-tl-md rounded-tr-md duration-150" />
                            <NeonSvg
                                name="ne-corner-before"
                                width="8px"
                                height="8px"
                                class="neon-tabs__background-before -left-[1px]" />
                            <NeonSvg
                                name="ne-corner-after"
                                width="8px"
                                height="8px"
                                class="neon-tabs__background-after -right-[1px]" />
                        </div>
                        <div
                            v-if="visitedViews.length > 1"
                            class="absolute right-[10px] top-1/2 z-[3] size-4 -translate-y-[50%]">
                            <neon-fixed
                                v-if="item.fixate"
                                class="mt-[2px] size-3.2 cursor-pointer rounded-full transition-all"
                                @click.stop="item.fixate = false" />
                            <neon-close
                                v-else
                                @click.stop="removeTab(item.path)"
                                class="neon-tabs__close mt-[2px] size-3 cursor-pointer rounded-full transition-all" />
                        </div>
                        <div
                            class="neon-tabs__name"
                            :class="{
                                'pr-4': visitedViews.length > 1,
                            }">
                            <el-icon
                                v-if="item.meta?.icon"
                                :size="15">
                                <component :is="item.meta?.icon" />
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

    <!--右键菜单-->
    <transition name="fade-left">
        <div
            v-if="chooseItem"
            class="context-menu group">
            <div
                class="context-menu__item"
                :data-disabled="isDisabled(chooseItem, 'close')"
                @click="handleCloseCurrentTab(chooseItem.path)">
                <el-icon>
                    <Close />
                </el-icon>
                <span>关闭</span>
            </div>
            <div
                class="context-menu__item"
                :data-disabled="visitedViews.length <= 1"
                @click="chooseItem.fixate = !chooseItem.fixate">
                <el-icon>
                    <NeonPushpin />
                </el-icon>
                <span>{{ chooseItem.fixate ? '取消固定' : '固定' }}</span>
            </div>
            <div
                class="context-menu__item"
                :data-disabled="isDisabled(chooseItem, 'reload')"
                @click="reload">
                <el-icon>
                    <Refresh />
                </el-icon>
                <span>重新加载</span>
            </div>
            <div
                class="context-menu__item"
                @click="handleOpenTab(chooseItem.path)">
                <el-icon>
                    <NeonTarget />
                </el-icon>
                <span>在新窗口打开</span>
            </div>
            <div class="border-t border-default my-1"></div>
            <div
                class="context-menu__item"
                :data-disabled="isDisabled(chooseItem, 'left')"
                @click="handleCloseTab(chooseItem.path, 'left')">
                <el-icon>
                    <NeonLeft />
                </el-icon>
                <span>关闭左侧标签页</span>
            </div>
            <div
                class="context-menu__item"
                :data-disabled="isDisabled(chooseItem, 'right')"
                @click="handleCloseTab(chooseItem.path, 'right')">
                <el-icon>
                    <NeonRight />
                </el-icon>
                <span>关闭右侧标签页</span>
            </div>
            <div class="border-t border-default my-1"></div>
            <div
                class="context-menu__item"
                :data-disabled="isDisabled(chooseItem, 'closeOther')"
                @click="handleCloseOtherTab">
                <el-icon>
                    <Remove />
                </el-icon>
                <span>关闭其他标签页</span>
            </div>
            <div
                class="context-menu__item"
                :data-disabled="isDisabled(chooseItem)"
                @click="handleCloseTabAll">
                <el-icon>
                    <CircleClose />
                </el-icon>
                <span>关闭全部标签页</span>
            </div>
        </div>
    </transition>
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
import { useResizeObserver, useDebounceFn } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import Sortable from 'sortablejs'
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
const visitedViews = computed(() => {
    const tabs = tabsStore.getVisitedViews

    tabs.sort((a, b) => {
        return !!b.fixate - !!a.fixate
    })
    return tabs
})
const affixTabs = computed(() => tabsStore.getAffixTabs)

/** tab */
const tabBoxEl = useTemplateRef('tabBox')
const tabListEl = useTemplateRef('tabList')

/** tab 最小宽度，与样式 min-w-[120px] 保持一致，仅用于首屏无 tab 可测时的兜底估算 */
const TAB_MIN_WIDTH = 120

/** 计算可以放下多少个tab */
const getVisibleLength = () => {
    const box = tabBoxEl.value
    const list = tabListEl.value
    if (!box || !list) return

    // 可用宽度 = 容器宽度 - tabList 的右内边距
    const paddingRight = parseFloat(getComputedStyle(list).paddingRight) || 0
    const available = box.clientWidth - paddingRight
    if (available <= 0) return

    const items = [...list.querySelectorAll('.neon-tabs__item')]

    // 首屏还没有渲染出 tab，退化为按最小宽度估算
    if (!items.length) {
        visibleLength.value = Math.max(
            1,
            Math.floor(available / TAB_MIN_WIDTH),
        )
        return
    }

    // 以第一个 tab 的左边缘为基准，按真实占位宽度累加（含相邻 tab 的负边距）
    const startLeft = items[0].getBoundingClientRect().left
    let count = 0

    for (const item of items) {
        if (item.getBoundingClientRect().right - startLeft > available) break
        count += 1
    }

    // 已渲染的 tab 全部放得下时，用平均宽度估算还能再容纳几个
    if (count === items.length && count > 0) {
        const totalWidth =
            items[count - 1].getBoundingClientRect().right - startLeft
        count = Math.floor(available / (totalWidth / count))
    }

    visibleLength.value = Math.max(1, count)
}

/** 获取路由 */
const getRoute = (route) => {
    const { name, meta, path } = route
    const omitMeta = tool.omit(meta, ['breadcrumb'])
    const routeItem = {
        name,
        meta: { ...omitMeta },
        path,
        fixate: path === HOME_PATH ? true : false,
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

    // 点击的是隐藏区标签时，与可见区末位标签做位置对换
    tabsStore.activateAffixTab(path)

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

/** 监听路由 */
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

/** 右键菜单 */
const chooseItem = ref(null)
const handleContextMenu = async (e, item) => {
    chooseItem.value = item

    await nextTick()

    const contextMenu = document.querySelector('.context-menu')

    // 阻止默认右键菜单
    e.preventDefault()

    if (contextMenu != null) {
        // 设置 card 的位置为鼠标点击位置
        contextMenu.style.display = 'block'
        contextMenu.style.left = e.pageX + 'px'
        contextMenu.style.top = e.pageY + 'px'

        const _hideContextMenu = () => {
            if (contextMenu !== null) {
                contextMenu.style.display = 'none'
                chooseItem.value = null
            }
            window.removeEventListener('click', _hideContextMenu)
        }

        window.addEventListener('click', _hideContextMenu)
    }

    e.stopPropagation()
}

/** 右键菜单关闭左右标签页是否disabled状态 */
const isDisabled = (item, type) => {
    const { path, fixate } = item
    const tabs = [...visitedViews.value, ...affixTabs.value]
    const index = tabs.findIndex((item) => path === item.path)

    // 判断当前当前标签页的上一级是否是固定标签页
    const isLeftTabs = tabs[index - 1]?.fixate ?? false

    // 判断当前当前标签页的下一级是否是固定标签页
    const isRightTabs = tabs[index + 1]?.fixate ?? false

    // 关闭
    if (type === 'close') {
        return fixate || visitedViews.value.length <= 1
    }

    // 重新加载
    if (type === 'reload') {
        return path !== route.path
    }

    // 关闭左侧标签页
    if (type === 'left') {
        if (index === 0) return true
        return index > 0 && isLeftTabs
    }

    // 关闭右侧标签页
    if (type === 'right') {
        if (index === 0) return true
        return index >= tabs.length - 1 || isRightTabs
    }

    // 关闭其他标签页
    if (type === 'closeOther') {
        if (tabs.length === 1) return true
        return path !== route.path || isLeftTabs
    }

    // 关闭全部标签页
    return tabs.length <= 1
}

/** 关闭单个标签 */
const handleCloseCurrentTab = () => {
    if (chooseItem.value) {
        tabsStore.removeTab(chooseItem.value.path, true)
        return
    }
    tabsStore.removeTab(route.path)
}

/** 在新窗口打开 */
const handleOpenTab = (path) => window.open(path)

/** 关闭左侧/右侧标签 */
const handleCloseTab = async (path, direction) => {
    tabsStore.closeSideTabs(path, direction)
    await nextTick()
    updateTab()
}

/** 关闭其他标签页 */
const handleCloseOtherTab = () => {
    if (chooseItem.value) {
        tabsStore.closeManyTabs(chooseItem.value.path)
        return
    }

    tabsStore.closeManyTabs(route.path)
}

/** 关闭全部标签页 */
const handleCloseTabAll = () => {
    tabsStore.closeManyTabs()
    router.push(HOME_PATH)
}

const checkClass = (el) => {
    const defaultEl = 'neon-tabs__item'
    return el.classList.contains(defaultEl) ? el : el.closest(`.${defaultEl}`)
}

const createSortable = () =>
    Sortable.create(tabListEl.value, {
        animation: 350,
        onMove: (evt) => {
            const classItem = checkClass(evt.related)
            if (
                classItem != null &&
                classItem.classList.contains('draggable')
            ) {
                const dragged = evt.dragged.classList.contains('affix-tab')
                const related = evt.related.classList.contains('affix-tab')
                return dragged === related
            }
            return false
        },
        onEnd: (evt) => {
            const {
                newIndex,
                oldIndex,
                originalEvent: { srcElement },
            } = evt

            if (!srcElement) {
                return
            }

            const classItem = checkClass(srcElement)

            if (!classItem) {
                return
            }

            if (!classItem.classList.contains('draggable')) {
                return
            }

            const moveTab = tabsStore.visitedViews.splice(oldIndex, 1)[0]
            tabsStore.updateSortable(newIndex, moveTab)
        },
    })

onMounted(() => {
    nextTick(() => {
        getVisibleLength()
        initTabs()
        setActiveTab(route.fullPath)

        // initTabs 之后 DOM 才出现真实 tab，再测一次容量并收敛标签数量，
        // 避免沿用首屏无 tab 可测时的兜底估算值
        nextTick(() => {
            getVisibleLength()
            updateTab()
        })
    })

    useResizeObserver(tabBoxEl, debounceFn)

    nextTick(() => createSortable())
})
</script>

<style lang="scss" scoped>
.neon-tabs-content {
    .neon-tabs__item {
        @apply min-w-[120px];
        .neon-tabs__name {
            @apply relative fx-center gap-[5px] h-full pl-1 mx-[14px] z-2 text-sm dark:text-[var(--ne-foreground)] duration-150;
        }
        .neon-tabs__background-before,
        .neon-tabs__background-after {
            @apply absolute bottom-0 fill-transparent transition-all duration-150;
        }
        &.is-active {
            .neon-tabs__background-content {
                @apply bg-[var(--ne-primary-light-9)];
            }
            .neon-tabs__background-before,
            .neon-tabs__background-after {
                @apply fill-[var(--ne-primary-light-9)];
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

.context-menu {
    @apply absolute z-10 py-1 text-sm text-[var(--neon-foreground)] dark:text-[var(--ne-muted-foreground)] rounded-md shadow-md border border-[var(--ne-border)] bg-white dark:bg-[var(--ne-card)] hidden;
    .context-menu__item {
        @apply fx-start gap-[5px] py-1 px-3 mx-1 leading-7 rounded-md data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 hover:bg-[var(--ne-accent)] transition-all cursor-pointer;
    }
}
</style>
