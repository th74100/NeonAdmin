# NeonForm 栅格布局改造 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `NeonForm` 的表单布局从手写 UnoCSS grid 类名改为基于 `el-row` / `el-col` 的配置化栅格，并让按钮列支持三种取值。

**Architecture:** 模板层用 `el-row` + 每项一个 `el-col` 承载布局；`commonConfig` 新增 `row` / `col` / `buttonCol` 三个配置，`schema` 单项可用 `col` 覆盖；按钮对齐改由自有容器 + `justify-*` 工具类完成，不依赖 Element Plus 内部类名。

**Tech Stack:** Vue 3（`<script setup>`）、Element Plus 2.14、UnoCSS（presetWind3）、Vite 7、SCSS。

---

## 约定与前置说明

### 验证方式（重要）

本项目原本**没有测试框架**。Task 0 会先引入 `vitest` + `@vue/test-utils`，之后各任务按需补测试。验证手段：

| 手段 | 命令 | 作用 |
| --- | --- | --- |
| 单元测试 | `npm test` | Vitest，组件行为与配置逻辑 |
| 语法检查 | `npm run lint` | ESLint + Prettier 规则 |
| 构建检查 | `npm run build` | 编译、UnoCSS 生成、SCSS 编译 |
| 人工验证 | `npm run dev` + 浏览器 | 布局、对齐、折叠、校验错误等视觉项 |

### 不做 git 提交

按用户要求，本计划**不执行 git commit**。任务末尾的"检查点"仅用于确认产物状态，不提交。

### 参考文档

- 设计文档：`docs/superpowers/specs/2026-10-13-neon-form-grid-design.md`

---

## 文件结构

| 文件 | 职责 | 操作 |
| --- | --- | --- |
| `src/components/NeonForm/index.vue` | 表单组件：模板栅格结构、栅格配置计算、按钮对齐 | 修改 |
| `src/styles/common.scss` | `.neon-form` 基础样式（去掉 grid/gap 与 `mb-0`） | 修改 |
| `uno.config.js` | 移除仅为旧 grid 方案存在的 `gridColumnStart` / `gridColumnEnd` | 修改 |
| `src/views/system/user.vue` | 示例页，栅格类名迁移到 `commonConfig.col` | 修改 |
| `src/views/example/form/basic.vue` | 示例页，迁移到 `commonConfig.col` | 修改 |
| `src/views/example/form/dynamic.vue` | 示例页，迁移到 `commonConfig.col` | 修改 |
| `docs/Neon-Form.md` | 组件文档，补充栅格用法 | 修改 |
| `docs/使用说明.md` | 项目说明文档，补充栅格用法 | 修改 |

---

## Task 0: 引入 Vitest 测试基础设施

**Files:**
- Modify: `package.json`（新增脚本与 devDependencies）
- Create: `vitest.config.js`
- Create: `tests/components/NeonForm.spec.js`

- [ ] **Step 1: 安装依赖**

```bash
npm i -D vitest @vue/test-utils jsdom
```

- [ ] **Step 2: 新建 vitest.config.js**

不要直接复用 `vite.config.js`——它加载了图片压缩、SVG 图标、Prism、自动导入等生产插件，会让测试变慢且容易报错。单独建配置，只挂 `vue` 插件与路径别名：

```js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve('./src'),
            '~': path.resolve('./src/views'),
        },
        extensions: ['.js', '.ts', '.json', '.vue'],
        mainFiles: ['index'],
    },
    test: {
        environment: 'jsdom',
        include: ['tests/**/*.spec.js'],
        globals: true,
    },
})
```

- [ ] **Step 3: 新增 npm 脚本**

在 `package.json` 的 `scripts` 中加入：

```json
        "test": "vitest run",
        "test:watch": "vitest"
```

- [ ] **Step 4: 写改造前的行为基线测试**

`tests/components/NeonForm.spec.js`，断言**当前**行为（改造后这些断言会被后续任务更新）：

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import NeonForm from '@/components/NeonForm/index.vue'

