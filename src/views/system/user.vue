<template>
    <neon-container>
        <template #header>
            <neon-form
                v-model="formData"
                :schema="formItems"
                :collapsed="false"
                :show-collapse-button="true"
                :collapse-count="4"
                @submit="handleSearchSubmit"
                class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            </neon-form>
        </template>
        <neon-table
            :columns="dataColumns"
            :data-source="dataSource"
            :options="options"
            :loading="loading"
            @selection-change="handleSelectionChange"
            @pagination-change="handlePaginationChange">
            <template #action="{ row }">
                <el-button
                    type="primary"
                    size="small"
                    link
                    @click="open">
                    编辑
                </el-button>
                <el-button
                    type="danger"
                    size="small"
                    link
                    @click="console.log(row)">
                    删除
                </el-button>
            </template>
        </neon-table>
    </neon-container>
</template>

<script setup>
import { h, ref, computed } from 'vue'
import { ElTag } from 'element-plus'
import { formatTime } from '@/utils'
import renderDialog from '@/utils/renderDialog'
import { useNeonForm, useRef } from '@/hooks'

defineOptions({
    name: 'UserCenter',
})

const loading = ref(false)

// 弹窗内容组件
const [dialogFormState] = useRef({
    name: '',
    hobby: [],
    birth: '',
    status: 1,
})
const dialogFormItems = [
    {
        label: '姓名',
        key: 'name',
        type: 'input',
        slots: {
            append: () => h('span', '自定义内容'),
        },
        rules: {
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'change'],
        },
        placeholder: '请输入姓名',
    },
    {
        label: '爱好',
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
        label: '出生年月',
        key: 'birth',
        type: 'date',
        width: '100%',
        props: {
            placeholder: '请选择出生年月',
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
        },
    },
    {
        label: '状态',
        key: 'status',
        type: 'radio',
        options: [
            {
                label: '启用',
                value: 1,
            },
            {
                label: '禁用',
                value: 0,
            },
        ],
    },
]

const [DialogBaseForm, formApi] = useNeonForm({
    modelValue: dialogFormState,
    schema: dialogFormItems,
    commonConfig: {
        labelWidth: '80px',
        buttons: {
            showSubmitButton: false,
            showResetButton: false,
        },
    },
})

// 打开弹窗方法
const open = () => {
    renderDialog(DialogBaseForm, {
        title: '编辑',
        width: '500px',
        useDrawer: true,
        drawerProps: {
            direction: 'rtl',
        },
        showConfirmButton: true,
        showCancelButton: true,
        onConfirm: async () => {
            await formApi.validate() // 校验

            console.log(dialogFormState.value)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 2000)
            })
        },
    })
}

/** 表单 */
const formData = ref({
    name: '',
    age: null,
    sex: null,
})
const formItems = computed(() => [
    {
        label: '字符串',
        key: 'name',
        placeholder: '请输入姓名',
        onInput(value) {
            console.log('onInput', value)
        },
    },
    {
        label: '数字',
        key: 'age',
        type: 'number',
        placeholder: '请输入年龄',
        controlsPosition: 'right',
    },
    {
        label: 'Select选择框',
        key: 'sex',
        type: 'select',
        placeholder: '请选择性别',
        options: [
            {
                title: '男',
                value: 1,
            },
            {
                title: '女',
                value: 0,
            },
        ],
        prop: {
            label: 'title',
            value: 'value',
        },
    },
    {
        label: '时间选择器',
        key: 'date',
        type: 'date',
        placeholder: '请选择时间',
    },
    {
        label: '年份选择',
        key: 'date',
        type: 'date',
        props: {
            type: 'year',
            format: 'YYYY',
            valueFormat: 'YYYY',
            placeholder: '请选择年份',
        },
    },
    {
        label: '时间范围',
        key: 'date',
        type: 'date',
        props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
        },
    },
])

const handleSearchSubmit = (data) => {
    console.log(data)
}

/** table 表头 */
const dataColumns = [
    { type: 'selection', width: 50 },
    { type: 'index', label: 'No.', width: 60 },
    { prop: 'name', label: '名字', minWidth: 100 },
    {
        prop: 'date',
        label: '出生日期',
        minWidth: 180,
        formatter: (row) => formatTime(row.date),
    },
    {
        prop: 'address',
        label: '地址',
        minWidth: 200,
        showOverflowTooltip: true,
    },
    {
        prop: 'status',
        label: '状态',
        align: 'center',
        minWidth: 100,
        render: ({ row }) =>
            h(ElTag, { type: row.status ? 'success' : 'danger' }, () =>
                row.status ? '启用' : '禁用',
            ),
    },
    {
        label: '操作',
        width: 120,
        align: 'center',
        fixed: 'right',
        slot: 'action',
    },
]

/** table 数据 */
const dataSource = [
    {
        date: 1750411799,
        name: '佘太君',
        address: '上海市普陀区金沙江路 1516 弄',
        status: 1,
    },
    {
        date: 1750289399,
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        status: 0,
    },
    {
        date: 1750213799,
        name: '王小帅',
        address: '上海市普陀区金沙江路 1519 弄',
        status: 1,
    },
    {
        date: 1749954599,
        name: '王小呆',
        address: '上海市普陀区金沙江路 1516 弄',
        status: 0,
    },
]

/** table 配置项 */
const options = ref({
    size: 'large',
    border: true,
    pagination: {
        total: 200,
        currentPage: 1,
    },
})

/** table 选中/取消选中 */
const handleSelectionChange = (val) => {
    console.log(val)
}

/** 页码改变时 */
const handlePaginationChange = (currentPage, pageSize) => {
    options.value.pagination = Object.assign(options.value.pagination, {
        currentPage,
        pageSize,
    })
}
</script>
