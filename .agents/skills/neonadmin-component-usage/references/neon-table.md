# Vue 组件使用说明

## 简介

`NeonTable` 是一个基于 Element Plus `el-table` 封装的配置化表格组件。它通过 `columns` 数组描述列结构，内置分页、加载状态、空数据占位，并支持单元格插槽、格式化、`render` 渲染、多级表头与展开行，适用于后台管理系统中的列表页面。

组件已在项目中全局自动注册，模板中直接使用 `<neon-table>` 即可，无需手动 `import`。

## 特性

- 🧩 **配置化列** - 通过 `columns` 数组声明列，无需重复书写模板
- 🪜 **多级表头** - `children` 递归生成多级表头
- 📄 **内置分页** - 自动渲染 `el-pagination` 并对外抛出事件
- ⏳ **加载状态** - `loading` 一键开启表格 loading
- 🎨 **空数据占位** - 内置 `neon-empty` 空状态
- 🧱 **多种单元格渲染** - 支持插槽 / `formatter` / `render` 三种方式
- 🧷 **属性与事件透传** - 其余属性和事件直接透传给 `el-table`

## 依赖

- Vue 3
- Element Plus

## Props

| 属性        | 类型    | 默认值       | 说明                       |
| ----------- | ------- | ------------ | -------------------------- |
| columns     | Array   | []           | 列配置数组，见下文         |
| dataSource  | Array   | []           | 表格数据                   |
| options     | Object  | {}           | 表格配置（含分页配置）     |
| loading     | Boolean | false        | 是否显示加载状态           |
| loadingText | String  | '加载中...'  | 加载状态提示文字           |

## options 配置

`options` 中除 `pagination` 之外的字段会全部展开（`v-bind`）到 `el-table` 上，因此 **Element Plus 表格的所有属性都可用**，例如 `size`、`border`、`stripe`、`rowKey`、`height`、`maxHeight`、`rowClassName`、`defaultSort` 等。

组件内置默认值（会被 `options` 覆盖）：

| 属性   | 类型    | 默认值 | 说明           |
| ------ | ------- | ------ | -------------- |
| rowKey | String  | 'id'   | 行数据唯一键   |
| border | Boolean | true   | 是否显示边框   |
| stripe | Boolean | false  | 是否显示斑马纹 |

> 注意：`options.pagination` 不会透传给 `el-table`，它会被单独取出用于分页配置。

### pagination 配置

| 属性           | 类型    | 默认值                                          | 说明                     |
| -------------- | ------- | ----------------------------------------------- | ------------------------ |
| showPagination | Boolean | true                                            | 是否显示分页             |
| total          | Number  | 0                                               | 总条数                   |
| currentPage    | Number  | 1                                               | 当前页码                 |
| pageSize       | Number  | 30（`PAGE_SIZE`）                               | 每页条数                 |
| pageSizes      | Array   | [10, 20, 30, 40, 50, 100]（`PAGE_SIZE_OPTIONS`） | 每页条数选项             |
| background     | Boolean | true                                            | 是否使用背景色分页按钮   |
| layout         | String  | 'total, sizes, prev, pager, next, jumper'       | 分页组件布局             |
| 其他           | -       | -                                               | 透传给 `el-pagination`   |

## columns 列配置

`columns` 是一个数组，每一项对应一列。单元格内容的渲染优先级为：

1. `slot` —— 使用同名具名插槽渲染
2. `formatter` —— `formatter(row)` 返回结果
3. `render` —— `render({ row, index })` 返回 VNode
4. 默认取 `row[prop]`

### 通用列属性

| 属性         | 类型     | 默认值 | 说明                                                   |
| ------------ | -------- | ------ | ------------------------------------------------------ |
| prop         | String   | -      | 字段名，默认取 `row[prop]`                             |
| label        | String   | -      | 列标题                                                 |
| slot         | String   | -      | 单元格插槽名，作用域 `{ row, index }`                  |
| formatter    | Function | -      | `formatter(row)`，返回字符串或 VNode                   |
| render       | Function | -      | `render({ row, index })`，返回 VNode                   |
| headerSlot   | String   | -      | 自定义表头插槽名，作用域 `{ column, index }`           |
| headerRender | Function | -      | `headerRender({ column, index })`，返回 VNode          |
| children     | Array    | -      | 子列数组，用于生成多级表头                             |
| 其他         | -        | -      | 透传给 `el-table-column`，如 `width`、`minWidth`、`align`、`fixed`、`showOverflowTooltip`、`sortable` 等 |

### 特殊类型列

设置 `type` 为以下值时，会以 Element Plus 原生特殊列渲染：

| type 值   | 说明                                                                 |
| --------- | -------------------------------------------------------------------- |
| selection | 多选列，配合 `@selection-change` 使用                                |
| index     | 序号列，会按分页自动连续编号，公式为 `index + (currentPage - 1) * pageSize + 1` |
| expand    | 展开行，需要配置 `slot`（插槽名固定为 `expand`）或 `render`          |

### 多级表头

当列配置包含 `children` 时，会把该列作为父表头并递归渲染子列。此时父列只透传 `label`、`width`、`align` 三个属性。

## 事件

| 事件名           | 参数                        | 说明                             |
| ---------------- | --------------------------- | -------------------------------- |
| sizeChange       | pageSize                    | 每页条数变化时触发               |
| currentChange    | currentPage                 | 当前页码变化时触发               |
| paginationChange | (currentPage, pageSize)     | 分页变化时触发（推荐统一使用）   |
| 其他             | -                           | 通过 `$attrs` 直接绑定到 `el-table`，如 `selection-change`、`row-click`、`sort-change` 等 |

