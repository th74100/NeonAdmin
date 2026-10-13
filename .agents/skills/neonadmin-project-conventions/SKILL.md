---
name: neonadmin-project-conventions
description: NeonAdmin 的总体工程约定：技术栈、目录职责与组件归属、状态管理（Pinia 持久化）与接口分层（api/request/config）、单元测试写法与自查清单。当在本仓库做规划、新增模块、判断代码该放哪里、或需要整体性约定时使用。组件 API 用 neonadmin-component-usage，样式用 neonadmin-design-system，命名与注释用 neonadmin-code-conventions。
---

# NeonAdmin 工程约定

## 技术栈

Vue 3（Composition API + `<script setup>`）、JavaScript（唯一例外 `NeonSvg` 用 `lang="ts"`，属历史遗留，新代码不要模仿）、Element Plus 2.x、UnoCSS `presetWind3`、Vite 7、Pinia + 持久化插件、Vitest + `@vue/test-utils` + jsdom。

禁止使用 Options API。

## 常用命令

- `npm run dev` 启动开发服务。
- `npm run build` 生产构建。
- `npm run lint` 代码检查。
- `npm test` 运行单元测试。

提交前 `lint` 与 `test` 必须 exit 0。

## 目录职责

| 目录              | 职责                                             |
| ----------------- | ------------------------------------------------ |
| `src/api`         | 接口定义，由 `src/api/index.js` 统一 `export *`   |
| `src/components`  | 多页面复用的全局组件                             |
| `src/config`      | 全局常量                                         |
| `src/hooks`       | 组合式函数                                       |
| `src/icons`       | SVG 图标源文件                                   |
| `src/layout`      | 布局组件                                         |
| `src/request`     | axios 实例与拦截器                               |
| `src/router`      | 路由配置                                         |
| `src/stores`      | Pinia store                                      |
| `src/styles`      | 全局样式                                         |
| `src/utils`       | 工具函数                                         |
| `src/views`       | 页面                                             |

归属规则：只被一个页面使用的组件放页面目录，多页面复用才提到 `components/`；全局组件统一 `Neon` 前缀；全局常量一律进 `src/config/index.js`。

## 状态管理

- store 放 `src/stores/modules/`，用 Options 风格 `defineStore`（与 `tabs.js`、`global.js` 一致）。
- 持久化 key 加 `PINIA_PREFIX` 前缀。
- 不要直接改 store 数组里的元素对象，通过 action 修改。

## 接口分层

- 接口定义放 `src/api`，由 `src/api/index.js` 统一 `export *`。
- 请求实例与拦截器放 `src/request`，业务代码不直接用 axios。
- 常量来自 `src/config`（`API_URL` / `REQUEST_TIMEOUT` / `TOKEN_KEY`）。

## 单元测试

- 测试放 `tests/`，组件测试 `tests/components/<组件名>.spec.js`，store 测试 `tests/stores/<store 名>.spec.js`。
- 渲染 `el-*` 必须 `global: { plugins: [ElementPlus] }`。
- 用例描述用中文。
- 每个断言都必须能因对应行为回归而失败，禁止 `toBeGreaterThan(0)` 这类恒真断言。
- 断言组件契约而非 Element Plus 内部实现。
- 像素级视觉效果无法在 jsdom 断言，改为断言配置落到了正确的 class/属性并注明需人工验证。

## 提交前自查清单

- [ ] 组件放对目录，命名符合约定。
- [ ] 没有 Options API，没有直接使用 axios。
- [ ] 样式使用 `--ne-*` 令牌，未写死颜色。
- [ ] 注释符合三种既有形式，写清原因与约束。
- [ ] 新增/修改行为有对应单元测试，断言非恒真。
- [ ] `npm run lint` 与 `npm test` 均 exit 0。

## 相关文档

- `references/neonadmin-conventions.md`