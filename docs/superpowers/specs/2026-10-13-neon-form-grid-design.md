# NeonForm 栅格布局改造设计

- 日期：2026-10-13
- 状态：待评审
- 涉及组件：`src/components/NeonForm/index.vue`

## 1. 背景

`NeonForm` 是基于 `el-form` 的配置化表单组件，表单项由 `schema` 数组驱动，渲染在表单根节点下。

当前多列布局依赖 UnoCSS 的 grid 工具类，用户必须手写一长串响应式类名，例如：

```vue
<neon-form class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
```

或在 `commonConfig.wrapperClass` 中写：

```js
wrapperClass: 'm-[15px] lg:grid-cols-2 xl:grid-cols-3'
```

问题：

1. 类名冗长，每页重复书写，容易写错。
2. 列数完全依赖用户手写，没有统一的配置入口。
3. 无法按字段单独控制跨列。

## 2. 目标

1. 用 Element Plus 原生的 `el-row` / `el-col` 替代手写 grid 类名。
2. 提供全局默认列配置与单字段覆盖能力。
3. 默认行为保持"每行一列"，不破坏未显式配置的页面。
4. 按钮行默认独占一行，可通过配置改为并排。
5. 不新增自定义 CSS 文件或样式规则。

## 3. 非目标

1. 不追求"任意列数"。采用 `el-col` 的 24 等分栅格，列数受限于 24 的约数。
2. 不引入新的响应式断点体系，直接使用 Element Plus 的断点。
3. 不改动 `schema` 中表单项控件的渲染逻辑（`ComponentItem`、`componentMaps` 保持原样）；仅需把新增的 `col` 加入 `rootProps` 排除列表，避免它被透传给输入控件（见 5.3）。
4. 不改动表单校验、重置、提交的行为。

## 4. 现状与关键事实

以下事实均已通过阅读源码或构建产物核实，作为设计依据。

### 4.1 表单根节点当前是 grid 容器

`src/styles/common.scss:340`：

```scss
.neon-form {
    @apply grid gap-[18px];
    .el-form-item {
        @apply items-center mb-0;
    }
}
```

纵向与横向间距均来自 `gap-[18px]`，并且 `el-form-item` 的默认 `margin-bottom` 已被 `mb-0` 归零。

### 4.2 el-col 的宽度完全由预编译类决定

`node_modules/element-plus/es/components/col/src/col.vue_vue_type_script_setup_true_lang.mjs` 中，`el-col` 的 `style` 计算属性只处理 gutter 内边距，不产生任何宽度：

```js
const style = computed(() => {
    const styles = {}
    if (gutter.value) styles.paddingLeft = styles.paddingRight = `${gutter.value / 2}px`
    return styles
})
```

宽度来自 `colKls` 生成的类名（`el-col-{span}`、`el-col-{size}-{span}` 等）。

### 4.3 可用的 span 只有 0~24 的整数

`node_modules/element-plus/theme-chalk/src/col.scss`：

```scss
@for $i from 0 through 24 {
    .#{$namespace}-col-#{$i} {
        max-width: (math.div(1, 24) * $i * 100) * 1%;
        flex: 0 0 (math.div(1, 24) * $i * 100) * 1%;
    }
}
```

响应式部分走 `mixins/_col.scss` 的 `col-size($size)`，同样是 0~24。

结论：可用列数为 24 的约数，即 1、2、3、4、6、8、12、24。5、7、9、10、11 列无法实现。

### 4.4 el-col 的 span 默认值是 24

`node_modules/element-plus/es/components/col/src/col.mjs`：

```js
span: { type: Number, default: 24 }
```

即不传 `span` 时也会生成 `el-col-24`（`flex: 0 0 100%`）。

### 4.5 el-row 是 flex 容器，gutter 只提供水平间距

`node_modules/element-plus/theme-chalk/src/row.scss`：`.el-row { display: flex; flex-wrap: wrap; }`

`node_modules/element-plus/es/components/row/src/row.vue_vue_type_script_setup_true_lang.mjs`：

```js
const style = computed(() => {
    const styles = {}
    if (!props.gutter) return styles
    styles.marginRight = styles.marginLeft = `-${props.gutter / 2}px`
    return styles
})
```

gutter 只产生 row 的左右负 margin 和 col 的左右 padding，**不产生纵向间距**。

### 4.6 Element Plus 断点与项目 UnoCSS 断点不一致

| | xs | sm | md | lg | xl | 2xl |
| --- | --- | --- | --- | --- | --- | --- |
| Element Plus（`theme-chalk/src/common/var.scss`） | <768 | 768 | 992 | 1200 | 1920 | — |
| UnoCSS presetWind3（项目现用） | — | 640 | 768 | 1024 | 1280 | 1536 |

