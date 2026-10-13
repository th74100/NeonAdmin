# Vue 组件使用说明

## 简介

`NeonForm` 是一个基于 Element Plus 构建的动态表单组件，提供了灵活的配置、动态渲染、折叠展开等功能。它通过 JSON 配置驱动表单渲染，支持多种表单控件类型，并内置了验证、错误处理等功能，适用于复杂表单场景。

## 特性

- 🧩 **动态表单渲染** - 通过 JSON 配置自动生成表单
- 🪟 **折叠/展开功能** - 支持长表单的折叠展示
- 🛠️ **丰富控件支持** - 内置多种表单控件类型
- ✅ **表单验证集成** - 无缝集成 Element Plus 验证
- 🧭 **自定义按钮配置** - 灵活配置操作按钮
- 💡 **帮助提示系统** - 支持表单项帮助信息
- 🔌 **插槽扩展** - 支持自定义表单项和按钮区域

## 依赖

- Vue 3
- Element Plus

## Props 配置

| 属性               | 类型    | 默认值           | 描述                          |
| ------------------ | ------- | ---------------- | ----------------------------- |
| modelValue         | Object  | {}               | 表单数据，配合 `v-model` 使用 |
| schema             | Array   | []               | 表单项配置数组        |
| commonConfig       | Object  | {}               | 公共配置对象          |
| collapsed          | Boolean | true             | 默认是否展开          |
| showCollapseButton | Boolean | false            | 是否显示折叠/展开按钮 |
| collapseButtonText | Array   | ['展开', '收起'] | 折叠/展开按钮的文本   |
| collapseCount      | Number  | 2                | 默认显示多少项        |

## commonConfig 配置

`commonConfig` 对象包含以下属性：

| 属性                | 类型                          | 默认值         | 描述                                             |
| ------------------- | ----------------------------- | -------------- | ------------------------------------------------ |
| labelPosition       | String                        | 'right'        | 表单项标签的位置 'left', 'right', 'top'          |
| buttonAlign         | String                        | 'right'        | 按钮对齐方式，可选 'start' / 'center' / 'right'  |
| row                 | Object                        | { gutter: 18 } | 透传给 el-row 的配置（gutter / justify / align） |
| col                 | Object                        | { span: 24 }   | 全局默认列配置，透传给每个字段的 el-col          |
| buttonCol           | `false` \| Object \| `'auto'` | false          | 按钮列配置，见「栅格布局」                       |
| submitButtonOptions | Object                        | -              | 提交按钮的配置                                   |
| resetButtonOptions  | Object                        | -              | 重置按钮的配置                                   |
| cancelButtonOptions | Object                        | -              | 取消按钮的配置                                   |

> 需要给表单根节点添加自定义样式时，直接在组件上写 `class` 即可（类名会落到 `el-form` 的根元素上）。

### submitButtonOptions 配置

| 属性       | 类型    | 默认值    | 描述                          |
| ---------- | ------- | --------- | ----------------------------- |
| type       | String  | 'primary' | 按钮类型(其他见 Element Plus) |
| text       | String  | '提交'    | 按钮文本                      |
| show       | Boolean | true      | 是否显示按钮                  |
| disabled   | Boolean | false     | 按钮是否禁用                  |
| loading    | Boolean | false     | 按钮是否加载中                |
| 其他 props | -       | -         | 见 Element Plus               |

### resetButtonOptions 配置

| 属性       | 类型    | 默认值 | 描述                          |
| ---------- | ------- | ------ | ----------------------------- |
| type       | String  | -      | 按钮类型(其他见 Element Plus) |
| text       | String  | '重置' | 按钮文本                      |
| show       | Boolean | true   | 是否显示按钮                  |
| disabled   | Boolean | false  | 按钮是否禁用                  |
| 其他 props | -       | -      | 见 Element Plus               |

### cancelButtonOptions 配置

