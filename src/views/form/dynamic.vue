<template>
    <neon-container>
        <template #header>
            <h1 class="mb-2 font-bold">动态表单</h1>
            <span class="text-sm text-[var(--ne-foreground)]">
                表单组件动态联动示例，包含了常用的场景。增删改，本质上是修改schema。
            </span>
        </template>
        <div class="p-[15px]">
            <h2 class="pb-[20px] mb-5 border-b border-default font-bold">
                表单动态联动示例
            </h2>
        </div>
        <neon-form-builder />
    </neon-container>
</template>

<script setup>
import { computed } from 'vue'
import { useNeonForm, useRef } from '@/hooks'

defineOptions({
    name: 'FormDynamic',
})

const [formState] = useRef({
    field1: true,
    field2: true,
    field3: false,
    field4: false,
    field1Value: '',
    field2Value: '',
    field3Value: '',
    field4Value: '',
    field5Value: '',
})

const options = computed(() => {
    if (formState.value.field2Value === '123') {
        return [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
            { label: '选项3', value: '3' },
        ]
    }
    return [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
    ]
})

const schema = computed(() => [
    {
        label: '显示字段1',
        key: 'field1',
        type: 'switch',
        onChange: (val) => {
            formState.value.field1 = val
        },
    },
    {
        label: '显示字段2',
        key: 'field2',
        type: 'switch',
        onChange: (val) => {
            formState.value.field2 = val
        },
    },
    {
        label: '禁用字段3',
        key: 'field3',
        type: 'switch',
        onChange: (val) => {
            formState.value.field3 = val
        },
    },
    {
        label: '字段4必填',
        key: 'field4',
        type: 'switch',
        onChange: (val) => {
            formState.value.field4 = val
        },
    },
    {
        label: '字段1',
        key: 'field1Value',
        hidden: !formState.value.field1,
        placeholder: '字段1',
        onInput: (val) => {
            formState.value.field1Value = val
        },
    },
    {
        label: '字段2',
        key: 'field2Value',
        hidden: !formState.value.field2,
        placeholder: '字段2',
    },
    {
        label: '字段3',
        key: 'field3Value',
        props: {
            disabled: formState.value.field3,
            placeholder: '字段3',
        },
    },
    {
        label: '字段4',
        key: 'field4Value',
        placeholder: '字段4',
        rules: {
            required: formState.value.field4,
            message: '字段4必填',
            trigger: ['blur', 'change'],
        },
    },
    {
        label: '动态rules',
        key: 'field5Value',
        rules: {
            required: formState.value.field1Value === '123',
            message: '字段5必填',
            trigger: ['blur', 'change'],
        },
        help: '当字段1值为123时，字段5必填',
    },
    {
        label: '动态配置',
        key: 'field6Value',
        type: 'select',
        help: '当字段2的值为`123`时，更改下拉选项',
        options: options.value,
    },
])

const [NeonFormBuilder, formApi] = useNeonForm({
    values: formState,
    schema,
    commonConfig: {
        wrapperClass: 'm-[15px] lg:grid-cols-2 xl:grid-cols-4',
    },
    onSubmit: async (formData) => {
        await formApi.validate()
        console.log(formData)
    },
})
</script>
