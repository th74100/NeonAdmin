/**
 * @file renderDialog.js
 * @description 动态渲染 Element Plus Dialog 对话框（增加setState方法）
 * @param {Object} component - 要渲染的 Vue 内容组件
 * @param {Object} modalProps - 对话框的属性和事件处理函数
 * @param {Object} props - 传递给组件的属性
 * @author JANSON
 * @date 2025-06-27
 * @example
 * import renderDialog from '@/renderDialog'
 * import MyComponent from '@/components/MyComponent.vue'
 * const dialogInstance = renderDialog(MyComponent, {
 *   title: '自定义标题',
 *   onConfirm: (instance) => {},
 *   onCancel: () => {},
 *   onClose: () => {},
 *   onError: (error) => {}
 * })
 *
 * // 动态修改属性
 * dialogInstance.setState({
 *   title: '新标题',
 *   width: '700px',
 *   confirmButtonText: '提交'
 * })
 */

import { createApp, h, ref } from 'vue'
import { ElConfigProvider, ElDialog, ElDrawer, ElButton } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { loadVuePlugins } from '@/utils/loadVuePlugins'

const EMPTY_OBJ = Object.freeze({})

export default function renderDialog(
    component,
    modalProps = EMPTY_OBJ,
    props = EMPTY_OBJ,
) {
    // 控制对话框的显示和隐藏
    const visible = ref(true)

    // 存储组件实例
    const instance = ref()

    // 控制按钮的加载状态
    const loading = ref(false)

    // 可动态修改的属性
    const dynamicProps = ref({
        title: modalProps.title || '提示',
        width: modalProps.width || '580px',
        alignCenter: modalProps.alignCenter || false,
        autoHeight: modalProps.autoHeight || false,
        showConfirmButton: modalProps.showConfirmButton !== false,
        showCancelButton: modalProps.showCancelButton !== false,
        confirmButtonText: modalProps.confirmButtonText || '确定',
        cancelButtonText: modalProps.cancelButtonText || '取消',
        useDrawer: modalProps.useDrawer || false,
        drawerProps: modalProps.drawerProps || {},
        ...modalProps,
    })

    const { onConfirm, onCancel, onError, ...restModalProps } = modalProps

    // 创建footer插槽
    const createFooter = () => {
        if (
            (dynamicProps.value.showCancelButton ||
                dynamicProps.value.showConfirmButton) &&
            !dynamicProps.value.slots?.footer
        ) {
            return () =>
                h('div', [
                    dynamicProps.value.showCancelButton &&
                        h(
                            ElButton,
                            {
                                type: 'default',
                                plain: true,
                                onClick: () => {
                                    visible.value = false
                                    loading.value = false
                                    onCancel?.()
                                },
                            },
                            () => dynamicProps.value.cancelButtonText,
                        ),
                    dynamicProps.value.showConfirmButton &&
                        h(
                            ElButton,
                            {
                                type: 'primary',
                                loading: loading.value,
                                onClick: async () => {
                                    loading.value = true
                                    try {
                                        if (onConfirm) {
                                            await onConfirm(
                                                instance.value,
                                            ).finally(() => {
                                                loading.value = false
                                            })
                                        }
                                        visible.value = false
                                    } catch (error) {
                                        console.error(
                                            '%c[Validate Error]%c',
                                            'color: #fff; background: #e74c3c; padding:2px 4px; border-radius:2px;',
                                            '',
                                            error,
                                        )
                                        onError?.(error)
                                    }
                                },
                            },
                            () => dynamicProps.value.confirmButtonText,
                        ),
                ])
        }
        return dynamicProps.value.slots?.footer
    }

    // 创建一个函数组件， 渲染 ElDialog 组件，并将传入的 component 作为其子组件
    const dialog = () => {
        const footerSlot = createFooter()
        const slots = {
            ...(dynamicProps.value.slots || {}),
            ...(footerSlot ? { footer: footerSlot } : {}),
        }

        const _commonProps = {
            ...restModalProps,
            ...dynamicProps.value,
            modelValue: visible.value,
            'onUpdate:modelValue': (val) => {
                visible.value = val
            },
            onClose: () => {
                visible.value = false
                loading.value = false
                onCancel?.()
            },
            onClosed: () => {
                unmount()
            },
        }

        // 渲染组件
        const _content = h(component, { ...props, ref: instance })

        // 组件类型和props
        const _comp = dynamicProps.value.useDrawer ? ElDrawer : ElDialog
        const _comProps = dynamicProps.value.useDrawer
            ? { modalClass: 'neon-drawer', ..._commonProps }
            : {
                  modalClass: `neon-dialog${dynamicProps.value.autoHeight ? ' auto-height' : ''}`,
                  ..._commonProps,
              }
        const _comSlots = {
            default: () => _content,
            ...slots,
        }

        return h(
            ElConfigProvider,
            { locale: zhCn },
            {
                default: () => h(_comp, _comProps, _comSlots),
            },
        )
    }

    // 卸载组件
    const unmount = () => {
        document.body.removeChild(div)
        app.unmount()
    }

    // 创建应用实例，并挂载到一个新的 div 元素上
    const app = createApp(dialog)
    loadVuePlugins(app)
    const div = document.createElement('div')

    document.body.appendChild(div)
    app.mount(div)

    // 返回实例对象，提供setState方法
    return {
        /**
         * 动态修改对话框属性
         * @param {Object} newProps - 需要更新的属性
         * @example
         * dialogInstance.setState({
         *   title: '新标题',
         *   width: '700px',
         *   confirmButtonText: '提交'
         * })
         */
        setState(newProps) {
            dynamicProps.value = {
                ...dynamicProps.value,
                ...newProps,
            }
        },

        /**
         * 获取内容组件实例
         * @returns 组件实例
         */
        instance() {
            return instance.value
        },

        /**
         * 手动关闭对话框
         */
        close() {
            visible.value = false
        },
    }
}