const global = {
    stubs: {
        ElForm: false,
        ElFormItem: false,
    },
}

describe('NeonForm 基线', () => {
    it('渲染 schema 中未隐藏的字段', () => {
        const wrapper = mount(NeonForm, {
            props: {
                modelValue: { a: '' },
                schema: [
                    { label: 'A', key: 'a' },
                    { label: 'B', key: 'b', hidden: true },
                ],
            },
            global,
        })
        expect(wrapper.findAll('.el-form-item').length).toBeGreaterThan(0)
    })

    it('按钮行默认渲染提交与重置按钮', () => {
        const wrapper = mount(NeonForm, {
            props: {
                modelValue: { a: '' },
                schema: [{ label: 'A', key: 'a' }],
            },
            global,
        })
        expect(wrapper.text()).toContain('提交')
        expect(wrapper.text()).toContain('重置')
    })
})
```

若挂载 `NeonForm` 时因 Element Plus 组件解析报错，改为在 `global.plugins` 中全量注册 Element Plus：

```js
import ElementPlus from 'element-plus'
const global = { plugins: [ElementPlus] }
```

- [ ] **Step 5: 运行测试**

Run: `npm test`
Expected: 2 个用例通过

- [ ] **Step 6: 检查点**

确认 `npm test` / `npm run lint` / `npm run build` 三条命令都能跑通，作为后续任务的回归基线。

---

## Task 1: 模板改为 el-row / el-col 结构

**Files:**
- Modify: `src/components/NeonForm/index.vue:2-103`（template）

- [ ] **Step 1: 替换 form 内部结构**

把 `<el-form>` 内部的 `<template v-for>` 片段和按钮 `<el-form-item>` 包进 `el-row` / `el-col`。`v-show` 从 `el-form-item` 上移到 `el-col`（否则折叠时隐藏项仍占栅格位，出现空档）。

替换后的 template 结构（保留原有属性与插槽内容不变）：

```vue
<el-form
    ref="form"
    :model="formData"
    v-bind="tool.omit(_options, ['wrapperClass'])"
    @submit.prevent="onSubmit(formInstance)"
    class="neon-form"
    :class="['neon-form', _options.wrapperClass]">
    <el-row v-bind="_row">
        <el-col
            v-for="(item, index) in fieldItems"
            :key="item.key"
            v-show="isCollapsed || index < collapseCount"
            v-bind="getColProps(item)">
            <el-form-item
                :label="item.label"
                :labelWidth="item.labelWidth"
                :prop="item.key"
                :rules="item.rules"
                :style="getStyle(item)">
                <template
                    v-if="item.help"
                    #label>
                    <div class="flex items-center gap-[5px]">
                        <span>{{ item.label }}</span>
                        <el-tooltip
                            :content="item.help"
                            placement="right">
                            <el-icon>
                                <Warning />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </template>
                <slot :name="item.key">
                    <component-item
                        :modelValue="formData"
                        :item="item" />
                </slot>
            </el-form-item>
        </el-col>

        <el-col
            v-if="
                (_buttons.submitButtonOptions.show ||
                    _buttons.resetButtonOptions.show ||
                    _buttons.cancelButtonOptions.show) &&
                fieldItems.length
            "
            v-bind="_buttonCol">
            <el-form-item :class="_buttons.actionWrapperClass">
                <slot name="buttons">
                    <!-- 提交 / 重置 / 取消 三个 el-button 原样保留 -->
                </slot>
                <!-- 折叠/展开按钮原样保留 -->
            </el-form-item>
        </el-col>
    </el-row>
