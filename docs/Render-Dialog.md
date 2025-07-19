# Vue 组件使用说明

## 简介

`renderDialog` 是一个基于 Element Plus 构建的动态对话框渲染函数，提供了灵活的配置、动态渲染、抽屉/对话框切换等功能。它通过函数调用动态创建对话框，支持传入任意 Vue 组件作为内容，并内置了按钮控制、异步操作处理等功能。

## 特性

- 🧩 **动态对话框创建** - 无需在模板中预先定义
- 📦 **内容组件封装** - 支持传入任意 Vue 组件作为内容
- 🔄 **属性动态更新** - 可在运行时修改对话框属性
- ⏳ **异步操作支持** - 内置加载状态处理
- 📥 **抽屉/对话框切换** - 通过 useDrawer 参数切换展示模式
- 🛠️ **实例控制** - 支持获取组件实例和手动关闭，通过 `setState` 动态更新对话框状态

## 依赖

- Vue 3
- Element Plus

## 参数说明

| 参数       | 类型         | 默认值 | 说明                                                                |
| ---------- | ------------ | ------ | ------------------------------------------------------------------- |
| component  | VueComponent | -      | 对话框中显示的内容组件 (必填)                                       |
| modalProps | Object       | -      | 对话框属性和事件配置（具体props，请查阅Element Plus文档）           |
| props      | Object       | -      | 对话传递给内容组件的属性框宽度（具体props，请查阅Element Plus文档） |

### modalProps 配置

| 参数              | 类型            | 默认值  | 说明                                                 |
| ----------------- | --------------- | ------- | ---------------------------------------------------- |
| title             | String          | '提示'  | 对话框标题                                           |
| width             | String / Number | '580px' | 对话框宽度                                           |
| alignCenter       | Boolean         | false   | 是否居中显示                                         |
| autoHeight        | Boolean         | false   | 是否自动高度                                         |
| showConfirmButton | Boolean         | true    | 是否显示确认按钮                                     |
| showCancelButton  | Boolean         | true    | 是否显示取消按钮                                     |
| confirmButtonText | String          | '确定'  | 确认按钮文本                                         |
| cancelButtonText  | String          | '取消'  | 取消按钮文本                                         |
| useDrawer         | Boolean         | false   | 是否使用抽屉模式                                     |
| drawerProps       | Object          | -       | 抽屉属性和事件配置                                   |
| slots             | Object          | -       | 自定义头部和底部按钮操作区 header, footer            |
| 其他              | -               | -       | https://element-plus.org/zh-CN/component/dialog.html |

## 事件

| 事件名    | 参数 | 说明                                                 |
| --------- | ---- | ---------------------------------------------------- |
| onConfirm | -    | 确认按钮回调                                         |
| onCancel  | -    | 取消/关闭回调                                        |
| onError   | -    | 错误处理回调                                         |
| 其他事件  | -    | https://element-plus.org/zh-CN/component/dialog.html |

## 实例方法

| 方法名   | 参数   | 类型         | 说明                          |
| -------- | ------ | ------------ | ----------------------------- |
| setState | Object | Function     | 动态更新对话框的一些props属性 |
| instance | -      | VueComponent | 获取对话框内容组件实例        |
| close    | -      | Function     | 手动关闭对话框                |

## 使用示例

### 基本使用

```vue
<template>
    <el-button
        type="primary"
        @click="open1">
        打开弹窗
    </el-button>
</template>

<script setup>
import { h } from 'vue'
import renderDialog from '@/utils/renderDialog'

const open1 = () => renderDialog(h('p', '一个基础的弹窗示例'))
</script>
```

### 抽屉模式

```vue
<template>
    <el-button
        type="primary"
        @click="open1">
        打开抽屉
    </el-button>
</template>

<script setup>
import { h } from 'vue'
import renderDialog from '@/utils/renderDialog'

const open1 = () => renderDialog(h('p', '一个抽屉示例'), { useDrawer: true })
</script>
```

### 自定义头部和底部按钮区域

```vue
<template>
    <el-button
        type="primary"
        @click="open1">
        打开弹窗
    </el-button>
</template>

<script setup>
import { h } from 'vue'
import renderDialog from '@/utils/renderDialog'

const open1 = () =>
    renderDialog(h('p', '一个基础的弹窗示例'), {
        slots: {
            header: () => h('span', '自定义头部'),
            footer: () => h('span', '自定义底部'),
        },
    })
</script>
```
