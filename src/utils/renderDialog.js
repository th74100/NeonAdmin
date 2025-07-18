/**
 * @file renderDialog.js
 * @description 动态渲染 Element Plus Dialog 对话框
 * @param {Object} component - 要渲染的 Vue 内容组件
 * @param {Object} modalProps - 对话框的属性和事件处理函数
 * @param {Object} props - 传递给组件的属性
 * @author JANSON
 * @date 2025-06-27
 * @example
 * import renderDialog from '@/renderDialog'
 * import MyComponent from '@/components/MyComponent.vue'
 * renderDialog(MyComponent, {
 *   title: '自定义标题',
 *   onConfirm: (instance) => {},
 *   onCancel: () => {},
 *   onClose: () => {},
 *   onError: (error) => {}
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

    const {
        title = '提示',
        onConfirm,
        onCancel,
        onError,
        showConfirmButton = true,
        showCancelButton = true,
        confirmButtonText = '确定',
        cancelButtonText = '取消',
        useDrawer = false,
        drawerProps = {},
        slots = {},
        ..._modalProps
    } = modalProps

    // 如果 showCancelButton 或 showConfirmButton 为 true，则添加 footer 插槽
    if ((showCancelButton || showConfirmButton) && !slots.footer) {
        slots.footer = () =>
            h('div', [
                showCancelButton &&
                    h(
                        ElButton,
                        {
                            type: 'primary',
                            onClick: () => {
                                visible.value = false
                                loading.value = false
                                onCancel?.()
                            },
                        },
                        () => cancelButtonText,
                    ),
                showConfirmButton &&
                    h(
                        ElButton,
                        {
                            type: 'info',
                            loading: loading.value,
                            onClick: async () => {
                                loading.value = true
                                try {
                                    if (onConfirm) {
                                        await onConfirm(instance.value).finally(
                                            () => {
                                                loading.value = false
                                            },
                                        )
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
                        () => confirmButtonText,
                    ),
            ])
    }

    // 创建一个函数组件， 渲染 ElDialog 组件，并将传入的 component 作为其子组件
    const dialog = () => {
        const _commonProps = {
            ..._modalProps,
            title,
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
        const _comp = useDrawer ? ElDrawer : ElDialog
        const _comProps = useDrawer
            ? { modalClass: 'neon-drawer', ..._commonProps, ...drawerProps }
            : {
                  modalClass: 'neon-dialog',
                  ..._commonProps,
              }
        const _comSlots = {
            default: () => _content,
            ...(slots && typeof slots === 'object' ? slots : {}),
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
}
