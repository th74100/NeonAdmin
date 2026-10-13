import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import NeonContainer from '@/components/NeonContainer/index.vue'

const mountContainer = (slots = {}) =>
    mount(NeonContainer, {
        global: { plugins: [ElementPlus] },
        slots,
    })

// header / footer 容器只有 tailwind arbitrary class，需转义方括号后才能作为 CSS 选择器。
const findHeader = (wrapper) => wrapper.find('.py-\\[18px\\]')
const findFooter = (wrapper) => wrapper.find('.pt-\\[15px\\]')

describe('NeonContainer 基线', () => {
    it('未提供任何插槽时不渲染 header / footer，且渲染 el-scrollbar', () => {
        const wrapper = mountContainer()

        expect(findHeader(wrapper).exists()).toBe(false)
        expect(findFooter(wrapper).exists()).toBe(false)
        expect(wrapper.find('.el-scrollbar').exists()).toBe(true)
    })

    it('提供 header 插槽时渲染其内容', () => {
        const wrapper = mountContainer({
            header: '<span class="header-slot">头部内容</span>',
        })
        const header = findHeader(wrapper)

        expect(header.exists()).toBe(true)
        expect(header.find('.header-slot').text()).toBe('头部内容')
    })

    it('提供 footer 插槽时渲染其内容', () => {
        const wrapper = mountContainer({
            footer: '<span class="footer-slot">底部内容</span>',
        })
        const footer = findFooter(wrapper)

        expect(footer.exists()).toBe(true)
        expect(footer.find('.footer-slot').text()).toBe('底部内容')
    })

    it('提供 default 插槽时渲染其内容，且不渲染 el-scrollbar', () => {
        const wrapper = mountContainer({
            default: '<span class="default-slot">主体内容</span>',
        })

        expect(wrapper.find('.default-slot').text()).toBe('主体内容')
        // default 走卡片分支，content 才走 el-scrollbar 分支
        expect(wrapper.find('.el-scrollbar').exists()).toBe(false)
        expect(
            wrapper.find('.border.border-default.rounded-md').exists(),
        ).toBe(true)
    })

    it('提供 content 插槽（无 default）时通过 el-scrollbar 渲染其内容', () => {
        const wrapper = mountContainer({
            content: '<span class="content-slot">滚动内容</span>',
        })

        expect(wrapper.find('.el-scrollbar').exists()).toBe(true)
        expect(
            wrapper.find('.el-scrollbar .content-slot').text(),
        ).toBe('滚动内容')
    })

    it('空 header / footer 插槽不渲染占位容器', () => {
        const wrapper = mountContainer({
            header: '',
            footer: '',
        })

        expect(findHeader(wrapper).exists()).toBe(false)
        expect(findFooter(wrapper).exists()).toBe(false)
    })

    it('同时传入 default 与 content 时只渲染 default 并给出警告', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        try {
            const wrapper = mountContainer({
                default: '<span class="default-slot">主体内容</span>',
                content: '<span class="content-slot">不应渲染</span>',
            })

            expect(wrapper.find('.default-slot').exists()).toBe(true)
            expect(wrapper.find('.content-slot').exists()).toBe(false)
            const called = warn.mock.calls.some((args) =>
                String(args[0]).includes('[NeonContainer]'),
            )
            expect(called).toBe(true)
        } finally {
            warn.mockRestore()
        }
    })
})
