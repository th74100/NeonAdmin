import useAuthStore from '@/stores/modules/auth'
import useUserStore from '@/stores/modules/user'
import useKeepLive from '@/stores/modules/keepLive'
import router from '@/router'
import { LOGIN_PATH } from '@/config'

/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const keepLiveStore = useKeepLive()

    try {
        // 获取用户信息
        await authStore.userInfo()

        // 获取菜单列表
        await authStore.listRouters()

        // 判断用户是否拥有菜单权限
        if (authStore.menuList == null || authStore.menuList.length <= 0) {
            userStore.setToken('')
            router.replace(LOGIN_PATH)
        }

        keepLiveStore.filterKeepLive(authStore.menuList)

        // 动态添加路由
        const asyncRoutes = flatAsyncRoutes(authStore.menuList)
        asyncRoutes.forEach((item) => {
            router.addRoute('Layout', item)
        })
    } catch (error) {
        userStore.setToken('')
        router.replace(LOGIN_PATH)
        return Promise.reject(error)
    }
}

// 扁平化异步路由
const flatAsyncRoutes = (routes, breadcrumb = []) => {
    let res = []
    routes.forEach((route) => {
        // 创建当前路由的副本（避免修改原对象）
        const currentRoute = {
            ...route,
            meta: {
                ...route.meta,
                breadcrumb: [
                    ...breadcrumb,
                    {
                        path: route.path,
                        name: route.name,
                        meta: {
                            ...route.meta,
                        },
                        children: route.children || [],
                    },
                ],
            },
        }

        // 添加当前路由
        res.push(currentRoute)

        // 如果有子路由，递归处理
        if (Array.isArray(route.children) && route.children.length) {
            const childrenRoutes = flatAsyncRoutes(
                route.children,
                currentRoute.meta.breadcrumb,
            )

            res.push(...childrenRoutes)
        }
    })

    return res
}