</el-form>
```

注意：`el-col` 与 `el-form-item` 之间不要插入额外的 `div`（按钮容器是在 `el-form-item` **内部**，见 Task 4）。

说明：本步按钮 `el-form-item` 上仍保留 `:class="_buttons.actionWrapperClass"`，因为此时 `alignMap` 还是旧值；Task 4 会把这层 class 迁到内层自有容器。

- [ ] **Step 2: 语法检查**

Run: `npm run lint -- src/components/NeonForm/index.vue`
Expected: 无 error（此时 `_row` / `_col` / `_buttonCol` 尚未定义，但 ESLint 不解析模板变量，仍应通过）

- [ ] **Step 3: 检查点**

确认模板中：每个表单项外层是 `el-col`，`v-show` 在 `el-col` 上，按钮行在独立的 `el-col` 内。此时不要运行 `npm run build`，因为计算属性还没定义，构建会报错——统一在 Task 2 完成后构建。

---

## Task 2: 新增 row / col / buttonCol 计算属性

**Files:**
- Modify: `src/components/NeonForm/index.vue`（script，`_options` 计算属性之后）

- [ ] **Step 1: 新增栅格计算属性**

在 `const _options = computed(...)` 之后插入：

```js
/** 栅格容器配置：el-row */
const _row = computed(() => ({
    gutter: 18,
    ...(commonConfig.row || {}),
}))

/** 全局默认列配置：el-col */
const _col = computed(() => ({
    span: 24,
    ...(commonConfig.col || {}),
}))

/** 单字段列配置：全局默认 + item.col 覆盖 */
const getColProps = (item) => ({
    ..._col.value,
    ...(item.col || {}),
})

/** 按钮列配置 */
const _buttonCol = computed(() => {
    const { buttonCol } = commonConfig

    // 'auto'：不锁宽度，用 flex 吃掉当前行剩余空间
    if (buttonCol === 'auto') {
        return { span: 24, class: '!flex-auto' }
    }

    // false / 未配置 / 非法值：独占一行
    if (!buttonCol || typeof buttonCol !== 'object') {
        return { span: 24 }
    }

    // 对象：整体透传给 el-col
    const { span = 24, offset = 0 } = buttonCol
    if (import.meta.env.DEV && span + offset > 24) {
        // eslint-disable-next-line no-console
        console.warn(
            '[NeonForm] buttonCol 的 span + offset 超过 24，按钮列会换行',
            buttonCol,
        )
    }
    return { span: 24, ...buttonCol }
})
```

- [ ] **Step 2: 在 `_options` 中排除新增配置项**

`_options` 会把 `commonConfig` 里除按钮相关字段外的内容透传给 `el-form`。新增的 `row` / `col` / `buttonCol` 必须排除，否则会作为无效属性落到 `el-form` 上。

把 `tool.omit(commonConfig, [...])` 的数组改为：

```js
        tool.omit(commonConfig, [
            'buttonAlign',
            'submitButtonOptions',
            'resetButtonOptions',
            'cancelButtonOptions',
            'row',
            'col',
            'buttonCol',
        ]),
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 构建成功；产物 CSS 中出现 `.el-row` / `.el-col-24`（若此前未使用过 el-row/el-col，则说明样式已随组件引入）

- [ ] **Step 4: 检查点**

默认不传配置时，表单应渲染为每行一列，视觉与改造前一致。

---

## Task 3: 把 `col` 加入 rootProps 隔离列表

**Files:**
- Modify: `src/components/NeonForm/index.vue:315-323`（`rootProps`）

- [ ] **Step 1: 加入 col**

```js
const rootProps = [
    'label',
    'key',
    'type',
    'style',
    'rules',
    'help',
    'wrapperClass',
    'col',
]
```

原因：`getProps(item)` 的实现是 `tool.omit(Object.assign(item, _props), rootProps)`，不在 `rootProps` 中的字段会被透传给真实输入组件。若不排除，`item.col`（对象）会被渲染成 `col="[object Object]"`。

- [ ] **Step 2: 验证**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 3: 人工验证（临时）**

在 `src/views/example/form/basic.vue` 的 schema 第一项临时加 `col: { span: 12 }`，启动 `npm run dev`，用 DevTools 检查第一个输入框的 DOM，确认**没有** `col` 属性残留。验证后移除该临时修改（正式迁移在 Task 6）。

---

