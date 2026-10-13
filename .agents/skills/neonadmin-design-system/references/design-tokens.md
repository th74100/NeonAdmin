# NeonAdmin 设计令牌详解

本文件是 `neonadmin-design-system` 技能的详细参考资料，列出全部 `--ne-*` 令牌的定义位置、取值与用途。

## 定义位置

- 亮色（`:root`）与暗色（`html.dark`）定义在 `src/styles/common.scss`。
- 深色侧边栏模式（`.is-dark`）在同一文件内覆写部分令牌。
- Element Plus 变量覆写在 `src/styles/theme.scss`，通过 `@forward 'element-plus/theme-chalk/src/common/var.scss' with (...)` 完成。

## 令牌表

| 令牌                    | 亮色值                          | 暗色值             | 用途                                       |
| ----------------------- | ------------------------------- | ------------------ | ------------------------------------------ |
| `--ne-font-family`      | 系统字体栈                      | 同亮色             | 全局字体                                   |
| `--ne-primary`          | `var(--el-color-primary)`       | 同亮色             | 主题色，跟随 Element Plus 主题变量         |
| `--ne-primary-light-9`  | `var(--el-color-primary-light-9)` | 同亮色           | 主题色最浅色阶，用于激活背景               |
| `--ne-slide`            | `#fff`                          | `#1c1e23`          | 侧边栏背景                                 |
| `--ne-slide-deep`       | `#fff`                          | `#131518`          | 侧边栏深层背景（主导航）                   |
| `--ne-slide-width`      | `305px`                         | 同亮色             | 侧边栏展开宽度                             |
| `--ne-slide-collapse`   | `135px`                         | 同亮色             | 侧边栏折叠宽度                             |
| `--ne-vert-slide-width` | `225px`                         | 同亮色             | 纵向布局侧边栏宽度                         |
| `--ne-background`       | `#fff`                          | `#14161a`          | 基础背景                                   |
| `--ne-background-deep`  | `#f5f7f9`                       | `#14161a`          | 页面底色                                   |
| `--ne-border`           | `#e4e4e7`                       | `#36363a`          | 边框                                       |
| `--ne-foreground`       | `#474a4d`                       | `#c8c8c9`          | 主要文字                                   |
| `--ne-muted-foreground` | `#71717a`                       | `#b2b2b3`          | 次要文字                                   |
| `--ne-header`           | `#fff`                          | `#1c1e23`          | 头部背景                                   |
| `--ne-card`             | `#fff`                          | `#1c1e23`          | 卡片背景                                   |
| `--ne-accent`           | `#f4f4f5`                       | `#2c2c2d`          | 强调/悬浮背景                              |
| `--ne-accent-deep`      | `#e3e6e8`                       | `#3a3d40`          | 更深的强调背景                             |
| `--ne-scrollbar`        | `#e3e3e4`                       | 未覆写（沿用亮色） | 滚动条滑块颜色                             |

> `--ne-scrollbar` 目前只在 `:root` 定义，暗色模式下沿用亮色值。

## `.is-dark` 深色侧边栏模式

`.is-dark` 覆写以下令牌，使侧边栏在亮色页面里也呈现深色：

- `--ne-slide`、`--ne-slide-deep`、`--ne-foreground`、`--ne-accent`、`--ne-accent-deep`。

## theme.scss 覆写的 Element Plus 变量

- 颜色：`success` `#13CE66`、`warning` `#E6A23C`、`danger`/`error` `#ff3860`。
- `$menu`：内边距、高度、透明边框、图标宽度。
- `$main`：`padding: 0`。
- `$table`：表头文字色 `#606266`、表头背景 `#f5f7fa`。
- `$empty`：`description-margin-top: 0px`。
- `$border-radius`：`base: 6px`；`$pagination`：`border-radius: 6px`。
- `$fill-color`：`light: #f5f5f5`。
- `$button-padding-horizontal`：`small: 10px`。
- `$date-editor`：日期类控件宽度 100%。
- `$dialog`：`margin-top: 10vh`、`padding-primary: 0`；`$drawer`：`padding-primary: 15px`。
- `$overlay-color`：`lighter: rgba(0, 0, 0, 0.3)`。
- `$tree`：`node-content-height: 30px`；`$messagebox`：`content-font-size: 15px`。

## 使用约束

- 新增颜色必须同时在 `:root` 与 `html.dark` 补充，否则暗色模式失效。
- 业务代码只引用 `--ne-*`，不直接写死十六进制颜色。
- 需要 Element Plus 主题色阶时用 `var(--el-color-primary-light-9)`。