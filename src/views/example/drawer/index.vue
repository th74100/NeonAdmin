<template>
    <neon-container>
        <template #header>
            <h1 class="mb-2 font-bold">抽屉组件示例</h1>
            <span class="text-sm text-[var(--ne-foreground)]">
                抽屉组件通常用于在当前页面上显示一个覆盖层，用以展示重要信息或提供用户交互界面
            </span>
        </template>
        <template #content>
            <el-alert
                type="error"
                style="margin-bottom: 20px">
                <template #title>
                    配置项参数，请查阅Element Plus文档：
                    <a
                        href="https://element-plus.org/zh-CN/component/drawer.html"
                        target="_blank">
                        https://element-plus.org/zh-CN/component/drawer.html
                    </a>
                </template>
            </el-alert>
            <div class="fx-col gap-5">
                <div
                    class="border border-default rounded-md bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">基本使用</h2>
                    <div class="px-4 py-5">
                        <el-button
                            type="primary"
                            @click="open1">
                            右侧打开
                        </el-button>
                        <el-button
                            type="primary"
                            @click="open2">
                            左侧打开
                        </el-button>
                        <el-button
                            type="primary"
                            @click="open3">
                            底部打开
                        </el-button>
                        <el-button
                            type="primary"
                            @click="open4">
                            顶部打开
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">表单抽屉示例</h2>
                    <div class="px-4 py-5">
                        <el-button
                            type="primary"
                            @click="open5">
                            打开抽屉并设置表单schema以及数据
                        </el-button>
                    </div>
                </div>
                <div
                    class="border border-default rounded-md bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">
                        自定义头部和底部区域
                    </h2>
                    <div class="px-4 py-5">
                        <el-button
                            type="primary"
                            @click="open6">
                            打开抽屉
                        </el-button>
                    </div>
                </div>
            </div>
        </template>
    </neon-container>
</template>

<script setup>
import { h } from 'vue'
import { ElTooltip, ElIcon } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import { useNeonForm } from '@/hooks'
import renderDialog from '@/utils/renderDialog'

const open1 = () =>
    renderDialog(h('div', '抽屉内容'), {
        title: '基础抽屉示例',
        direction: 'rtl',
        useDrawer: true,
    })

const open2 = () =>
    renderDialog(h('div', '抽屉内容'), {
        title: '基础抽屉示例',
        direction: 'ltr',
        useDrawer: true,
    })

const open3 = () =>
    renderDialog(h('div', '抽屉内容'), {
        title: '基础抽屉示例',
        direction: 'btt',
        useDrawer: true,
    })

const open4 = () =>
    renderDialog(h('div', '抽屉内容'), {
        title: '基础抽屉示例',
        direction: 'ttb',
        useDrawer: true,
    })

const [BaseForm, formApi] = useNeonForm({
    values: {
        field1: '123',
        field2: '321',
        field3: '1',
    },
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
const open5 = () =>
    renderDialog(BaseForm, {
        title: '表单抽屉示例',
        useDrawer: true,
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

const open6 = () =>
    renderDialog(h('div', null, '抽屉内容'), {
        useDrawer: true,
        slots: {
            header: () =>
                h('div', { class: 'flex items-center gap-2' }, [
                    h('span', '自定义头部'),
                    h(
                        ElTooltip,
                        {
                            content: '提示信息',
                            placement: 'right',
                        },
                        {
                            default: () =>
                                h(ElIcon, null, {
                                    default: () => h(Warning),
                                }),
                        },
                    ),
                ]),

            footer: () => h('span', null, '自定义底部'),
        },
    })
</script>