## Task 4: 按钮对齐改为自有容器 + justify 工具类

**Files:**
- Modify: `src/components/NeonForm/index.vue`（template 按钮段 + `alignMap`）

- [ ] **Step 1: 修改 alignMap**

```js
/** 按钮配置 */
const alignMap = {
    start: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
}
```

旧的 `col-start--2 ml-auto` / `mr-auto` / `mx-auto` 是 grid / 块级定位语义，迁移后失效，全部替换为 flex 的 `justify-*`。取值名与现有 API 保持一致（`start` / `center` / `right`，默认 `right`）。

- [ ] **Step 2: 把 actionWrapperClass 应用到自有容器**

`actionWrapperClass` 由原来的 `el-form-item` 改绑到内层自有容器。`_buttons` 中已有的合并逻辑保持不变：

```js
const itemActionWrapperClass = actionWrapperClass ?? alignMap[buttonAlign]
```

语义：**用户传了 `actionWrapperClass` 就用用户的，否则用 `buttonAlign` 对应的 `justify-*`**，与改造前的优先级一致。

模板改为：

```vue
<el-col
    v-if="
        (_buttons.submitButtonOptions.show ||
            _buttons.resetButtonOptions.show ||
            _buttons.cancelButtonOptions.show) &&
        fieldItems.length
    "
    v-bind="_buttonCol">
    <el-form-item>
        <div :class="['flex flex-wrap w-full', _buttons.actionWrapperClass]">
            <slot name="buttons">
                <!-- 提交 / 重置 / 取消 原样保留 -->
            </slot>
            <!-- 折叠/展开按钮原样保留 -->
        </div>
    </el-form-item>
</el-col>
```

即：`el-form-item` 上不再绑定 `:class`，对齐与自定义样式统一由这一层 `div` 承担。

- [ ] **Step 3: 构建与人工验证**

Run: `npm run build`
Expected: 构建成功

人工验证：
1. `npm run dev`，打开表单页
2. 按钮应右对齐（默认 `buttonAlign: 'right'`）
3. 设 `commonConfig.buttonAlign = 'center'` → 居中；`'start'` → 左对齐；`'right'` → 右对齐
4. 打开 `src/views/login/index.vue`（其 `actionWrapperClass: 'w-full mt-5'`），确认按钮仍为整行宽度、顶部有外边距
5. DevTools 确认按钮所在元素是 `div.flex.flex-wrap.w-full.justify-end`，且任何选择器里都不出现 `el-form-item__content`
## Task 5: 调整 .neon-form 样式（去掉 grid 与 mb-0）

**Files:**
- Modify: `src/styles/common.scss:348-352`

- [ ] **Step 1: 移除 grid/gap 与 mb-0**

```scss
/** form */
.neon-form {
    .el-form-item {
        @apply items-center;
    }
```

即：
- 删除 `.neon-form { @apply grid gap-[18px]; }` 这一行（栅格现在由 `el-row` / `el-col` 负责）
- 把 `.el-form-item { @apply items-center mb-0; }` 改为 `@apply items-center;`，让 Element Plus 原生的 `--el-form-item-margin-bottom`（default 尺寸 18px）回来，作为纵向间距

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 3: 人工验证纵向间距**

1. `npm run dev`，打开一个字段较多的表单页（如 `src/views/system/user.vue`）
2. 行与行之间应有约 18px 间距
3. 触发一次校验错误，确认红色错误文案**不压到**下一行字段上

若出现间距不生效（margin 塌陷），改用退路：在 `el-row` 上绑定 `:style="{ rowGap: _row.gutter + 'px' }"`，并同时把 `.el-form-item` 的 `margin-bottom` 归零（`mb-0`），避免双倍间距。

---

## Task 6: 清理 uno.config.js 中的旧 grid 扩展

**Files:**
- Modify: `uno.config.js`

- [ ] **Step 1: 全量检索引用**

Run:

