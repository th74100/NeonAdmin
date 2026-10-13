import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import NeonSvg from '@/components/NeonSvg/index.vue'

const XLINK_NS = 'http://www.w3.org/1999/xlink'

const mountSvg = (props = {}) =>
    mount(NeonSvg, {
        global: { plugins: [ElementPlus] },
        props: { name: 'home', ...props },
    })

/**
 * Vue 对 `xlink:href` 走 setAttributeNS。实测：
 *  - wrapper.html() 序列化为 <use xlink:href="#icon-home">
 *  - jsdom 下 wrapper.find('use').attributes() 的键被归一为 'href'
 * 因此按 XLink 命名空间取值并断言其为完整期望值，同时校验 attributes() 的
 * 同名取值一致（兼容暴露为 'xlink:href' 的实现），不做任何子串匹配。
 */
const getUseHref = (wrapper) => {
    const use = wrapper.find('use')
    const attrHref = use.attributes('xlink:href') ?? use.attributes('href')
    expect(use.element.getAttributeNS(XLINK_NS, 'href')).toBe(attrHref)
    return attrHref
}

describe('NeonSvg 基线', () => {
    it('默认 prefix 与 name 拼接为 use 的 href', () => {
        const wrapper = mountSvg({ name: 'home' })

        expect(wrapper.find('use').exists()).toBe(true)
        expect(getUseHref(wrapper)).toBe('#icon-home')
    })

    it('缺少 name 时兜底为空引用，不会渲染 #icon-undefined', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        try {
            const wrapper = mountSvg({ name: undefined })

            // 触发 Vue 的必填 prop 警告
            expect(warn).toHaveBeenCalled()
            // 兜底为空字符串，不会渲染出 #icon-undefined
            expect(getUseHref(wrapper)).toBe('')
        } finally {
            warn.mockRestore()
        }
    })

    it('color 未传时不渲染空 fill 属性', () => {
        const wrapper = mountSvg({ name: 'home' })

        expect(wrapper.find('use').attributes('fill')).toBeUndefined()
    })

    it('自定义 prefix 生效', () => {
        const wrapper = mountSvg({ prefix: '#sym-', name: 'home' })

        expect(getUseHref(wrapper)).toBe('#sym-home')
    })

    it('默认 width / height 为 16px', () => {
        const wrapper = mountSvg({ name: 'home' })
        const svg = wrapper.find('svg')

        expect(svg.exists()).toBe(true)
        expect(svg.element.style.width).toBe('16px')
        expect(svg.element.style.height).toBe('16px')
    })

    it('自定义 width / height 生效', () => {
        const wrapper = mountSvg({ name: 'home', width: '30px', height: '24px' })
        const svg = wrapper.find('svg')

        expect(svg.element.style.width).toBe('30px')
        expect(svg.element.style.height).toBe('24px')
    })

    it('color 透传到 use 的 fill', () => {
        const wrapper = mountSvg({ name: 'home', color: '#ff0000' })

        expect(wrapper.find('use').attributes('fill')).toBe('#ff0000')
    })
})