| 属性       | 类型    | 默认值 | 描述                          |
| ---------- | ------- | ------ | ----------------------------- |
| type       | String  | -      | 按钮类型(其他见 Element Plus) |
| text       | String  | '取消' | 按钮文本                      |
| show       | Boolean | false  | 是否显示按钮                  |
| disabled   | Boolean | false  | 按钮是否禁用                  |
| 其他 props | -       | -      | 见 Element Plus               |

## 栅格布局

`NeonForm` 的布局由 Element Plus 的 `el-row` / `el-col` 栅格系统驱动，不再依赖 UnoCSS 的 `grid-cols-*`。通过 `commonConfig.row`、`commonConfig.col`、`commonConfig.buttonCol` 以及表单项级的 `item.col`，即可控制每行显示几列。

| 配置        | 类型                          | 默认值         | 说明                                        |
| ----------- | ----------------------------- | -------------- | ------------------------------------------- |
| row         | Object                        | { gutter: 18 } | 透传给 el-row（gutter / justify / align）   |
| col         | Object                        | { span: 24 }   | 全局默认列配置，透传给每个字段的 el-col     |
| buttonCol   | `false` \| Object \| `'auto'` | `false`        | 按钮列配置，见下方                          |
| buttonAlign | String                        | 'right'        | 按钮对齐，可选 'start' / 'center' / 'right' |

### 每行多列

`col` 使用 Element Plus 的 24 等分栅格，`span` 表示字段占据的份数。默认 `{ span: 24 }` 即每行一列；改为 `{ span: 12 }` 即每行两列，配合断点即可实现响应式：

```js
const commonConfig = {
    col: { span: 24, md: 12, lg: 8 },
}
```

单个字段可用 `item.col` 覆盖全局配置，合并规则为 `{ ...commonConfig.col, ...item.col }`：

```js
const schema = [
    { label: '用户名', key: 'username', type: 'input', col: { span: 24 } },
    { label: '邮箱', key: 'email', type: 'input' },
]
```

### 按钮列 buttonCol

- `false` / 不传（默认）：按钮独占一行，等价于 `el-col :span="24"`。

```js
const commonConfig = { buttonCol: false }
```

- 对象：整体透传给按钮所在的 `el-col`，可直接使用 `el-col` 的原生属性，如 `span`、`offset`：

```js
const commonConfig = { buttonCol: { span: 8, offset: 16 } }
```

- `'auto'`：按钮并入最后一行并吃掉剩余空间（内部使用 `flex: 1 1 auto`），若最后一行已被占满则自动换行：

```js
const commonConfig = { buttonCol: 'auto' }
```

### 按钮对齐 buttonAlign

`buttonAlign` 控制按钮在自身容器内的水平对齐，可选 `'start'` / `'center'` / `'right'`，默认 `'right'`，分别映射为 `justify-start` / `justify-center` / `justify-end`：

```js
const commonConfig = { buttonAlign: 'center' }
```


### 注意事项

- **列数受 24 等分栅格限制**：每行只能取 24 的约数，即 1、2、3、4、6、8、12、24 列，无法实现 5、7、9 等列数。
- **断点使用 Element Plus 的**，与 UnoCSS 不同：Element Plus 为 `sm` 768px / `md` 992px / `lg` 1200px / `xl` 1920px；UnoCSS presetWind3 为 `sm` 640px / `md` 768px / `lg` 1024px / `xl` 1280px / `2xl` 1536px。因此 `:md="12"` 指的是 Element Plus 的 992px。
- **不要再用 `grid-cols-*`**：`.neon-form` 已不再是 `display: grid`，在组件上书写 `grid-cols-*` 不会生效，请改用上述 `col` / `buttonCol` 配置。

### 完整示例

```vue
<template>
    <NeonForm
        v-model="formValues"
        :schema="formSchema"
        :commonConfig="formConfig"
        @submit="handleSubmit" />
</template>

<script setup>
import { ref } from 'vue'

const formValues = ref({
    username: '',
    email: '',
    phone: '',
    remark: '',
})

const formSchema = ref([
    { label: '用户名', key: 'username', type: 'input' },
    { label: '邮箱', key: 'email', type: 'input' },
    { label: '手机号', key: 'phone', type: 'input' },
    // 单独覆盖：该字段始终独占一行
    { label: '备注', key: 'remark', type: 'input', col: { span: 24 } },
])

const formConfig = ref({
    // 中等屏幕起每行两列，大屏每行三列
    col: { span: 24, md: 12, lg: 8 },
    // 按钮并入最后一行并占满剩余空间
    buttonCol: 'auto',
    buttonAlign: 'right',
})

const handleSubmit = (data) => {
    console.log('提交数据:', data)
}
</script>
```

