import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import ElementPlus from 'element-plus'
import NeonTable from '@/components/NeonTable/index.vue'

// el-table 的列注册发生在子组件 mounted 之后，属异步行为，因此挂载后需要 flush 若干次 nextTick 才能拿到完整表头与单元格。
const mountTable = async (props = {}, slots = {}) => {
    const wrapper = mount(NeonTable, {
        global: { plugins: [ElementPlus] },
        props: {
            columns: [],
            dataSource: [],
            ...props,
        },
        slots,
    })
    await nextTick()
    await nextTick()
    return wrapper
}

const getHeaderLabels = (wrapper) =>
    wrapper
        .findAll('.el-table__header-wrapper th .cell')
        .map((node) => node.text())

const getBodyRows = (wrapper) =>
    wrapper.findAll('.el-table__body-wrapper tbody tr')

describe('NeonTable 基线', () => {
    it('表头按 columns 的 label 渲染', async () => {
        const wrapper = await mountTable({
            columns: [
                { prop: 'name', label: '姓名' },
                { prop: 'age', label: '年龄' },
            ],
        })

        expect(getHeaderLabels(wrapper)).toEqual(['姓名', '年龄'])
    })

    it('默认取 row[prop] 渲染单元格', async () => {
        const wrapper = await mountTable({
            columns: [{ prop: 'name', label: '姓名' }],
            dataSource: [{ id: 1, name: '张三' }],
        })

        expect(getBodyRows(wrapper).length).toBe(1)
        expect(getBodyRows(wrapper)[0].text()).toContain('张三')
    })

    it('formatter(row) 生效', async () => {
        const wrapper = await mountTable({
            columns: [
                {
                    prop: 'status',
                    label: '状态',
                    formatter: (row) => `状态-${row.status}`,
                },
            ],
            dataSource: [{ id: 1, status: '启用' }],
        })

        expect(getBodyRows(wrapper)[0].text()).toContain('状态-启用')
    })

    it('render({ row, index }) 生效', async () => {
        const wrapper = await mountTable({
            columns: [
                {
                    prop: 'name',
                    label: '姓名',
                    render: ({ row, index }) =>
                        h(
                            'span',
                            { class: 'render-cell' },
                            `${index}-${row.name}`,
                        ),
                },
            ],
            dataSource: [{ id: 1, name: '张三' }],
        })

        const cell = wrapper.find('.render-cell')
        expect(cell.exists()).toBe(true)
        expect(cell.text()).toBe('0-张三')
    })

    it('slot 具名插槽渲染自定义单元格且作用域包含 row', async () => {
        const wrapper = await mountTable(
            {
                columns: [{ prop: 'name', label: '姓名', slot: 'name' }],
                dataSource: [{ id: 1, name: '张三' }],
            },
            {
                name: ({ row }) =>
                    h('span', { class: 'slot-cell' }, `插槽-${row.name}`),
            },
        )

        // hidden-columns 中也会渲染一次插槽占位，因此只断言真实 body 区域。
        const cell = wrapper.find('.el-table__body-wrapper .slot-cell')
        expect(cell.exists()).toBe(true)
        expect(cell.text()).toBe('插槽-张三')
    })

    it('type=index 按分页连续编号', async () => {
        const wrapper = await mountTable({
            columns: [{ type: 'index', label: '序号' }],
            dataSource: [{ id: 1, name: '张三' }],
            options: {
                pagination: { currentPage: 2, pageSize: 10 },
            },
        })

        expect(getBodyRows(wrapper).length).toBe(1)
        expect(getBodyRows(wrapper)[0].find('td').text()).toBe('11')
    })

    it('type=selection 渲染复选框', async () => {
        const wrapper = await mountTable({
            columns: [{ type: 'selection' }],
            dataSource: [{ id: 1, name: '张三' }],
        })

        expect(
            wrapper.find('.el-table__header-wrapper .el-checkbox').exists(),
        ).toBe(true)
        expect(
            wrapper.find('.el-table__body-wrapper .el-checkbox').exists(),
        ).toBe(true)
    })

    it('默认渲染分页', async () => {
        const wrapper = await mountTable()

        expect(wrapper.find('.el-pagination').exists()).toBe(true)
    })

    it('options.pagination.showPagination=false 时不渲染分页', async () => {
        const wrapper = await mountTable({
            options: { pagination: { showPagination: false } },
        })

        expect(wrapper.find('.el-pagination').exists()).toBe(false)
    })

    it('options 透传 border/stripe 到 el-table', async () => {
        const wrapper = await mountTable({
            options: { border: true, stripe: true },
        })
        const table = wrapper.find('.el-table')

        expect(table.classes()).toContain('el-table--border')
        expect(table.classes()).toContain('el-table--striped')
    })

    it('触发 current-change 时按契约派发事件', async () => {
        const wrapper = await mountTable()
        const pagination = wrapper.findComponent({ name: 'ElPagination' })

        expect(pagination.exists()).toBe(true)
        pagination.vm.$emit('current-change', 2)
        await nextTick()

        expect(wrapper.emitted('currentChange')).toEqual([[2]])
        expect(wrapper.emitted('paginationChange')).toEqual([[2, 30]])
    })

    it('触发 size-change 时按契约派发事件', async () => {
        const wrapper = await mountTable()
        const pagination = wrapper.findComponent({ name: 'ElPagination' })

        expect(pagination.exists()).toBe(true)
        pagination.vm.$emit('size-change', 20)
        await nextTick()

        expect(wrapper.emitted('sizeChange')).toEqual([[20]])
        expect(wrapper.emitted('paginationChange')).toEqual([[1, 20]])
    })

    it('空数据时展示暂无数据', async () => {
        const wrapper = await mountTable()

        expect(wrapper.find('.el-table__empty-block').exists()).toBe(true)
        expect(wrapper.find('.el-table__empty-block').text()).toContain(
            '暂无数据',
        )
    })
})
