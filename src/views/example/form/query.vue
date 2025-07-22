<template>
    <neon-container>
        <template #header>
            <h1 class="mb-2 font-bold">查询表单</h1>
            <span class="text-sm text-[var(--ne-foreground)]">
                查询表单，常用语和表格组合使用，可进行收缩展开。
            </span>
        </template>
        <div class="p-[15px]">
            <h2 class="pb-[20px] mb-5 border-b border-default font-bold">
                查询表单，默认展开
            </h2>
            <base-form />

            <h2 class="pb-[20px] mb-5 border-b border-default font-bold">
                查询表单，默认折叠，折叠时保留2个
            </h2>
            <base-form-collapsed />
        </div>
    </neon-container>
</template>

<script setup>
import { useNeonForm } from '@/hooks'

defineOptions({
    name: 'FormQuery',
})

/** 查询表单，默认展开 */
const schema = [
    {
        label: '字符串',
        key: 'name',
        rules: {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change'],
        },
        placeholder: '请输入字符串',
    },
    {
        label: '密码',
        key: 'password',
        props: {
            type: 'password',
            placeholder: '请输入密码',
        },
    },
    {
        label: '数字',
        key: 'number',
        type: 'number',
        props: {
            controlsPosition: 'right',
            placeholder: '请输入数字',
        },
    },
    {
        label: '下拉框',
        key: 'select',
        type: 'select',
        options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
            { label: '选项3', value: 3 },
        ],
    },
]

const [BaseForm, formApi] = useNeonForm({
    schema,
    commonConfig: {
        labelWidth: 80,
    },
    showCollapseButton: true,
    onSubmit: async (formData) => {
        await formApi.validate()
        console.log(formData)
    },
})

/** 查询表单，默认折叠 */
const [BaseFormCollapsed, formCollapsedApi] = useNeonForm({
    schema,
    commonConfig: {
        labelWidth: 80,
    },

    // 默认是否展开
    collapsed: false,

    // 是否显示折叠按钮
    showCollapseButton: true,
    onSubmit: async (formData) => {
        await formCollapsedApi.validate()
        console.log(formData)
    },
})
</script>