迁移现有页面时列数变化的临界宽度会改变，必须按 Element Plus 断点重新配置，不能直接平移。

### 4.7 表单内容容器与错误提示的定位

构建产物中确认：`.el-form-item__content` 为 `display:flex; flex-wrap:wrap`。

`node_modules/element-plus/theme-chalk/src/form-item.scss` 中确认：

```scss
@include e(error) {
    color: getCssVar('color-danger');
    font-size: 12px;
    line-height: 1;
    padding-top: ...;
    position: absolute;
    top: 100%;
    left: 0;
}
```

错误提示是绝对定位，因此行与行之间必须留出纵向间距，否则错误提示会压到下一行。

### 4.8 工具类与 Element Plus 样式的先后顺序

构建产物 `dist/assets/css/a5a4c2b9.css` 中实测字符位置：`flex-1` 在 75167，`el-col-24` 在 188688。UnoCSS 工具类在前，Element Plus 在后，同特异性时 Element Plus 胜出。

因此任何需要覆盖 `el-col-*` 的工具类必须使用 `!` 重要标记（项目已在 `src/layout/components/NeonTabs.vue` 等处使用该写法）。

## 5. 方案设计

### 5.1 结构

`NeonForm` 的模板结构调整为：


el-form
└── el-row                 ← 栅格容器，gutter 由 commonConfig.row 提供
    ├── el-col × N         ← 每个表单项一个，span 由 commonConfig.col / item.col 决定
    │   └── el-form-item
    └── el-col             ← 按钮与折叠按钮，由 commonConfig.buttonCol 决定
        └── el-form-item
            └── div        ← 自有容器，负责按钮水平对齐（见 5.5）


### 5.2 新增配置项

全部放在 `commonConfig` 下，与已有的 `wrapperClass`、`buttonAlign`、`actionWrapperClass` 保持一致。

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `row` | Object | `{ gutter: 18 }` | 透传给 `el-row`，支持 `gutter`、`justify`、`align` |
| `col` | Object | `{ span: 24 }` | 全局默认列配置，透传给每个 `el-col` |
| `buttonCol` | `false` \| Object \| `'auto'` | `false` | 按钮列的配置，见 5.4 |
默认值合并语义（避免"传入部分字段就丢掉默认值"的歧义）：

- `row`：`{ gutter: 18, ...commonConfig.row }`
- `col`：`{ span: 24, ...commonConfig.col }`

### 5.3 单字段覆盖

`schema` 的每一项支持新增字段 `col`：

```js
;[
    { label: '用户名', key: 'username', col: { span: 12, lg: 8 } },
    { label: '地址', key: 'address', col: { span: 24 } },
]
```

合并规则：`{ ...commonConfig.col, ...item.col }`。
**隔离要求**：`item.col` 只用于栅格定位，不能透传给输入控件，因此必须把 `col` 加入 `src/components/NeonForm/index.vue` 的 `rootProps`（当前为 `['label', 'key', 'type', 'style', 'rules', 'help', 'wrapperClass']`）。

依据是 `getProps` 的实现：

```js
return tool.omit(Object.assign(item, _props), rootProps)
```

不在 `rootProps` 中的字段会被原样透传给真实输入组件。若不排除，`col`（对象）会被渲染成 `col="[object Object]"` 这样的无效属性。

### 5.4 buttonCol 取值

| 值 | 行为 | 生成的 el-col 属性 |
| --- | --- | --- |
| `false`（默认） | 独占一行 | `{ span: 24 }` |
| 对象 | 按配置的栅格应用 | `{ span: 24, ...buttonCol }` |
| `'auto'` | 自动占满当前行剩余空间 | `{ span: 24 }` + `!flex-auto` 类 |

`'auto'` 的行为说明：`el-row` 是 `flex-wrap` 容器，`!flex-auto` 生成 `flex: 1 1 auto !important`，覆盖 `.el-col-24 { flex: 0 0 100% }`。

- 当前行仍有空列时：按钮并入该行并吃掉剩余空间。
- 当前行已满时：按钮换行到下一行。由于 flex 项的 `min-width: auto` 生效（`el-col` 未设置 `min-width`），按钮不会被压成 0 宽，而是正常换行并撑满该行。
- 使用 `!` 标记的原因见 4.8。

`buttonCol` 为对象时，`span` 与 `offset` 之和不得超过 24，否则 `el-col` 会换行。该约束在文档中说明；实现中在开发环境对超限情况给出 `console.warn`。

### 5.5 按钮对齐

