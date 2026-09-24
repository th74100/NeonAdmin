/**
 * * @description 事件总线 bus
 */
class EventBus {
    // 构造函数，初始化事件对象events
    constructor() {
        this.events = {}
    }

    // 注册事件监听器
    on(eventName, callback) {
        ;(this.events[eventName] ??= new Set()).add(callback)
    }

    // 触发事件
    emit(eventName, ...args) {
        this.events[eventName]?.forEach((callback) => callback(...args))
    }

    // 移除事件监听器
    off(eventName, callback) {
        this.events[eventName]?.delete(callback)
    }

    // 注册一次性事件监听器
    once(eventName, callback) {
        const hander = (...args) => {
            callback(...args)
            this.off(eventName, hander)
        }
        this.on(eventName, hander)
    }
}

export const bus = new EventBus()
