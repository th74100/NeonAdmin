<template>
    <neon-container>
        <template #header>
            <h1 class="mb-2 font-bold">基础表单</h1>
            <span class="text-sm text-[var(--ne-foreground)]">
                表单组件基础示例
            </span>
        </template>
        <el-scrollbar>
            <div class="m-[15px]">
                <h2 class="pb-[20px] mb-5 border-b border-default font-bold">
                    基础示例
                </h2>
                <div class="fx-end mb-5">
                    <el-radio-group
                        v-model="formSize.size"
                        size="small">
                        <el-radio-button value="large">large</el-radio-button>
                        <el-radio-button value="default">
                            default
                        </el-radio-button>
                        <el-radio-button value="small">small</el-radio-button>
                    </el-radio-group>
                    <el-radio-group
                        v-model="formSize.labelPosition"
                        class="ml-5"
                        size="small">
                        <el-radio-button value="left">Left</el-radio-button>
                        <el-radio-button value="right">Right</el-radio-button>
                        <el-radio-button value="top">Top</el-radio-button>
                    </el-radio-group>
                </div>
                <base-form />
            </div>
        </el-scrollbar>
    </neon-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRef, useNeonForm } from '@/hooks'

defineOptions({
    name: 'FormBasic',
})

/** 表单基础配置 */
const [formSize] = useRef({
    size: 'default',
    labelPosition: 'right',
})

/** 表单配置 */
const restaurants = ref([
    {
        value: 'vue',
        link: 'https://github.com/vuejs/vue',
    },
    {
        value: 'element',
        link: 'https://github.com/ElemeFE/element',
    },
    {
        value: 'cooking',
        link: 'https://github.com/ElemeFE/cooking',
    },
    {
        value: 'mint-ui',
        link: 'https://github.com/ElemeFE/mint-ui',
    },
    {
        value: 'vuex',
        link: 'https://github.com/vuejs/vuex',
    },
    {
        value: 'vue-router',
        link: 'https://github.com/vuejs/vue-router',
    },
    {
        value: 'babel',
        link: 'https://github.com/babel/babel',
    },
])

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
const selectV2Optons = Array.from({ length: 1000 }).map((_, idx) => ({
    value: `Option ${idx + 1}`,
    label: `${initials[idx % 10]}${idx}`,
}))

