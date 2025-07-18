import { defineStore } from 'pinia'
import generateRoutes from '@/router/generateRoutes'
import { getMenus, getUserInfo } from '@/api'

const authStore = defineStore('auth', {
    state: () => {
        return {
            // 菜单列表
            menuList: [],

            // 用户信息
            user: {},

            // token
            token: '',
        }
    },
    actions: {
        // 获取用户信息
        async userInfo() {
            const { data } = await getUserInfo()
            this.user = data
        },

        // 获取菜单
        async listRouters() {
            const { data } = await getMenus()
            this.menuList = generateRoutes(data)
        },

        // 设置token
        setToken(token) {
            this.token = token
        },
    },
    getters: {
        getMenuList: (state) => state.menuList,
        getUserInfo: (state) => state.user,
        getToken: (state) => state.token,
    },
})

export default authStore
