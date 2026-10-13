import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import NeonForm from '@/components/NeonForm/index.vue'

const mountForm = (props = {}) =>
    mount(NeonForm, {
        global: { plugins: [ElementPlus] },
        props: {
            modelValue: { a: '', b: '' },
            schema: [{ label: 'A', key: 'a' }],
            ...props,
        },
    })

/** 按钮列始终是模板中最后一个 el-col（若有） */
const getButtonCol = (wrapper) => wrapper.findAll('.el-col').at(-1)

describe('NeonForm 基线', () => {
    it('渲染 schema 中未隐藏的字段', () => {
        const wrapper = mount(NeonForm, {
            global: { plugins: [ElementPlus] },
            props: {
                modelValue: { a: '' },
                schema: [
                    { label: 'A', key: 'a' },
                    { label: 'B', key: 'b', hidden: true },
                ],
            },
        })
        const labels = wrapper
            .findAll('.el-form-item__label')
            .map((n) => n.text())
        // 只保留非隐藏字段：A 渲染，hidden 的 B 被过滤
        expect(labels).toContain('A')
        expect(labels).not.toContain('B')
    })

    it('按钮行默认渲染提交与重置按钮', () => {
        const wrapper = mount(NeonForm, {
            global: { plugins: [ElementPlus] },
            props: {
                modelValue: { a: '' },
                schema: [{ label: 'A', key: 'a' }],
            },
        })
        expect(wrapper.text()).toContain('提交')
        expect(wrapper.text()).toContain('重置')
    })
})

describe('NeonForm 栅格布局', () => {
    it('默认每个字段独占一列（span=24）', () => {
        const wrapper = mountForm({
            modelValue: { a: '', b: '' },
            schema: [
                { label: 'A', key: 'a' },
                { label: 'B', key: 'b' },
            ],
        })
        const cols = wrapper.findAll('.el-col')
        // 两个字段列 + 一个按钮列
        expect(cols.length).toBe(3)
        expect(cols[0].classes()).toContain('el-col-24')
        expect(cols[1].classes()).toContain('el-col-24')
        expect(cols[0].find('.el-form-item').exists()).toBe(true)
    })

    it('commonConfig.col = { span: 12 } 应用到每个字段列', () => {
        const wrapper = mountForm({
            commonConfig: { col: { span: 12 } },
            modelValue: { a: '', b: '' },
            schema: [
                { label: 'A', key: 'a' },
                { label: 'B', key: 'b' },
            ],
        })
        const cols = wrapper.findAll('.el-col')
        expect(cols[0].classes()).toContain('el-col-12')
        expect(cols[1].classes()).toContain('el-col-12')
    })

    it('item.col 覆盖全局 col 配置', () => {
        const wrapper = mountForm({
            commonConfig: { col: { span: 12 } },
            modelValue: { a: '', b: '' },
            schema: [
                { label: 'A', key: 'a', col: { span: 24 } },
                { label: 'B', key: 'b' },
            ],
        })
        const cols = wrapper.findAll('.el-col')
        expect(cols[0].classes()).toContain('el-col-24')
        expect(cols[1].classes()).toContain('el-col-12')
    })

    it('按钮列默认为 el-col-24（独占一行）', () => {
        const wrapper = mountForm()
        const buttonCol = getButtonCol(wrapper)
        expect(buttonCol.exists()).toBe(true)
        expect(buttonCol.classes()).toContain('el-col-24')
    })

    it('buttonCol 对象透传原生 span', () => {
        const wrapper = mountForm({
            commonConfig: { buttonCol: { span: 8 } },
        })
        const buttonCol = getButtonCol(wrapper)
        expect(buttonCol.classes()).toContain('el-col-8')
    })

    it("buttonCol='auto' 使用 flex-auto 吃掉剩余空间", () => {
        const wrapper = mountForm({
            commonConfig: { buttonCol: 'auto' },
        })
        const buttonCol = getButtonCol(wrapper)
        expect(buttonCol.exists()).toBe(true)
        // 类名含 !，用 class 列表 + html 双重断言
        expect(buttonCol.classes()).toContain('!flex-auto')
        expect(wrapper.html()).toContain('!flex-auto')
    })

    it('item.col 不会作为属性透传到真实输入组件', () => {
        const wrapper = mountForm({
            schema: [{ label: 'A', key: 'a', col: { span: 12 } }],
        })
        const input = wrapper.find('input')
        expect(input.exists()).toBe(true)
        expect(input.attributes('col')).toBeUndefined()
        expect(wrapper.find('.el-input').attributes('col')).toBeUndefined()
        expect(wrapper.html()).not.toContain('[object Object]')
    })

    it("buttonAlign='center' 时按钮容器居中", () => {
        const wrapper = mountForm({
            commonConfig: { buttonAlign: 'center' },
        })
        const container = wrapper.find('.el-form-item__content > .flex')
        expect(container.exists()).toBe(true)
        expect(container.classes()).toContain('justify-center')
    })

    it("buttonAlign='start' 时按钮容器左对齐", () => {
        const wrapper = mountForm({
            commonConfig: { buttonAlign: 'start' },
        })
        const container = wrapper.find('.el-form-item__content > .flex')
        expect(container.exists()).toBe(true)
        expect(container.classes()).toContain('justify-start')
    })

    it('三个按钮全部隐藏时不渲染按钮列', () => {
        const wrapper = mountForm({
            commonConfig: {
                submitButtonOptions: { show: false },
                resetButtonOptions: { show: false },
                cancelButtonOptions: { show: false },
            },
        })
        // 仅剩字段列
        expect(wrapper.findAll('.el-col').length).toBe(1)
        expect(wrapper.find('.el-button').exists()).toBe(false)
    })
})
