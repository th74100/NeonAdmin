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

| 属性               | 类型    | 默认值           | 描述                  |
| ------------------ | ------- | ---------------- | --------------------- |
| values             | Object  | {}               | 表单的初始值          |
| schema             | Array   | []               | 表单项配置数组        |
| commonConfig       | Object  | {}               | 公共配置对象          |
| collapsed          | Boolean | true             | 默认是否展开          |
| showCollapseButton | Boolean | false            | 是否显示折叠/展开按钮 |
| collapseButtonText | Array   | ['展开', '收起'] | 折叠/展开按钮的文本   |
| collapseCount      | Number  | 2                | 默认显示多少项        |

## commonConfig 配置

`commonConfig` 对象包含以下属性：

| 属性                | 类型   | 默认值                 | 描述                                    |
| ------------------- | ------ | ---------------------- | --------------------------------------- |
| wrapperClass        | String | -                      | 表单的样式                              |
| labelPosition       | String | 'right'                | 表单项标签的位置 'left', 'right', 'top' |
| actionWrapperClass  | String | 'col-start--2 ml-auto' | 表单项按钮 item 的样式                  |
| submitButtonOptions | Object | -                      | 提交按钮的配置                          |
| resetButtonOptions  | Object | -                      | 重置按钮的配置                          |
| cancelButtonOptions | Object | -                      | 取消按钮的配置                          |

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

## Schema 配置

每个表单项的配置对象包含以下属性：

| 属性   | 类型    | 描述                                                                                                                                                                                                                 |
| ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label  | String  | 表单项的标签                                                                                                                                                                                                         |
| key    | String  | 表单项的唯一标识（字段名）                                                                                                                                                                                           |
| type   | String  | 表单项的类型, 默认 'input', 可选值: 'input', 'number', 'select', 'selectV2', 'radio', 'checkbox', 'date', 'time', 'timeSelect', 'autocomplete', 'cascader', 'inputTag', mention , 'rate', 'slider', 'switch', 'tree' |
| style  | Object  | 表单项的样式                                                                                                                                                                                                         |
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

| 方法名         | 说明                                                 | 类型     |
| -------------- | ---------------------------------------------------- | -------- |
| validate       | 任一表单项被校验后触发                               | Function |
| validateFields | 验证表单某一些字段                                   | Array    |
| resetFields    | 对该表单项进行重置，将其值重置为初始值并移除校验结果 | Function |
| clearValidate  | 移除该表单项的校验结果                               | Function |
| setState       | 设置表单组件的状态                                   | Object   |
| getValues      | 获取表单数据                                         | Object   |

## 使用示例

### 普通组件

```vue
<template>
    <NeonForm
        :values="formValues"
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
    actionWrapperClass: 'flex justify-end',
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
import useNeonForm from '@/hooks'

const [BaseForm, formApi] = useNeonForm({
    value: formValues,
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
