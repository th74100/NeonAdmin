import { defineStore } from 'pinia'
import { PINIA_PREFIX, HOME_PATH } from '@/config'
import router from '@/router'

const tabsStore = defineStore('tabs', {
    persist: {
        enabled: true,
        key: `${PINIA_PREFIX}TABS`,
        storage: sessionStorage,
    },
    state: () => ({
        visitedViews: [],
        affixTabs: [],
    }),
    actions: {
        resetTabs() {
            this.visitedViews = []
            this.affixTabs = []
        },
        addTab(tab, maxTabs) {
            const index = this.visitedViews.findIndex(
                (view) => view.path === tab.path,
            )

            // 首页特殊处理
            if (tab.path === HOME_PATH && index === -1) {
                this.visitedViews.unshift(tab)
                return
            }

            if (index === -1) {
                // 超出最大tab数，移除最后一个
                if (this.visitedViews.length >= maxTabs) {
                    const removedTab = this.visitedViews.pop()
                    this.visitedViews.splice(maxTabs - 1, 0, tab)

                    // affixTabs同步处理
                    const affixIndex = this.affixTabs.findIndex(
                        (view) => view.path === tab.path,
                    )
                    if (affixIndex === -1) {
                        this.affixTabs.push(removedTab)
                    } else {
                        this.affixTabs.splice(affixIndex, 1)
                        this.affixTabs.splice(maxTabs - 1, 0, removedTab)
                    }
                } else {
                    this.visitedViews.splice(maxTabs, 0, tab)
                }
            } else {
                // 已存在，调整顺序
                if (index >= maxTabs) {
                    this.visitedViews.splice(maxTabs - 1, 1)
                    if (index === -1)
                        this.visitedViews.splice(maxTabs - 1, 0, tab)
                }
                if (index > maxTabs) {
                    this.visitedViews.splice(index, 1)
                }
            }
        },
        removeTab(path, isCurrent, affix = false) {
            //if (path === HOME_PATH) return

            if (this.affixTabs.length > 0) {
                if (!affix) {
                    const affixTab = this.affixTabs.shift()
                    if (affixTab) this.visitedViews.push(affixTab)
                } else {
                    const affixIndex = this.affixTabs.findIndex(
                        (item) => item.path === path,
                    )
                    if (affixIndex !== -1) this.affixTabs.splice(affixIndex, 1)
                }
            }

            const oldTabsList = [...this.visitedViews]
            this.visitedViews = this.visitedViews.filter(
                (item) => item.path !== path,
            )

            // 关闭当前tab时，自动跳转
            if (isCurrent) {
                const idx = oldTabsList.findIndex((item) => item.path === path)
                if (idx !== -1) {
                    const nextTab = oldTabsList[idx + 1] || oldTabsList[idx - 1]
                    if (nextTab) router.push(nextTab.path)
                }
            }
        },
        // 只保留当前tab
        closeManyTabs(tabPath) {
            this.visitedViews = this.visitedViews.filter(
                (item) => item.path === tabPath || !item.closeIcon,
            )
            this.affixTabs = []
        },
        // 关闭左/右侧tab
        closeSideTabs(path, direction) {
            const currentIndex = this.visitedViews.findIndex(
                (item) => item.path === path,
            )
            if (currentIndex !== -1) {
                const range =
                    direction === 'left'
                        ? [0, currentIndex]
                        : [currentIndex + 1, this.visitedViews.length]
                this.visitedViews = this.visitedViews.filter(
                    (item, idx) =>
                        idx < range[0] || idx >= range[1] || !item.closeIcon,
                )

                // 跳转逻辑
                if (direction === 'left') {
                    const prevTab = this.visitedViews.find(
                        (_, idx) =>
                            idx ===
                            this.visitedViews.findIndex((i) => i.path === path),
                    )
                    if (prevTab) router.push(prevTab.path)
                } else {
                    const nextTab =
                        this.visitedViews[currentIndex] ||
                        this.visitedViews[currentIndex + 1] ||
                        this.visitedViews[currentIndex - 1]
                    this.affixTabs = []
                    if (nextTab) router.push(nextTab.path)
                }
            }
        },
        updateVisitedViews(tab, maxTabs) {
            if (this.visitedViews.length < maxTabs) {
                const affixTab = this.affixTabs.shift()
                if (affixTab) {
                    const index = this.visitedViews.findIndex(
                        (view) => view.path === affixTab.path,
                    )
                    if (index === -1) this.visitedViews.push(affixTab)
                }
            } else if (this.visitedViews.length > maxTabs) {
                const index = this.visitedViews.findIndex(
                    (view) => view.path === tab.path,
                )
                if (index !== -1) {
                    if (index < this.visitedViews.length - 1 && index > 0) {
                        const lastView = this.visitedViews.pop()
                        this.affixTabs.unshift(lastView)
                    } else if (index === this.visitedViews.length - 1) {
                        const prevView = this.visitedViews.splice(index - 1, 1)
                        this.affixTabs.unshift(prevView[0])
                    }
                }
            }
        },
        show(path, type) {
            const tabs = [...this.visitedViews, ...this.affixTabs]
            const index = tabs.findIndex((item) => path === item.path)
            return type === 'left' ? index > 0 : index < tabs.length - 1
        },
    },
    getters: {
        getTabsList: (state) => [...state.visitedViews, ...state.affixTabs],
        getVisitedViews: (state) => state.visitedViews,
        getAffixTabs: (state) => state.affixTabs,
    },
})

export default tabsStore
