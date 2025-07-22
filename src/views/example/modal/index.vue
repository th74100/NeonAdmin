<template>
    <neon-container>
        <template #content>
            <el-alert
                type="error"
                style="margin-bottom: 20px">
                <template #title>
                    配置项参数，请查阅Element Plus文档：
                    <a
                        href="https://element-plus.org/zh-CN/component/dialog.html"
                        target="_blank">
                        https://element-plus.org/zh-CN/component/dialog.html
                    </a>
                </template>
            </el-alert>
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">基本使用</h2>
                    <p class="px-4 py-6">一个基础的弹窗示例</p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open1">
                            打开弹窗
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">可拖拽示例</h2>
                    <p class="px-4 py-6">配置 draggable 可开启拖拽功能</p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open2">
                            打开弹窗
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">自定义标题示例</h2>
                    <p class="px-4 py-6">配置 title 可自定义标题</p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open3">
                            打开弹窗
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">自定义弹窗宽度</h2>
                    <p class="px-4 py-6">配置 width 可自定义宽度</p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open4">
                            打开弹窗
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">表单弹窗示例</h2>
                    <p class="px-4 py-6">弹窗与表单结合</p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open5">
                            打开表单弹窗
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">嵌套弹窗示例</h2>
                    <p class="px-4 py-6">在已经打开的弹窗中再次打开弹窗</p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open6">
                            打开嵌套弹窗
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">自动计算高度</h2>
                    <p class="px-4 py-6">可根据内容并自动调整高度</p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open7">
                            打开弹窗
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">动态配置示例</h2>
                    <p class="px-4 py-6">通过 setState 动态调整弹窗数据</p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open8">
                            打开弹窗
                        </el-button>
                    </div>
                </div>

                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">
                        slots插槽自定义头部和按钮操作区域
                    </h2>
                    <p class="px-4 py-6">
                        通过 slots 插槽，自定义头部和按钮操作区
                    </p>
                    <div class="border-t border-default px-4 py-3 text-center">
                        <el-button
                            type="primary"
                            @click="open9">
                            打开弹窗
                        </el-button>
                    </div>
                </div>
            </div>
        </template>
    </neon-container>
</template>

<script setup>
import { h, ref } from 'vue'
import { useNeonForm } from '@/hooks'
import { ElButton } from 'element-plus'
import renderDialog from '@/utils/renderDialog'

const open1 = () => renderDialog(h('p', '一个基础的弹窗示例'))

const open2 = () =>
    renderDialog(h('p', '一个可拖拽的弹窗示例'), {
        draggable: true,
    })

const open3 = () =>
    renderDialog(h('p', '一个自定义标题的弹窗示例'), {
        title: '自定义标题',
    })

const open4 = () =>
    renderDialog(h('p', '一个自定义宽度的弹窗示例'), {
        width: '400px',
    })

const [BaseForm, formApi] = useNeonForm({
    schema: [
        {
            label: '字段1',
            key: 'field1',
            rules: [
                {
                    required: true,
                    message: '请输入字段1',
                    trigger: ['blur', 'change'],
                },
            ],
            placeholder: '请输入字段1',
        },
        {
            label: '字段2',
            key: 'field2',
            rules: [
                {
                    required: true,
                    message: '请输入字段2',
                    trigger: ['blur', 'change'],
                },
            ],
            placeholder: '请输入字段1',
        },
        {
            label: '字段3',
            key: 'field3',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: '请选择字段3',
                    trigger: ['blur', 'change'],
                },
            ],
            options: [
                {
                    label: '选项1',
                    value: '1',
                },
                {
                    label: '选项2',
                    value: '2',
                },
                {
                    label: '选项3',
                    value: '3',
                },
            ],
        },
    ],
    commonConfig: {
        submitButtonOptions: {
            show: false,
        },
        resetButtonOptions: {
            show: false,
        },
    },
})
const open5 = () => {
    renderDialog(BaseForm, {
        onConfirm: async () => {
            await formApi.validate()

            return new Promise((resolve) => {
                setTimeout(() => {
                    const formData = formApi.getValues()
                    console.log(formData)
                    resolve()
                }, 2000)
            })
        },
    })
}

const open6 = () =>
    renderDialog(
        h('div', { class: 'flex items-center gap-5' }, [
            h('p', '嵌套弹窗示例'),
            h(
                ElButton,
                {
                    type: 'primary',
                    onClick: () => {
                        renderDialog(h('p', '子弹窗'), {
                            title: '子弹窗',
                            width: '400px',
                        })
                    },
                },
                { default: () => '打开子弹窗' },
            ),
        ]),
    )

const open7 = () =>
    renderDialog(
        h('div', { class: 'h-full' }, [
            h(
                'div',
                {
                    class: 'bg-gray-200 fx-center h-[220px] w-full',
                },
                '1',
            ),
            h(
                'div',
                {
                    class: 'bg-gray-100 fx-center h-[220px] w-full',
                },
                '2',
            ),
            h(
                'div',
                {
                    class: 'bg-gray-300 fx-center h-[220px] w-full',
                },
                '3',
            ),
        ]),
        {
            title: '自动计算高度',
            autoHeight: true,
        },
    )

const isFullscreen = ref(false)
const open8 = () => {
    const dialog = renderDialog(
        h('div', { class: 'fx-center flex-col gap-5' }, [
            h(
                ElButton,
                {
                    type: 'primary',
                    onClick: () => {
                        dialog.setState({
                            title: '内部动态标题',
                        })
                    },
                },
                { default: () => '内部动态修改标题' },
            ),
            h(
                ElButton,
                {
                    type: 'primary',
                    onClick: () => {
                        dialog.setState({
                            fullscreen: !isFullscreen.value,
                        })
                        isFullscreen.value = !isFullscreen.value
                    },
                },
                {
                    default: () =>
                        isFullscreen.value ? '退出全屏' : '打开全屏',
                },
            ),
        ]),
        {
            title: '外部动态标题',
        },
    )
}

const open9 = () => {
    renderDialog(h('p', '自定义头部和底部'), {
        slots: {
            header: () => h('p', '自定义头部'),
            footer: () => h('p', '自定义底部'),
        },
    })
}
</script>
