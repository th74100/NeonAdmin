import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// store 内部只用到 router.push 做跳转，这里用 mock 隔离掉整个路由依赖
vi.mock('@/router', () => ({
    default: { push: vi.fn() },
}))

const makeTab = (path) => ({
    name: path,
    path,
    meta: { title: path },
    fixate: false,
    closeIcon: true,
})

let useTabsStore

// 动态导入，确保上面的 vi.mock 先生效
beforeEach(async () => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    if (!useTabsStore) {
        ;({ default: useTabsStore } = await import('@/stores/modules/tabs'))
    }
})

describe('tabs store - activateAffixTab 位置对换', () => {
    it('与可见区末位标签对换，而不是 unshift 到队首', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b'), makeTab('/c')]
        store.affixTabs = [makeTab('/x'), makeTab('/y'), makeTab('/z')]

        // 点击隐藏在第二位的 /y
        store.activateAffixTab('/y')

        // /y 进入可见区，占据原末位槽位
        expect(store.visitedViews.map((t) => t.path)).toEqual([
            '/a',
            '/b',
            '/y',
        ])
        // /c 被挤出，占据 /y 原来的槽位（索引 1），隐藏区其余顺序不变
        expect(store.affixTabs.map((t) => t.path)).toEqual([
            '/x',
            '/c',
            '/z',
        ])
    })

    it('点击隐藏区队首标签时同样按槽位对换', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.affixTabs = [makeTab('/x'), makeTab('/y')]

        store.activateAffixTab('/x')

        expect(store.visitedViews.map((t) => t.path)).toEqual(['/a', '/x'])
        expect(store.affixTabs.map((t) => t.path)).toEqual(['/b', '/y'])
    })

    it('可见区为空时直接移入隐藏区标签', () => {
        const store = useTabsStore()

        store.visitedViews = []
        store.affixTabs = [makeTab('/x'), makeTab('/y')]

        store.activateAffixTab('/y')

        expect(store.visitedViews.map((t) => t.path)).toEqual(['/y'])
        expect(store.affixTabs.map((t) => t.path)).toEqual(['/x'])
    })

    it('点击的不是隐藏区标签时不做任何改动', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.affixTabs = [makeTab('/x')]

        store.activateAffixTab('/a')

        expect(store.visitedViews.map((t) => t.path)).toEqual(['/a', '/b'])
        expect(store.affixTabs.map((t) => t.path)).toEqual(['/x'])
    })
})