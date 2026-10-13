---
name: neonadmin-code-conventions
description: NeonAdmin 的代码风格与注释规范：Prettier 规则（无分号/单引号/4空格/属性每行一个）、命名约定、导入顺序，以及三种既有注释形式（多行 JSDoc、单行块注释、区块注释）的格式与内容要求。当新增或修改 .js/.vue 文件、需要按项目风格写注释或命名时使用。组件用法用 neonadmin-component-usage，样式用 neonadmin-design-system。
---

# NeonAdmin 代码风格与注释规范

## Prettier 规则

配置见 `.prettierrc`：

- 不写分号。
- 用单引号。
- 4 空格缩进。
- `bracketSameLine`：闭合括号跟随末行。
- `singleAttributePerLine`：标签属性每行一个。

模板示例：

```vue
<template>
    <div class="fx-center">
        <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit">
            提交
        </el-button>
    </div>
</template>
```

## 命名

| 对象             | 规则                              | 示例              |
| ---------------- | --------------------------------- | ----------------- |
| 组件目录/文件    | 大驼峰 + `Neon` 前缀              | `NeonTable`       |
| 组合式函数       | `use` + 小驼峰                    | `useNeonForm`     |
| 常量             | 全大写下划线                      | `PAGE_SIZE`       |
| 事件处理函数     | `handle` 前缀                     | `handleSubmit`    |
| 布尔值           | `is` / `has` / `show` 前缀        | `isActive`、`showPagination` |

## 导入顺序

第三方库在前，`@/` 别名模块在后。

## 注释规范（重点）

### 三种形式

1. 多行 JSDoc，用于函数与导出成员，`@description` 必写。

```js
/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export const generateUUID = () => {}
```

2. 单行块注释 `/** 栅格容器配置：el-row */`，用于局部变量、配置块、小逻辑。

```js
/** 栅格容器配置：el-row */
const _row = computed(() => ({ gutter: 18, ...commonConfig.value.row }))
```

3. 区块注释 `/** form */`，用于样式文件或模板大段落。

```scss
/** form */
.neon-form {
    // ...
}
```

### 格式要求

- 注释块内不要插入多余空行，`@description` / `@param` / `@returns` 连续书写。
- 块注释每行以 ` * ` 开头，结束行是独立的 ` */`。
- 单行注释写在被注释代码的上一行，不写在行尾。

### 内容要求

- 写「为什么」和「约束」，不写「是什么」。
- 正例：`// initTabs 之后 DOM 才出现真实 tab，再测一次容量并收敛标签数量` 这类说明原因的注释。
- 不保留被注释掉的死代码。
- `TODO` 必须写明原因与后续动作。

`src/styles/common.scss` 里的 `/** talbe */` 是拼写错误（应为 table），新代码写正确拼写，不要沿用。

## 提交前

`npm run lint` 与 `npm test` 必须 exit 0。