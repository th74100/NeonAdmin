---
name: neonadmin-component-usage
description: NeonAdmin 项目的全局组件与工具用法：NeonContainer、NeonForm、NeonTable、NeonSvg、NeonCharts、NeonEditor 的 props/slots/事件，以及 renderDialog 动态弹窗与 useNeonForm / useRef hooks。当需要在本仓库里使用、修改或新增页面/组件、不确定某个 Neon 组件的 API 时使用。样式与主题问题用 neonadmin-design-system，代码风格与注释用 neonadmin-code-conventions。
---

# NeonAdmin 组件使用

本技能说明 NeonAdmin 里组件的注册方式与常用组件的 API 约定。长表格放在 `references/` 下，按需再读。

## 全局注册机制

- Element Plus 图标已全量注册（`src/utils/loadVuePlugins.js` 遍历 `@element-plus/icons-vue`），模板里直接写 `<ArrowDown />`，不要手动 import。
- 本地图标在 `src/components/NeonIcons`，组件名是 `Neon` + 文件名：`Activity.vue` 对应 `<NeonActivity />`。
- 业务组件由 `unplugin-vue-components` 按需自动引入，模板里直接写 `<neon-xxx>`，不需要 import；在 JS 中使用（例如 `renderDialog` 的入参）必须显式 import。

## NeonContainer

四类插槽：

| 插槽      | 渲染位置 | 说明                               |
| --------- | -------- | ---------------------------------- |
| `header`  | 顶部     | 带下边框的标题区，不传则不渲染     |
| `default` | 主体     | 带边框的卡片容器                   |
| `content` | 主体     | 渲染在 `el-scrollbar` 内，适合长内容 |
| `footer`  | 底部     | 不传则不渲染                       |

- `default` 与 `content` 不要同时使用：`default` 优先，`content` 不会渲染，开发环境会 `console.warn`。
- 空插槽不再渲染占位容器（例如空的 `#header` 不会留下空白块）。

## NeonForm

`v-model` + `schema` 驱动。布局走 Element Plus 的 `el-row` / `el-col`，不再依赖 CSS Grid。

- `commonConfig.col`：全局默认列配置，默认 `{ span: 24 }`，即每行一列。
- `item.col`：单个字段覆盖全局列配置，合并规则 `{ ...commonConfig.col, ...item.col }`。
- `commonConfig.row`：透传给 `el-row`，默认 `{ gutter: 18 }`。
- `commonConfig.buttonCol`：按钮列配置。`false`（默认，按钮独占一行）/ 对象（透传给 `el-col`）/ `'auto'`（按钮并入最后一行占满剩余空间）。
- `commonConfig.buttonAlign`：按钮对齐方式，`start` / `center` / `right`，默认 `right`。

两条硬限制：

1. 列数只能是 24 的约数：1、2、3、4、6、8、12、24。
2. 断点用 Element Plus 的：`sm` 768 / `md` 992 / `lg` 1200 / `xl` 1920，不是 UnoCSS 的断点。

不要再写 `grid-cols-*`，`.neon-form` 已经不是 `display: grid`。已移除的废弃配置：`wrapperClass`、`actionWrapperClass`，不要使用。

组件实例方法：`validate` / `validateField`（单数）/ `resetFields` / `clearValidate` / `setState` / `getValues`。

完整 API 见 `references/neon-form.md`。

## NeonTable

`columns` + `dataSource` + `options` 三个核心入参。

- 单元格渲染优先级：`slot` 优先于 `formatter(row)`，`formatter(row)` 优先于 `render({ row, index })`，最后回退到 `row[prop]`。
- `type` 支持 `'index'`（按分页跨页连续编号）/ `'selection'` / `'expand'`。
- 分页默认 `pageSize: 30`（`PAGE_SIZE`）、`pageSizes: [10, 20, 30, 40, 50, 100]`（`PAGE_SIZE_OPTIONS`）。
- 事件：`sizeChange` / `currentChange` / `paginationChange`。

完整 API 见 `references/neon-table.md`。

## NeonSvg

```vue
<neon-svg name="ne-home" width="30px" height="30px" />
```

- `name` 必填，缺失会触发 Vue 警告。
- 图标文件放 `src/icons`，`name` 与文件名一致。

## NeonCharts / NeonEditor

- 两者 `width` / `height` 默认都是 `'100%'`，传数字会自动补 `px`。
- NeonEditor 另外支持 `mode` / `disabled` / `actionClass`。

## renderDialog

`renderDialog(Component, { title, width, onConfirm, onCancel, onClose, onError, ... })`，返回 `{ setState, instance, close }`。

- 传 `useDrawer: true` 切换为抽屉模式，`drawerProps` 透传给 `el-drawer`。
- 内容组件在 JS 中使用，需要显式 import。

详见 `docs/Render-Dialog.md`。

## hooks

- `useNeonForm({ modelValue, schema, commonConfig, onSubmit, onReset, onCancel })` 返回 `[Component, formApi]`。
- `formApi` 暴露 `validate` / `validateField`（单数）/ `resetFields` / `clearValidate` / `setState` / `getValues`。
- 历史上存在 `validateFileds` 拼写与 `validateFields` 命名，均已废弃，不要再用。
- `useRef(init)` 返回 `[state, resetForm]`。

## 相关文档

- `references/neon-form.md`、`references/neon-table.md`（本技能内）
- `docs/Render-Dialog.md`