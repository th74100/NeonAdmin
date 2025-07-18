import { HOME_PATH } from '@/config'

/** 基本路由，这些路由是必须存在的 */
export const staticRouter = [
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/layout/basic'),
        redirect: HOME_PATH || '/dashboard',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login'),
    },
]

/** 错误页面 */
export const errorRouter = [
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/error/404'),
        hidden: true,
        meta: {
            title: '404 Not Found',
        },
    },
]
