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

        /** 添加标签页 */
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
            } else if (index >= maxTabs) {
                // 已存在但落在可见容量之外：移到容量内，把被顶掉的标签放回隐藏区，
                // 不再删除无关标签，也不改变隐藏区既有顺序
                const [moved] = this.visitedViews.splice(index, 1)
                const [pushedOut] = this.visitedViews.splice(
                    maxTabs - 1,
                    1,
                    moved,
                )
                if (pushedOut) this.affixTabs.push(pushedOut)
            }
        },

        /** 移除标签页 */
        removeTab(path, isCurrent, affix = false) {
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

        /** 关闭所有，只保留当前tab */
        closeManyTabs(tabPath) {
            this.visitedViews = this.visitedViews.filter(
                (item) => item.path === tabPath || !item.closeIcon,
            )
            this.affixTabs = []
        },

        /** 关闭左/右侧tab */
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

        /** 更新VisitedViews */
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
                    // 收敛到 maxTabs，并让被挤出的标签排到隐藏区末尾
                    if (index === this.visitedViews.length - 1) {
                        const prevView = this.visitedViews.splice(index - 1, 1)
                        this.affixTabs.push(prevView[0])
                    } else {
                        const lastView = this.visitedViews.pop()
                        this.affixTabs.push(lastView)
                    }
                }
            }
        },

        /**
         * 激活隐藏区(affixTabs)中的标签：与可见区末位标签做位置对换。
         * 被挤出的标签占用被点进来标签原来的位置，进入可见区末位。
         */
        activateAffixTab(path) {
            const affixIndex = this.affixTabs.findIndex(
                (item) => item.path === path,
            )

            // 不在隐藏区（点击的是可见区标签），无需处理
            if (affixIndex === -1) return

            // 可见区为空时直接移入
            if (!this.visitedViews.length) {
                this.visitedViews.push(this.affixTabs.splice(affixIndex, 1)[0])
                return
            }

            const lastIndex = this.visitedViews.length - 1
            const incoming = this.affixTabs[affixIndex]
            const outgoing = this.visitedViews[lastIndex]

            // 位置对换：双方各占对方原来的槽位
            this.visitedViews.splice(lastIndex, 1, incoming)
            this.affixTabs.splice(affixIndex, 1, outgoing)
        },

        updateSortable(index, tab) {
            this.visitedViews.splice(index, 0, tab)
        },
    },
    getters: {
        getTabsList: (state) => [...state.visitedViews, ...state.affixTabs],
        getVisitedViews: (state) => state.visitedViews,
        getAffixTabs: (state) => state.affixTabs,
    },
})

export default tabsStore
