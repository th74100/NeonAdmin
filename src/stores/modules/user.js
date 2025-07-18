import { defineStore } from 'pinia'
import { tool } from '@/utils'
import { PINIA_PREFIX } from '@/config'

const userStore = defineStore('user', {
    persist: {
        enabled: true,
        key: `${PINIA_PREFIX}USER`,
        storage: localStorage,
        serializer: {
            serialize(value) {
                return tool.serialize(value)
            },
            deserialize(value) {
                return tool.deserialize(value)
            },
        },
    },
    state: () => {
        return {
            token: '',
        }
    },
    actions: {
        setToken(token) {
            this.token = token
        },
        clearToken() {
            this.token = ''
        },
    },
    getters: {
        getToken: (state) => state.token,
    },
})

export default userStore