```powershell
Get-ChildItem src -Recurse -Include *.vue,*.js | Select-String -Pattern 'col-start--|col-end--|gridColumnStart|gridColumnEnd' | ForEach-Object { $_.Path + ':' + $_.LineNumber }
```

Expected: 只应出现在 `src/components/NeonForm/index.vue` 的旧 `alignMap`（Task 4 已删除）。若还有其他引用，先停止并记录，不要删除配置。

- [ ] **Step 2: 删除扩展**

在 `uno.config.js` 的 `theme.extend` 中删除：

```js
        extend: {
            gridColumnStart: {
                '-2': '2',
            },
            gridColumnEnd: {
                '-1': '-1',
            },
        },
```

删除 `extend` 后若 `theme` 下只剩 `fontSize`，保持结构合法：

```js
    theme: {
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
        },
    },
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 构建成功，无 UnoCSS 相关告警

---

## Task 7: 迁移所有使用表单栅格的页面

**Files:**
- Modify: `src/views/system/user.vue:3-11`
- Modify: `src/views/example/form/basic.vue:659`
- Modify: `src/views/example/form/dynamic.vue:138`

- [ ] **Step 1: 迁移 user.vue**

该页面把栅格类名写在 `<neon-form>` 标签的 `class` 上，需改为配置方式。原写法：

```vue
        <neon-form
            v-model="formData"
            :schema="formItems"
            :collapsed="false"
            :show-collapse-button="true"
            :collapse-count="4"
            @submit="handleSearchSubmit"
            class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        </neon-form>
```

改为：

```vue
        <neon-form
            v-model="formData"
            :schema="formItems"
            :collapsed="false"
            :show-collapse-button="true"
            :collapse-count="4"
            :common-config="formGridConfig"
            @submit="handleSearchSubmit">
        </neon-form>
