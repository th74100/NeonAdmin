import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { HOME_PATH } from '@/config'

// store 内部只用到 router.push 做跳转，这里用 mock 隔离掉整个路由依赖
vi.mock('@/router', () => ({
    default: { push: vi.fn() },
}))

const makeTab = (path, extra = {}) => ({
    name: path,
    path,
    meta: { title: path },
    fixate: false,
    closeIcon: true,
    ...extra,
})

/** 固定标签：fixate 为真且没有关闭按钮 */
const makeFixedTab = (path) => makeTab(path, { fixate: true, closeIcon: false })

const paths = (list) => list.map((item) => item.path)

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
        expect(paths(store.visitedViews)).toEqual(['/a', '/b', '/y'])
        // /c 被挤出，占据 /y 原来的槽位（索引 1），隐藏区其余顺序不变
        expect(paths(store.affixTabs)).toEqual(['/x', '/c', '/z'])
    })

    it('点击隐藏区队首标签时同样按槽位对换', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.affixTabs = [makeTab('/x'), makeTab('/y')]

        store.activateAffixTab('/x')

        expect(paths(store.visitedViews)).toEqual(['/a', '/x'])
        expect(paths(store.affixTabs)).toEqual(['/b', '/y'])
    })

    it('可见区为空时直接移入隐藏区标签', () => {
        const store = useTabsStore()

        store.visitedViews = []
        store.affixTabs = [makeTab('/x'), makeTab('/y')]

        store.activateAffixTab('/y')

        expect(paths(store.visitedViews)).toEqual(['/y'])
        expect(paths(store.affixTabs)).toEqual(['/x'])
    })

    it('点击的不是隐藏区标签时不做任何改动', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.affixTabs = [makeTab('/x')]

        store.activateAffixTab('/a')

        expect(paths(store.visitedViews)).toEqual(['/a', '/b'])
        expect(paths(store.affixTabs)).toEqual(['/x'])
    })
})

describe('tabs store - addTab', () => {
    it('新增标签插入到 visitedViews', () => {
        const store = useTabsStore()

        store.addTab(makeTab('/a'), 5)

        expect(paths(store.visitedViews)).toEqual(['/a'])
    })

    it('重复 path 不重复添加', () => {
        const store = useTabsStore()

        store.addTab(makeTab('/a'), 5)
        store.addTab(makeTab('/a'), 5)

        expect(paths(store.visitedViews)).toEqual(['/a'])
    })

    it('HOME_PATH 首次加入时 unshift 到队首', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.addTab(makeTab(HOME_PATH), 5)

        expect(paths(store.visitedViews)).toEqual([HOME_PATH, '/a', '/b'])
    })

    it('超出 maxTabs 时移除末位并把被移除的标签放入 affixTabs', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.addTab(makeTab('/c'), 2)

        expect(paths(store.visitedViews)).toEqual(['/a', '/c'])
        expect(paths(store.affixTabs)).toEqual(['/b'])
    })

    it('已存在的标签索引超出 maxTabs 时移入可见区且不删除无关标签', () => {
        const store = useTabsStore()

        store.visitedViews = [
            makeTab('/a'),
            makeTab('/b'),
            makeTab('/c'),
            makeTab('/d'),
        ]
        store.addTab(makeTab('/d'), 2)

        // /d 被移到 maxTabs-1 位置，原位置上的 /b 被顶到隐藏区，无标签被删除
        expect(paths(store.visitedViews)).toEqual(['/a', '/d', '/c'])
        expect(paths(store.affixTabs)).toEqual(['/b'])
    })
})

describe('tabs store - removeTab', () => {
    it('移除指定 path', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b'), makeTab('/c')]
        store.removeTab('/b')

        expect(paths(store.visitedViews)).toEqual(['/a', '/c'])
    })

    it('affixTabs 非空且 affix=false 时从隐藏区头部补回一个', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.affixTabs = [makeTab('/x'), makeTab('/y')]
        store.removeTab('/a')

        expect(paths(store.visitedViews)).toEqual(['/b', '/x'])
        expect(paths(store.affixTabs)).toEqual(['/y'])
    })

    it('affix=true 时只按 path 从 affixTabs 移除，不回填', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.affixTabs = [makeTab('/x'), makeTab('/c')]
        store.removeTab('/c', false, true)

        expect(paths(store.visitedViews)).toEqual(['/a', '/b'])
        expect(paths(store.affixTabs)).toEqual(['/x'])
    })
})