## Schema 配置

每个表单项的配置对象包含以下属性：

| 属性   | 类型    | 描述                                                                                                                                                                                                                 |
| ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label  | String  | 表单项的标签                                                                                                                                                                                                         |
| key    | String  | 表单项的唯一标识（字段名）                                                                                                                                                                                           |
| type   | String  | 表单项的类型, 默认 'input', 可选值: 'input', 'number', 'select', 'selectV2', 'radio', 'checkbox', 'date', 'time', 'timeSelect', 'autocomplete', 'cascader', 'inputTag', mention , 'rate', 'slider', 'switch', 'tree' |
| style  | Object  | 表单项的样式                                                                                                                                                                                                         |
| col    | Object  | 该字段的列配置，覆盖 commonConfig.col（详见「栅格布局」）                                                                                                                                                            |
| rules  | Array   | 表单项的验证规则                                                                                                                                                                                                     |
| help   | String  | 表单项的帮助提示信息                                                                                                                                                                                                 |
| hidden | Boolean | 是否隐藏该表单项                                                                                                                                                                                                     |
| props  | Object  | 传递给表单项组件的额外属性(见 Element Plus)                                                                                                                                                                          |
| slots  | Object  | 表单项的插槽配置(见 Element Plus)                                                                                                                                                                                    |

## 事件

| 事件名 | 参数     | 描述               |
| ------ | -------- | ------------------ |
| submit | formData | 表单验证通过后触发 |
| reset  | formData | 表单重置时触发     |
| cancel | -        | 取消操作时触发     |

## 方法

| 方法名         | 说明                                                       | 返回值   |
| -------------- | ---------------------------------------------------------- | -------- |
| validate       | 校验整个表单，可传入 Element Plus 的回调                   | Promise  |
| validateField  | 校验指定的若干字段，参数为字段名或字段名数组               | Promise  |
| resetFields    | 重置表单，将值恢复为初始值并移除校验结果                   | -        |
| clearValidate  | 移除表单的校验结果                                         | -        |
| setState       | 动态设置 `commonConfig` 配置                               | -        |
| getValues      | 获取当前表单数据                                           | Object   |

## 使用示例

### 普通组件

```vue
<template>
    <NeonForm
        v-model="formValues"
        :schema="formSchema"
        :commonConfig="formConfig"
        @submit="handleSubmit"
        @reset="handleReset"
        @cancel="handleCancel" />
</template>

<script setup>
import { ref } from 'vue'

const formValues = ref({
    name: '',
    age: null,
})

const formSchema = ref([
    {
        label: '姓名',
        key: 'name',
        type: 'input',
        rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    },
    {
        label: '年龄',
        key: 'age',
        type: 'number',
        rules: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    },
])

const formConfig = ref({
    buttonAlign: 'right',
    submitButtonOptions: {
        text: '保存',
    },
    resetButtonOptions: {
        text: '清空',
    },
})

const handleSubmit = (data) => {
    console.log('提交数据:', data)
}

const handleReset = (data) => {
    console.log('重置数据:', data)
}

const handleCancel = () => {
    console.log('取消表单')
}
</script>
```

### 使用 useNeonForm 创建表单

```vue
<template>
    <BaseForm />
</template>

<script setup>
import { useNeonForm } from '@/hooks'

const [BaseForm, formApi] = useNeonForm({
    modelValue: formValues,
    schema: formSchema,
    commonConfig: formConfig,
    onSubmit: async (data) => {
        await formApi.validate()
    },
    onReset: (data) => {},
    onCancel: () => {},
})
</script>
```