> 因为组件是「表格 + 分页」的多根节点结构，`$attrs` 已被显式绑定到 `el-table` 上，所以未在 `props` / `emits` 中声明的属性和事件都会落到 `el-table`。

## 插槽

所有具名插槽都会转发到列渲染中：

- **单元格插槽**：名称由列配置的 `slot` 指定，作用域为 `{ row, index }`
- **展开行插槽**：名称固定为 `expand`，作用域为 `{ row, index }`
- **表头插槽**：名称由列配置的 `headerSlot` 指定，作用域为 `{ column, index }`

## 使用示例

### 基本使用

```vue
<template>
    <neon-table
        :columns="columns"
        :data-source="dataSource" />
</template>

<script setup>
import { h } from 'vue'
import { ElTag } from 'element-plus'

const columns = [
    { type: 'index', label: '序号', width: 60 },
    { prop: 'name', label: '姓名', minWidth: 100 },
    {
        prop: 'status',
        label: '状态',
        align: 'center',
        render: ({ row }) =>
            h(
                ElTag,
                { type: row.status ? 'success' : 'danger' },
                () => (row.status ? '启用' : '禁用'),
            ),
    },
]

const dataSource = [
    { id: 1, name: '王小虎', status: 1 },
    { id: 2, name: '佘太君', status: 0 },
]
</script>
```

### 格式化与自定义插槽

```vue
<template>
    <neon-table
        :columns="columns"
        :data-source="dataSource">
        <template #action="{ row }">
            <el-button
                type="primary"
                link
                @click="handleEdit(row)">
                编辑
            </el-button>
        </template>
    </neon-table>
</template>

<script setup>
import { formatTime } from '@/utils'

const columns = [
    {
        prop: 'date',
        label: '出生日期',
        formatter: (row) => formatTime(row.date),
    },
    {
        prop: 'address',
        label: '地址',
        showOverflowTooltip: true,
    },
    {
        label: '操作',
        slot: 'action',
        width: 120,
        align: 'center',
        fixed: 'right',
    },
]

const dataSource = [
    { id: 1, date: 1750411799, address: '上海市普陀区金沙江路 1516 弄' },
]

const handleEdit = (row) => {
    console.log(row)
}
</script>
```

### 分页与加载

```vue
<template>
    <neon-table
        :columns="columns"
        :data-source="dataSource"
        :options="options"
        :loading="loading"
        @pagination-change="handlePaginationChange" />
</template>

<script setup>
import { reactive, ref } from 'vue'

const loading = ref(false)

const options = reactive({
    border: true,
    stripe: true,
    pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 20,
    },
})

const columns = [
    { prop: 'name', label: '姓名', minWidth: 100 },
    { prop: 'address', label: '地址', minWidth: 200 },
]

const dataSource = ref([])

const handlePaginationChange = (currentPage, pageSize) => {
    options.pagination.currentPage = currentPage
    options.pagination.pageSize = pageSize
    fetchData()
}

const fetchData = () => {
    loading.value = true
    // ... 请求数据后写入 dataSource.value 与 options.pagination.total
}
</script>
```

### 多级表头

```vue
<template>
    <neon-table
        :columns="columns"
        :data-source="dataSource" />
</template>

<script setup>
const columns = [
    {
        label: '用户信息',
        align: 'center',
        children: [
            { prop: 'name', label: '姓名', minWidth: 100 },
            { prop: 'age', label: '年龄', minWidth: 80 },
        ],
    },
    {
        label: '联系方式',
        children: [
            { prop: 'phone', label: '手机号', minWidth: 140 },
            { prop: 'email', label: '邮箱', minWidth: 180 },
        ],
    },
]

const dataSource = [
    { id: 1, name: '王小虎', age: 28, phone: '13800000000', email: 'a@b.com' },
]
</script>
```

### 展开行

```vue
<template>
    <neon-table
        :columns="columns"
        :data-source="dataSource">
        <template #expand="{ row }">
            <div class="p-4">
                详情：{{ row.detail }}
            </div>
        </template>
    </neon-table>
</template>

<script setup>
const columns = [
    { type: 'expand', width: 50, slot: 'expand' },
    { prop: 'name', label: '姓名' },
]

const dataSource = [
    { id: 1, name: '王小虎', detail: '这是一条展开行的详细内容' },
]
</script>
```

### 自定义表头

```vue
<template>
    <neon-table
        :columns="columns"
        :data-source="dataSource">
        <template #nameHeader="{ column }">
            <span>{{ column.label }}（自定义）</span>
        </template>
    </neon-table>
</template>

<script setup>
const columns = [
    { prop: 'name', label: '姓名', headerSlot: 'nameHeader' },
]

const dataSource = [{ id: 1, name: '王小虎' }]
</script>
```

### 多选

```vue
<template>
    <neon-table
        :columns="columns"
        :data-source="dataSource"
        @selection-change="handleSelectionChange" />
</template>

<script setup>
const columns = [
    { type: 'selection', width: 50 },
    { prop: 'name', label: '姓名' },
]

const dataSource = [{ id: 1, name: '王小虎' }]

const handleSelectionChange = (rows) => {
    console.log(rows)
}
</script>
```

## 注意事项

- `options` 建议使用 `ref` / `reactive` 声明，以便分页等配置变化时能触发更新。
- 隐藏分页：设置 `options.pagination.showPagination = false`。
- `index` 类型列会自动按分页连续编号，无需手动处理。
- `formatter` 只接收 `row` 一个参数，返回字符串即可；需要复杂结构时请使用 `render` 或 `slot`。
- 单元格插槽作用域中的 `index` 为当前页内的行索引（从 0 开始），与 Element Plus 的 `$index` 一致。
- `columns` 中除下表列出的自定义字段外，其余字段都会原样透传给 `el-table-column`。