当前 `alignMap`：

```js
const alignMap = {
    start: 'mr-auto',
    center: 'mx-auto',
    right: 'col-start--2 ml-auto',
}
```

`col-start--2` 来自 `uno.config.js` 中对 `gridColumnStart` 的扩展，是 grid 定位，迁移后失效。

`actionWrapperClass` 现在加在 `el-form-item` 根节点上，而按钮实际渲染在 Element Plus 的 `.el-form-item__content` 内。若把对齐写成 `[&_.el-form-item__content]:justify-end` 这类后代选择器，就等于把 Element Plus 的类名前缀硬编码进项目代码：

- `useNamespace`（运行时）与 SCSS `$namespace`（构建时）确实能拿到前缀，但 UnoCSS 是静态扫描，运行时字符串无法参与 CSS 生成（实测：`[&_.el-form-item__content]:justify-end` 被解析为 `.el-form-item _content`，直接失效）。
- 一旦使用者通过 `ElConfigProvider` 的 `namespace` 或 SCSS `$namespace` 改前缀，该选择器立即失效。

因此改为**不依赖 Element Plus 内部类**：在 `el-form-item` 内包一层自己的容器，对齐作用在自己的元素上。

改前：

```text
.el-form-item
  └─ .el-form-item__content
       ├─ <el-button> 提交
       └─ <el-button> 展开
```

改后：

```text
.el-form-item
  └─ .el-form-item__content
       └─ <div class="flex flex-wrap w-full justify-end">
            ├─ <el-button> 提交
            └─ <el-button> 展开
```

依据：`.el-form-item__content` 是 `display:flex; flex-wrap:wrap; flex:1; min-width:0` 的弹性容器，自有容器只需 `w-full` 撑满它，水平对齐由自己控制。

`alignMap` 相应改为普通工具类：

```js
const alignMap = {
    start: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
}
```

`commonConfig.actionWrapperClass` 仍然作为完全自定义的入口保留，优先级通过 `actionWrapperClass ?? alignMap[buttonAlign]` 体现：用户传了就用用户的，否则用 `buttonAlign` 推出的 `justify-*`。该结果统一作用在上述自有容器上，`el-form-item` 不再承载此类。

同时移除 `uno.config.js` 中仅为该场景存在的 `gridColumnStart: { '-2': '2' }` 与 `gridColumnEnd: { '-1': '-1' }` 扩展（确认无其他引用后执行）。

### 5.6 纵向间距

采用"删除 `mb-0`"的方案，让 Element Plus 原生的 `el-form-item` 上下间距回来：

```scss
.neon-form {
    @apply grid gap-[18px];        /* 改为不带 grid/gap */
    .el-form-item {
        @apply items-center;        /* 删除 mb-0 */
    }
}
```

具体改动：

- 移除 `.neon-form` 上的 `grid` 与 `gap-[18px]`（改为普通块级容器）。
- 移除 `.el-form-item` 上的 `mb-0`，恢复 Element Plus 默认的 `margin-bottom`（default 尺寸为 18px）。

说明：`el-form-item` 的 `margin-bottom` 来自 CSS 变量 `--el-form-item-margin-bottom`，default 尺寸下为 18px，与 gutter 的 18px 保持一致。

若实测出现 margin 塌陷导致间距不生效，退路是在 `el-row` 上以内联 `:style="{ rowGap: gutter + 'px' }"` 补足纵向间距。**采用该退路时必须同时把 `.el-form-item` 的纵向 margin 重新归零**，否则 `margin-bottom` 与 `rowGap` 叠加，行距翻倍。两种情况都不新增 CSS 文件。

### 5.7 v-show 位置调整

当前 `v-show="isCollapsed || index < collapseCount"` 挂在 `el-form-item` 上。包裹 `el-col` 后必须上移到 `el-col`，否则折叠时隐藏项的 `el-col` 仍占据栅格位置，出现空档。

`v-show` 生成内联 `display:none`，优先级高于 `.el-col-*` 的 `display:block`，行为正确。

### 5.8 commonConfig 的属性透传隔离

`_options` 目前把 `commonConfig` 中除按钮相关字段外的所有内容透传给 `el-form`：

```js
const _options = computed(() => {
    const config = { wrapperClass: '', labelPosition: 'right' }
    return Object.assign(config, tool.omit(commonConfig, [
        'buttonAlign', 'submitButtonOptions', 'resetButtonOptions', 'cancelButtonOptions',
    ]))
})
```

新增的 `row`、`col`、`buttonCol` 必须加入 `tool.omit` 的排除列表，否则会作为无效属性落到 `el-form` 上。

## 6. 迁移

