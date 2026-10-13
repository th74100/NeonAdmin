# NeonAdmin 工程约定详解

本文件是 `neonadmin-project-conventions` 技能的详细参考资料。`SKILL.md` 是入口，本文件展开技术栈、目录归属、状态管理、接口分层、命名与单元测试的具体做法。

## 1. 技术栈

| 项         | 选型                                                         |
| ---------- | ------------------------------------------------------------ |
| 框架       | Vue 3，Composition API + `<script setup>`                     |
| 语言       | JavaScript（唯一例外：`NeonSvg` 用 `lang="ts"`，历史遗留）    |
| UI         | Element Plus 2.x                                             |
| 原子化 CSS | UnoCSS `presetWind3`                                         |
| 构建       | Vite 7                                                       |
| 状态       | Pinia + `pinia-plugin-persistedstate`                        |
| 测试       | Vitest + `@vue/test-utils` + jsdom                           |

禁止使用 Options API。除 `NeonSvg` 外不要新增 `lang="ts"`，保持语言一致。

## 2. 常用命令

| 命令            | 作用             |
| --------------- | ---------------- |
| `npm run dev`   | 启动开发服务     |
| `npm run build` | 生产构建         |
| `npm run lint`  | ESLint 检查      |
| `npm test`      | 运行单元测试     |

提交前 `npm run lint` 与 `npm test` 必须 exit 0。

## 3. 目录职责

| 目录             | 职责                                                    | 归属规则                                       |
| ---------------- | ------------------------------------------------------- | ---------------------------------------------- |
| `src/api`        | 接口定义，由 `src/api/index.js` 统一 `export *`          | 新接口按模块放 `src/api/modules/<模块>/index.js` |
| `src/components` | 全局组件                                                | 多页面复用才放这里，统一 `Neon` 前缀           |
| `src/config`     | 全局常量                                                | 全局常量一律进 `src/config/index.js`           |
| `src/hooks`      | 组合式函数                                              | 统一 `use` 前缀，由 `src/hooks/index.js` 导出  |
| `src/icons`      | SVG 图标源文件                                          | 文件名与 `NeonSvg` 的 `name` 一致              |
| `src/layout`     | 布局组件                                                | 仅布局层使用                                   |
| `src/request`    | axios 实例与拦截器                                      | 业务代码不直接用 axios                         |
| `src/router`     | 路由配置                                                | 按模块拆到 `src/router/modules/`               |
| `src/stores`     | Pinia store                                             | 放 `src/stores/modules/`                       |
| `src/styles`     | 全局样式                                                | 令牌与覆写见 `neonadmin-design-system`         |
| `src/utils`      | 工具函数                                                | 按模块拆到 `src/utils/modules/`                |
| `src/views`      | 页面                                                    | 页面私有组件放页面目录                         |

归属判断：只被一个页面使用的组件留在页面目录；出现第二个页面复用再提到 `src/components`。

## 4. 命名约定

| 对象          | 规则                       | 示例                          |
| ------------- | -------------------------- | ----------------------------- |
| 组件目录/文件 | 大驼峰 + `Neon` 前缀       | `NeonTable`、`NeonForm`       |
| 页面目录      | 小写，按模块分组           | `views/system/user.vue`       |
| 组合式函数    | `use` + 小驼峰             | `useNeonForm`、`useRef`       |
| 常量          | 全大写下划线               | `PAGE_SIZE`、`PINIA_PREFIX`   |
| 事件处理      | `handle` 前缀              | `handleSubmit`                |
| 布尔值        | `is` / `has` / `show` 前缀 | `isActive`、`showPagination`  |
| Pinia store   | `defineStore('<小驼峰>')`  | `defineStore('tabs')`         |

## 5. 状态管理

- store 放 `src/stores/modules/`，采用 Options 风格 `defineStore`，与 `tabs.js`、`global.js` 保持一致。
- 持久化配置写在 store 的 `persist` 字段，key 加 `PINIA_PREFIX` 前缀。

```js
persist: {
    enabled: true,
    key: `${PINIA_PREFIX}TABS`,
    storage: sessionStorage,
}
```

- 不要直接修改 store 数组里的元素对象，通过 action 修改，保证可追踪与可测试。
- 只读派生数据放 `getters`，例如 `getTabsList`。

## 6. 接口分层

- 接口定义放 `src/api`，由 `src/api/index.js` 统一 `export *`。
- 请求实例与拦截器放 `src/request`，业务代码不直接使用 axios。
- 常量来自 `src/config`：`API_URL`、`REQUEST_TIMEOUT`、`TOKEN_KEY`。

```js
// src/api/modules/common/index.js
import request from '@/request'

export const getList = (params) => request.get('/list', { params })
```

## 7. 单元测试约定

- 测试放 `tests/`，组件测试 `tests/components/<组件名>.spec.js`，store 测试 `tests/stores/<store 名>.spec.js`。
- 渲染 `el-*` 组件必须注册 Element Plus。

```js
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ElementPlus from 'element-plus'
import NeonContainer from '@/components/NeonContainer/index.vue'

const mountContainer = (options = {}) =>
    mount(NeonContainer, {
        global: { plugins: [ElementPlus] },
        ...options,
    })

describe('NeonContainer', () => {
    it('提供 header 插槽时渲染其内容', () => {
        const wrapper = mountContainer({
            slots: { header: '<div class="my-header">标题</div>' },
        })
        expect(wrapper.find('.my-header').text()).toBe('标题')
    })
})
```

- 用例描述用中文。
- 每个断言都必须能因对应行为回归而失败，禁止 `toBeGreaterThan(0)` 这类恒真断言。
- 断言组件契约，而不是 Element Plus 的内部实现细节。
- 像素级视觉效果无法在 jsdom 断言，改为断言配置落到了正确的 class/属性，并注明需人工验证。
- 异步渲染（如 `el-table` 列注册）需要 `await nextTick()` 后再断言。

## 8. 提交前自查清单

- [ ] 组件放对目录，命名符合约定，全局组件带 `Neon` 前缀。
- [ ] 未使用 Options API，业务代码未直接调用 axios。
- [ ] store 通过 action 修改，持久化 key 带 `PINIA_PREFIX` 前缀。
- [ ] 样式使用 `--ne-*` 令牌，未写死颜色，暗色模式已同步。
- [ ] 注释符合三种既有形式，写清原因与约束，无死代码。
- [ ] 新增/修改行为有对应单元测试，断言非恒真，测试文件放在正确目录。
- [ ] `npm run lint` 与 `npm test` 均 exit 0。