const schema = [
    {
        label: '用户名',
        key: 'username',
        rules: [
            {
                required: true,
                message: '请输入用户名',
                trigger: ['blur', 'change'],
            },
        ],
        placeholder: '请输入用户名',
    },
    {
        label: '密码',
        key: 'password',
        type: 'input',
        props: {
            type: 'password',
            placeholder: '请输入密码',
            showPassword: true,
        },
    },
    {
        label: '单选组',
        key: 'gender',
        type: 'radio',
        props: {
            options: [
                { label: '男', value: 1 },
                { label: '女', value: 2 },
            ],
        },
    },
    {
        label: '多选组',
        key: 'hobby',
        type: 'checkbox',
        options: [
            {
                label: '篮球',
                value: 1,
            },
            {
                label: '足球',
                value: 2,
            },
            {
                label: '乒乓球',
                value: 3,
            },
        ],
    },
    {
        label: '下拉选择器',
        key: 'select',
        type: 'select',
        options: [
            {
                label: '选项1',
                value: 1,
            },
            {
                label: '选项2',
                value: 2,
            },
            {
                label: '选项3',
                value: 3,
            },
        ],
    },
    {
        label: '虚拟化选择器',
        key: 'selectV2',
        type: 'selectV2',
        options: selectV2Optons,
    },
    {
        label: '日期选择器',
        key: 'date',
        type: 'date',
        props: {
            type: 'date',
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
            placeholder: '请选择日期',
        },
    },
    {
        label: '范围选择器',
        key: 'range',
        type: 'date',
        props: {
            type: 'daterange',
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
            placeholder: '请选择日期范围',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
    },
    {
        label: '自动补全输入框',
        key: 'autocomplete',
        type: 'autocomplete',
        props: {
            fetchSuggestions: (query, cb) => {
                const results = query
                    ? restaurants.value.filter((item) => {
                          return (
                              item.value
                                  .toLowerCase()
                                  .indexOf(query.toLowerCase()) > -1
                          )
                      })
                    : restaurants.value

                cb(results)
            },
            placeholder: '请输入内容',
        },
    },
    {
        label: '标签输入框',
        key: 'tag',
        type: 'inputTag',
        placeholder: '请输入内容(Enter键添加)',
    },
    {
        label: '级联选择器',
        key: 'cascader',
        type: 'cascader',
        style: {
            width: '100%',
        },
        options: [
            {
                value: 'guide',
                label: 'Guide',
                children: [
                    {
                        value: 'disciplines',
                        label: 'Disciplines',
                        children: [
                            {
                                value: 'consistency',
                                label: 'Consistency',
                            },
                            {
                                value: 'feedback',
                                label: 'Feedback',
                            },
                            {
                                value: 'efficiency',
                                label: 'Efficiency',
                            },
                            {
                                value: 'controllability',
                                label: 'Controllability',
                            },
                        ],
                    },
                    {
                        value: 'navigation',
                        label: 'Navigation',
                        children: [
                            {
                                value: 'side nav',
                                label: 'Side Navigation',
                            },
                            {
                                value: 'top nav',
                                label: 'Top Navigation',
                            },
                        ],
                    },
                ],
            },
            {
                value: 'component',
                label: 'Component',
                children: [
                    {
                        value: 'basic',
                        label: 'Basic',
                        children: [
                            {
                                value: 'layout',
                                label: 'Layout',
                            },
                            {
                                value: 'color',
                                label: 'Color',
                            },
                            {
                                value: 'typography',
                                label: 'Typography',
                            },
                            {
                                value: 'icon',
                                label: 'Icon',
                            },
                            {
                                value: 'button',
                                label: 'Button',
                            },
                        ],
                    },
                    {
                        value: 'form',
                        label: 'Form',
                        children: [
                            {
                                value: 'radio',
                                label: 'Radio',
                            },
                            {
                                value: 'checkbox',
                                label: 'Checkbox',
                            },
                            {
                                value: 'input',
                                label: 'Input',
                            },
                            {
                                value: 'input-number',
                                label: 'InputNumber',
                            },
                            {
                                value: 'select',
                                label: 'Select',
                            },
                            {
                                value: 'cascader',
                                label: 'Cascader',
                            },
                            {
                                value: 'switch',
                                label: 'Switch',
                            },
                            {
                                value: 'slider',
                                label: 'Slider',
                            },
                            {
                                value: 'time-picker',
                                label: 'TimePicker',
                            },
                            {
                                value: 'date-picker',
                                label: 'DatePicker',
                            },
                            {
                                value: 'datetime-picker',
                                label: 'DateTimePicker',
                            },
                            {
                                value: 'upload',
                                label: 'Upload',
                            },
                            {
                                value: 'rate',
                                label: 'Rate',
                            },
                            {
                                value: 'form',
                                label: 'Form',
                            },
                        ],
                    },
                    {
                        value: 'data',
                        label: 'Data',
                        children: [
                            {
                                value: 'table',
                                label: 'Table',
                            },
                            {
                                value: 'tag',
                                label: 'Tag',
                            },
                            {
                                value: 'progress',
                                label: 'Progress',
                            },
                            {
                                value: 'tree',
                                label: 'Tree',
                            },
                            {
                                value: 'pagination',
                                label: 'Pagination',
                            },
                            {
                                value: 'badge',
                                label: 'Badge',
                            },
                        ],
                    },
                    {
                        value: 'notice',
                        label: 'Notice',
                        children: [
                            {
                                value: 'alert',
                                label: 'Alert',
                            },
                            {
                                value: 'loading',
                                label: 'Loading',
                            },
                            {
                                value: 'message',
                                label: 'Message',
                            },
                            {
                                value: 'message-box',
                                label: 'MessageBox',
                            },
                            {
                                value: 'notification',
                                label: 'Notification',
                            },
                        ],
                    },
                    {
                        value: 'navigation',
                        label: 'Navigation',
                        children: [
                            {
                                value: 'menu',
                                label: 'Menu',
                            },
                            {
                                value: 'tabs',
                                label: 'Tabs',
                            },
                            {
                                value: 'breadcrumb',
                                label: 'Breadcrumb',
                            },
                            {
                                value: 'dropdown',
                                label: 'Dropdown',
                            },
                            {
                                value: 'steps',
                                label: 'Steps',
                            },
                        ],
                    },
                    {
                        value: 'others',
                        label: 'Others',
                        children: [
                            {
                                value: 'dialog',
                                label: 'Dialog',
                            },
                            {
                                value: 'tooltip',
                                label: 'Tooltip',
                            },
                            {
                                value: 'popover',
                                label: 'Popover',
                            },
                            {
                                value: 'card',
                                label: 'Card',
                            },
                            {
                                value: 'carousel',
                                label: 'Carousel',
                            },
                            {
                                value: 'collapse',
                                label: 'Collapse',
                            },
                        ],
                    },
                ],
            },
            {
                value: 'resource',
                label: 'Resource',
                children: [
                    {
                        value: 'axure',
                        label: 'Axure Components',
                    },
                    {
                        value: 'sketch',
                        label: 'Sketch Templates',
                    },
                    {
                        value: 'docs',
                        label: 'Design Documentation',
                    },
                ],
            },
        ],
    },
    {
        label: '提及输入框',
        key: 'mention',
        type: 'mention',
        props: {
            options: [
                {
                    label: 'Vue',
                    value: 'vue',
                },
                {
                    label: 'React',
                    value: 'react',
                },
                {
                    label: 'Angular',
                    value: 'angular',
                },
                {
                    label: 'Svelte',
                    value: 'svelte',
                },
            ],
            placeholder: '请输入',
        },
    },
    {
        label: 'Rate评分',
        key: 'rate',
        type: 'rate',
    },
    {
        label: 'Slider滑块',
        key: 'slider',
        type: 'slider',
    },
    {
        label: '范围滑块',
        key: 'rangeSlider',
        type: 'slider',
        range: true,
    },
    {
        label: '标记滑块',
        key: 'marksSlider',
        type: 'slider',
        props: {
            range: true,
            marks: {
                0: '0°C',
                8: '8°C',
                37: '37°C',
                50: '50°C',
                87: {
                    label: '87°C',
                    style: {
                        color: '#f00',
                    },
                },
                100: {
                    label: '100°C',
                    style: {
                        color: '#f00',
                    },
                },
            },
        },
        style: {
            paddingBottom: '15px',
        },
    },
    {
        label: 'Switch开关',
        key: 'switch',
        type: 'switch',
    },
    {
        label: '时间选择器',
        key: 'time',
        type: 'time',
        props: {
            format: 'HH:mm:ss',
            valueFormat: 'HH:mm:ss',
            placeholder: '请选择时间',
        },
    },
    {
        label: '时间范围',
        key: 'timeRange',
        type: 'time',
        props: {
            isRange: true,
            rangeSeparator: '至',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
        },
    },
    {
        label: 'Select时间选择',
        key: 'timeSelect',
        type: 'timeSelect',
        props: {
            start: '08:30',
            end: '18:30',
            placeholder: '请选择时间',
        },
    },
    {
        label: '树形选择',
        key: 'treeSelect',
        type: 'tree',
        data: [
            {
                value: '1',
                label: '一级 1',
                children: [
                    {
                        value: '1-1',
                        label: '二级 1-1',
                        children: [
                            {
                                value: '1-1-1',
                                label: '三级 1-1-1',
                            },
                        ],
                    },
                ],
            },
            {
                value: '2',
                label: '一级 2',
                children: [
                    {
                        value: '2-1',
                        label: '二级 2-1',
                    },
                    {
                        value: '2-2',
                        label: '二级 2-2',
                    },
                ],
            },
        ],
    },
]

const commonConfig = computed(() => ({
    labelWidth: '110px',
    labelPosition: formSize.value.labelPosition,
    size: formSize.value.size,
    wrapperClass: 'm-[15px] lg:grid-cols-2 xl:grid-cols-3',
}))

const [BaseForm, formApi] = useNeonForm({
    values: {
        mention: '@',
        slider: 50,
        rangeSlider: [30, 50],
        marksSlider: [30, 60],
        switch: false,
    },
    schema,
    commonConfig,
    onSubmit: async (formData) => {
        await formApi.validate()
        console.log(formData)
    },
})
</script>