### 6.1 受影响页面

经全量检索（`grid-cols-` 与 `wrapperClass` 的使用点），当前依赖表单 grid 类名实现多列的页面有三个：

| 文件 | 现有写法 | 迁移后 |
| --- | --- | --- |
| `src/views/system/user.vue` | `<neon-form class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">` | 去掉 class，改用 `:common-config="{ col: { span: 24, sm: 12, md: 8, lg: 6 } }"` |
| `src/views/example/form/basic.vue` | `wrapperClass: 'm-[15px] lg:grid-cols-2 xl:grid-cols-3'` | `wrapperClass: 'm-[15px]'`；`commonConfig.col = { span: 24, md: 12, lg: 8 }` |
| `src/views/example/form/dynamic.vue` | `wrapperClass: 'm-[15px] lg:grid-cols-2 xl:grid-cols-4'` | `wrapperClass: 'm-[15px]'`；`commonConfig.col = { span: 24, md: 12, lg: 6 }` |

其余使用 `grid-cols-*` 的位置（`NeonSetting.vue`、`NeonTabs.vue`、`dashboard/index.vue`、`example/echarts/index.vue`、`example/modal/index.vue`）都作用在普通 `div` 上，与表单无关，不受本次改动影响。

（注：`src/views/system/user.vue` 通过 `<neon-form>` 标签上的 `class` 使用栅格，见上表。）

映射说明：由于 4.6 节所述的断点差异，上表按 Element Plus 断点就近取值。`basic.vue` 与 `dynamic.vue` 中的 `m-[15px]` 属于外边距，继续保留在 `wrapperClass` 中。

### 6.2 示例页

在 `src/views/example/form/basic.vue` 或新建示例中补充栅格布局的用法示例，覆盖：

- 全局 `commonConfig.col` 多列布局
- 单字段 `item.col` 跨列
- `buttonCol` 的三种取值

## 7. 风险与限制

| 风险 | 说明 | 应对 |
| --- | --- | --- |
| 列数受限于 24 的约数 | 无法实现 5、7、9 列 | 已在非目标中明确；如需任意列数需改用 CSS 变量方案 |
| 断点体系变更 | 迁移后列数变化的宽度与原来不同 | 按 Element Plus 断点重新配置，见 6.1 |
| 纵向间距依赖 margin | 若发生 margin 塌陷则间距失效 | 退路为 `el-row` 内联 `rowGap`，见 5.6 |
| 每个表单项多一层 DOM | `el-col` 包裹 | 可接受，换取原生栅格能力 |
| `gutter` 的负 margin | `el-row` 左右各外扩 `gutter/2` | col 的 padding 会补偿，内容仍与表单边缘对齐；外层 margin 需大于 `gutter/2` |

## 8. 验收标准

1. `npm run build` 通过，无新增构建告警。
2. 不配置 `commonConfig.row/col/buttonCol` 时，表单渲染为每行一列，与改造前视觉一致。
3. `commonConfig.col = { span: 12 }` 时，每行两列。
4. 单个字段设置 `item.col = { span: 24 }` 时独占一行，其余字段遵循全局配置。
5. `buttonCol` 为 `false` 时按钮独占一行；为 `{ span: 8 }` 时按钮占 8/24 宽；为 `'auto'` 时按钮并入最后一行并占满剩余空间。
6. 折叠态下隐藏项不占位，展开后恢复正常。
7. 表单校验失败时错误提示不与下一行重叠，`scrollIntoError` 仍能滚动到错误项。
8. `buttonAlign` 为 `start` / `center` / `right` 时按钮在按钮列内正确对齐。
9. 三个受影响页面（`user.vue`、`basic.vue`、`dynamic.vue`）迁移后布局正常。
10. `docs/Neon-Form.md` 与 `docs/使用说明.md` 中与表单布局相关的说明同步更新。

## 9. 决策记录

1. `buttonCol: 'auto'` 保留。理由：覆盖"按钮并排占满剩余空间"这一原始诉求，实现成本仅为新增一个取值分支。
2. `uno.config.js` 中的 `gridColumnStart: { '-2': '2' }` 与 `gridColumnEnd: { '-1': '-1' }` 扩展随本次改造移除。实现前先全量检索这两个键的引用，确认无其他使用点后执行删除。
3. 默认行为保持"每行一列"，未配置 `commonConfig.col` 时视觉与改造前一致。
4. 按钮对齐采用"自有容器 + `justify-*` 工具类"，不使用 Element Plus 内部类选择器。理由：避开类名前缀硬编码，同时不受 Element Plus 内部结构变动影响，代价仅为每个表单多一层 `div`。