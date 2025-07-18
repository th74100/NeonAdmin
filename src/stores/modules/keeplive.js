import { defineStore } from 'pinia'

const keepliveStore = defineStore('keeplive', {
    state: () => {
        return {
            keepLive: [],
        }
    },
    actions: {
        filterKeepLive(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].meta.keepLive) {
                    this.keepLive.push(data[i].name)
                    const children = data[i].children
                    if (Array.isArray(children) && children.length) {
                        this.filterKeepLive(children)
                    }
                }
            }
        },
    },
    getters: {
        getKeepLive: (state) => state.keepLive,
    },
})

export default keepliveStore
