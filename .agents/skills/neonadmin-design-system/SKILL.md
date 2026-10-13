---
name: neonadmin-design-system
description: NeonAdmin 的样式与设计规范：--ne-* 主题令牌、暗黑模式、UnoCSS 原子类与 fx-*/wh-full shortcut 的优先级、@apply 用法、Element Plus 样式覆写的位置与禁令。当需要写或改样式、调颜色、适配暗黑模式、换主题、处理 Element Plus 组件外观时使用。组件 API 用 neonadmin-component-usage，代码风格与注释用 neonadmin-code-conventions。
---

# NeonAdmin 样式与设计规范

## 样式文件职责

`src/styles/style.scss` 是样式入口，按顺序 `@use` 其余文件：

- `theme.scss`：用 `@forward ... with` 覆写 Element Plus 的 SCSS 变量（颜色、菜单、表格、弹窗等）。
- `common.scss`：设计令牌、全局样式、组件级样式覆写。
- `keyframes.scss`：关键帧动画。
- `transition.scss`：过渡类。

禁止在页面 `<style>` 里重写 Element Plus 的全局样式。需要改 Element Plus 外观时改 `common.scss`。

## 设计令牌

一律使用 `--ne-*` 变量，禁止写死颜色。

| 令牌                   | 用途                                        |
| ---------------------- | ------------------------------------------- |
| `--ne-primary`         | 主题色，映射 `--el-color-primary`           |
| `--ne-primary-light-9` | 主题色浅色底，映射 `--el-color-primary-light-9` |
| `--ne-background`      | 基础背景色                                  |
| `--ne-background-deep` | 更深一层背景（页面底色）                    |
| `--ne-card`            | 卡片背景                                    |
| `--ne-border`          | 边框色                                      |
| `--ne-foreground`      | 主要文字色                                  |
| `--ne-muted-foreground` | 次要文字色                                 |
| `--ne-accent`          | 强调/悬浮背景                               |
| `--ne-accent-deep`     | 更深的强调背景                              |
| `--ne-header`          | 头部背景                                    |
| `--ne-slide`           | 侧边栏背景                                  |
| `--ne-slide-deep`      | 侧边栏更深背景                              |
| `--ne-scrollbar`       | 滚动条颜色                                  |
| `--ne-slide-width`     | 侧边栏宽度（305px）                         |
| `--ne-slide-collapse`  | 侧边栏折叠宽度（135px）                     |
| `--ne-vert-slide-width` | 纵向布局侧边栏宽度（225px）                |

详细说明见 `references/design-tokens.md`。

## 暗黑模式

`html.dark` 下同名令牌已被覆写，因此只要使用变量，暗黑模式自动生效。

新增颜色必须同时在 `:root` 与 `html.dark` 两处补充，否则暗色下会失效。

## 写法优先级

1. UnoCSS 原子类
2. 项目 shortcut（`wh-full`、`fx-*`）
3. `common.scss` 语义类（如 `border-default`）
4. 页面 scoped 样式

## shortcut 清单

| shortcut     | 展开                              |
| ------------ | --------------------------------- |
| `wh-full`    | `w-full h-full`                   |
| `fx-start`   | `flex items-center justify-start` |
| `fx-center`  | `flex items-center justify-center` |
| `fx-between` | `flex items-center justify-between` |
| `fx-end`     | `flex items-center justify-end`   |
| `fx-col`     | `flex flex-col`                   |

## 字号刻度

`text-xs`(12) / `sm`(14) / `md`(16) / `lg`(18) / `xl`(20) / `2xl`(24)。

## 其他约定

- 主题色阶用 `var(--el-color-primary-light-9)`。
- 语义边框类：`.border-default`（`--ne-border`）与 `.border-primary`。
- 复用原子类用 `@apply`，例如 `@apply fx-center wh-full`。

## Element Plus 覆写禁令（重要）

不要在业务组件里用 `[&_.el-xxx]` 之类的后代选择器覆写 Element Plus 样式。原因有两条：

1. Element Plus 的类名前缀可以被 `ElConfigProvider` 的 `namespace` 改掉，写死 `.el-` 前缀会失配。
2. UnoCSS 是静态扫描，运行时拼不出选择器。

正确做法是给自己的元素加类，把样式作用在自己的元素上。

## 相关文档

- `references/design-tokens.md`