```

并在 `<script setup>` 中新增常量：

```js
/** 表单栅格配置：1 / 2 / 3 / 4 列响应式 */
const formGridConfig = {
    col: { span: 24, sm: 12, md: 8, lg: 6 },
}
```

注意：该文件内另有一处 `useNeonForm({ ..., commonConfig: { labelWidth: '80px', buttons: {...} } })`（弹窗表单用），与栅格无关，不要改动。

- [ ] **Step 2: 迁移 basic.vue**

原：

```js
wrapperClass: 'm-[15px] lg:grid-cols-2 xl:grid-cols-3',
```

改为：

```js
wrapperClass: 'm-[15px]',
col: { span: 24, md: 12, lg: 8 },
```

- [ ] **Step 3: 迁移 dynamic.vue**

原：

```js
wrapperClass: 'm-[15px] lg:grid-cols-2 xl:grid-cols-4',
```

改为：

```js
wrapperClass: 'm-[15px]',
col: { span: 24, md: 12, lg: 6 },
```

说明：原断点是 UnoCSS 的 `lg:1024` / `xl:1280`，Element Plus 为 `md:992` / `lg:1200`，按就近取值。

- [ ] **Step 4: 构建验证**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 5: 人工验证**

`npm run dev`，依次打开 `user.vue`、`basic.vue`、`dynamic.vue`，拖动窗口宽度，确认列数在断点处按预期变化，且间距正常。

- [ ] **Step 6: 补充栅格用法示例**

按 Spec §6.2 的要求，在 `src/views/example/form/basic.vue` 中补充以下用法（可在同页分区块展示）：

1. 全局多列：`commonConfig.col = { span: 24, md: 12, lg: 8 }`（Step 2 已迁移，确认效果）
2. 单字段跨列：给某个字段加 `col: { span: 24 }`，使其独占一行
3. 按钮列三种取值：
   - `buttonCol: false` —— 默认，按钮独占一行
   - `buttonCol: { span: 8, offset: 16 }` —— 走 `el-col` 原生 API
   - `buttonCol: 'auto'` —— 按钮并入最后一行并占满剩余空间（**该演示前面要放一个 `col: { span: 12 }` 的字段**，否则最后一行没有剩余空间，看不出与默认值的差别）

若基本表单页已过于拥挤，可在 `src/views/example/form/` 下新增一个示例页承载，并参照同目录其他示例页的接入方式登记。

- [ ] **Step 7: 构建验证（示例补充后）**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 8: 确认无残留**

Run:

```powershell
Get-ChildItem src/views -Recurse -Include *.vue | Select-String -Pattern 'grid-cols-'
```

Expected: 只剩作用在普通 `div` 上的用法（`dashboard/index.vue`、`example/echarts/index.vue`、`example/modal/index.vue`），不再有作用在 `neon-form` 或 `wrapperClass` 上的栅格类名。
## Task 8: 更新文档

**Files:**
- Modify: `docs/Neon-Form.md`
- Modify: `docs/使用说明.md`

- [ ] **Step 1: 在 Neon-Form.md 补充栅格章节**

新增小节，覆盖：

- `commonConfig.row`：透传 `el-row`，`gutter` 默认 18
- `commonConfig.col`：全局默认列，默认 `{ span: 24 }`（每行一列）
- `item.col`：单字段覆盖
- `commonConfig.buttonCol`：`false`（独占一行）/ 对象（走 `el-col` 原生 span、offset）/ `'auto'`（占满剩余空间）
- 明确写出：列数受 24 等分栅格限制，只能取 24 的约数（1、2、3、4、6、8、12、24）
- 断点说明：使用 Element Plus 断点（sm 768 / md 992 / lg 1200 / xl 1920），与 UnoCSS 断点不同
- 修正在表格中把 `actionWrapperClass` 默认值写成 `'col-start--2 ml-auto'` 的旧描述（该值来自已废弃的 grid 方案），改为说明「默认值由 `buttonAlign` 推导，可选 `justify-start` / `justify-center` / `justify-end`」
- 补充 `buttonAlign` 的取值说明：可选 `start` / `center` / `right`，默认 `right`（避免使用者误写 `left`）

- [ ] **Step 2: 在 使用说明.md 同步**

若该文档含表单布局相关章节，补充同样的栅格说明；若无相关章节，跳过并在完成记录中说明。

- [ ] **Step 3: 检查点**

文档中不出现已被删除的 `grid-cols-*` 用法示例。

---

## Task 9: 最终验证

**Files:** 无（验证任务）

- [ ] **Step 1: 全量 lint**

Run: `npm run lint`
Expected: 无 error

- [ ] **Step 2: 生产构建**

Run: `npm run build`
Expected: 构建成功；确认输出中没有 `Circular chunk` 告警复发

- [ ] **Step 3: 逐条核对验收标准**

对照 `docs/superpowers/specs/2026-10-13-neon-form-grid-design.md` 第 8 节 10 条验收标准，逐条在浏览器中确认，并记录结果。

- [ ] **Step 4: 回归检查**

`npm run dev` 后依次打开：

- `src/views/system/user.vue`（含 NeonForm + NeonTable）
- `src/views/example/form/basic.vue`
- `src/views/example/form/dynamic.vue`
- `src/views/login/index.vue`（使用自定义 `actionWrapperClass: 'w-full mt-5'`）
- `src/views/example/form/query.vue`
- `src/views/example/drawer/index.vue`
- `src/views/example/modal/index.vue`

确认：提交、重置、校验、折叠展开、按钮对齐均正常。

---

## 附录：风险提示

| 风险 | 触发条件 | 应对 |
| --- | --- | --- |
| 纵向间距不生效 | `el-form-item` 的 margin 被父级塌陷 | 用 `el-row` 的 `rowGap` 退路，同时归零 margin（见 Task 5 Step 3） |
| `el-col` 换行 | `span + offset > 24` | 组件已加 dev 警告（Task 2） |
| 断点位置与改造前不同 | 迁移页面 | 已在 Task 7 说明，属预期 |
| inline 模式间距变化 | 使用 `commonConfig.inline` 的页面 | 移除 `mb-0` 后 inline 表单项会恢复 18px 下边距，Task 9 回归时确认 |