describe('tabs store - closeManyTabs', () => {
    it('只保留指定标签与固定标签，并清空 affixTabs', () => {
        const store = useTabsStore()

        store.visitedViews = [
            makeFixedTab(HOME_PATH),
            makeTab('/a'),
            makeTab('/b'),
        ]
        store.affixTabs = [makeTab('/x')]
        store.closeManyTabs('/a')

        expect(paths(store.visitedViews)).toEqual([HOME_PATH, '/a'])
        expect(store.affixTabs).toEqual([])
    })
})

describe('tabs store - closeSideTabs', () => {
    it('关闭左侧时保留自身与固定标签', () => {
        const store = useTabsStore()

        store.visitedViews = [
            makeFixedTab('/home'),
            makeTab('/a'),
            makeTab('/b'),
            makeTab('/c'),
        ]
        store.closeSideTabs('/b', 'left')

        expect(paths(store.visitedViews)).toEqual(['/home', '/b', '/c'])
    })

    it('关闭右侧时保留自身与固定标签并清空 affixTabs', () => {
        const store = useTabsStore()

        store.visitedViews = [
            makeFixedTab('/home'),
            makeTab('/a'),
            makeTab('/b'),
            makeTab('/c'),
        ]
        store.affixTabs = [makeTab('/x')]
        store.closeSideTabs('/b', 'right')

        expect(paths(store.visitedViews)).toEqual(['/home', '/a', '/b'])
        expect(store.affixTabs).toEqual([])
    })
})

describe('tabs store - updateVisitedViews', () => {
    it('可见区不足时从 affixTabs 头部补一个', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a')]
        store.affixTabs = [makeTab('/x'), makeTab('/y')]
        store.updateVisitedViews(makeTab('/a'), 3)

        expect(paths(store.visitedViews)).toEqual(['/a', '/x'])
        expect(paths(store.affixTabs)).toEqual(['/y'])
    })

    it('可见区超出时把末位标签移入 affixTabs', () => {
        const store = useTabsStore()

        store.visitedViews = [
            makeTab('/a'),
            makeTab('/b'),
            makeTab('/c'),
            makeTab('/d'),
        ]
        store.updateVisitedViews(makeTab('/c'), 3)

        expect(paths(store.visitedViews)).toEqual(['/a', '/b', '/c'])
        expect(paths(store.affixTabs)).toEqual(['/d'])
    })

    it('目标标签位于首位且超出容量时也应收敛到 maxTabs', () => {
        const store = useTabsStore()

        store.visitedViews = [
            makeTab('/a'),
            makeTab('/b'),
            makeTab('/c'),
            makeTab('/d'),
        ]
        store.updateVisitedViews(makeTab('/a'), 3)

        expect(store.visitedViews.length).toBe(3)
        expect(paths(store.visitedViews)).toEqual(['/a', '/b', '/c'])
        expect(paths(store.affixTabs)).toEqual(['/d'])
    })
})

describe('tabs store - 其他', () => {
    it('updateSortable 在指定位置插入标签', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a'), makeTab('/b')]
        store.updateSortable(1, makeTab('/x'))

        expect(paths(store.visitedViews)).toEqual(['/a', '/x', '/b'])
    })

    it('resetTabs 清空两个数组', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a')]
        store.affixTabs = [makeTab('/x')]
        store.resetTabs()

        expect(store.visitedViews).toEqual([])
        expect(store.affixTabs).toEqual([])
    })

    it('getters 返回预期的标签集合', () => {
        const store = useTabsStore()

        store.visitedViews = [makeTab('/a')]
        store.affixTabs = [makeTab('/x')]

        expect(paths(store.getTabsList)).toEqual(['/a', '/x'])
        expect(paths(store.getVisitedViews)).toEqual(['/a'])
        expect(paths(store.getAffixTabs)).toEqual(['/x'])
    })
})