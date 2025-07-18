/**
 * @description 问候语
 * @returns string
 */
export const timeFix = () => {
    const time = new Date()
    const hour = time.getHours()
    return hour < 6
        ? '凌晨好🌙，注意休息，保持健康！'
        : hour < 9
          ? '早上好⛅，新的一天开始啦！'
          : hour < 12
            ? '上午好🌅，愿你今天心情愉快！'
            : hour < 14
              ? '中午好🌞，记得午休和补充能量哦！'
              : hour < 18
                ? '下午好☀️，继续加油，收获满满！'
                : hour < 21
                  ? '傍晚好🌇，放松一下，享受美好时光！'
                  : hour < 24
                    ? '晚上好🌃，一天辛苦啦，早点休息！'
                    : '已深夜🌙，注意身体，早点休息哦！'
}

/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export const generateUUID = () => {
    let uuid = ''
    for (let i = 0; i < 32; i++) {
        let random = (Math.random() * 16) | 0
        if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
        uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(
            16,
        )
    }
    return uuid
}

/**
 * @description 判断是否为空值
 * @param {any} value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
    if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length === 0
    }

    if (value instanceof Map || value instanceof Set) {
        return value.size === 0
    }

    if (value instanceof WeakMap || value instanceof WeakSet) {
        throw new Error('WeakMap and WeakSet are not supported.')
    }

    if (Array.isArray(value)) {
        return value.length === 0
    }
    return value === null || value === void 0 || value === ''
}

/**
 * * @description 树结构扁平化
 * * @param {Array} tree 树结构
 */
export const flatTree = (tree) => {
    // 使用reduce方法遍历树结构
    return tree.reduce((prev, item) => {
        // 将当前节点的children属性和其它属性分开
        let { children, ...res } = item

        // 将当前节点和其子节点合并到结果数组中
        return [...prev, res, ...(children ? flatTree(children) : [])]
    }, [])
}

/**
 * * @description 滚动到错误位置
 */
export const scrollIntoError = () => {
    const errorEl = document.querySelector('.is-error')
    if (errorEl)
        errorEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
}
