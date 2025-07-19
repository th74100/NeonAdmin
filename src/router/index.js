import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router'
import NProgress from 'nprogress'
import { tool } from '@/utils'
import { staticRouter, errorRouter } from './modules/staticRouter'
import { initDynamicRouter } from './modules/dynamicRouter'
import useAuthStore from '@/stores/modules/auth'
import useUserStore from '@/stores/modules/user'
import { LOGIN_PATH, HOME_PATH, ROUTER_MODE, META_TITLE } from '@/config'

const routes = [...staticRouter, ...errorRouter]

NProgress.configure({
    showSpinner: false, // 显示加载图标
})

const router = createRouter({
    history:
        'history' === ROUTER_MODE ? createWebHistory() : createWebHashHistory(),
    routes,
    scrollBehavior: () => ({
        left: 0,
        top: 0,
    }),
})

router.beforeEach(async (to, from, next) => {
    NProgress.start()

    const authStore = useAuthStore()
    const userStore = useUserStore()

    if (to.path.toLowerCase() === LOGIN_PATH) {
        if (userStore.token) {
            return next(decodeURIComponent(to.query?.redirect || HOME_PATH))
        }
        tool.setTitle(to.meta.title || META_TITLE)
        return next()
    }

    // 没有token且不在白名单，则跳转到登录页
    if (!userStore.token && !routes.some((item) => item.path === to.path)) {
        return next({
            path: LOGIN_PATH,
            query:
                to.fullPath === HOME_PATH
                    ? {}
                    : { redirect: encodeURIComponent(to.fullPath) },
            replace: true,
        })
    }

    // 如果没有菜单列表, 重新请求菜单列表并添加动态路由
    if (!authStore.getMenuList.length) {
        await initDynamicRouter()
        return next({ ...to, replace: true })
    }

    tool.setTitle(to.meta.title || META_TITLE)

    next()
})

router.afterEach(() => {
    NProgress.done()
})

router.onError((error) => {
    NProgress.done()
    console.log('路由错误', error)
})

export default router
