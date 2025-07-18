/** 生成路由 */
const modules = import.meta.glob('../views/**/*.vue')
const emptyLayout = () => import('../layout/empty')

const generateRoutes = (datas) => {
    const result = []

    const _create = (item) => {
        const { path, name, component, redirect, meta } = item
        const route = {
            path,
            name,
            component: loadComponent(component),
            redirect,
            meta,
        }

        // 递归
        if (item.children && item.children.length > 0) {
            route.children = item.children.map((child) => _create(child))
        }
        return route
    }

    // 遍历菜单数据生成路由表
    datas.forEach((item) => {
        const route = _create(item)
        result.push(route)
    })

    return result
}

/** 加载组件 */
const loadComponent = (component) => {
    if (!component) return emptyLayout

    const page = modules[`../views/${component}.vue`]
        ? modules[`../views/${component}.vue`]
        : modules[`../views/${component}/index.vue`]

    return page || emptyLayout
}

export default generateRoutes
