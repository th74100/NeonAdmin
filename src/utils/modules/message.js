import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'

const types = ['success', 'error', 'warning', 'info']

/**
 * * @description 消息提示
 * * @param {String} message 消息内容
 * * @param {String} type 消息类型，默认info，可选值：success/warning/info/error
 * * @param {Number} duration 消息显示时间
 * * @param {Object} args 其他参数，详见：https://element-plus.org/zh-CN/component/message.html
 */
const messageInfo = (type, message, args = {}) => {
    if (!types.includes(type)) {
        console.error(`Invalid message type! Like: ${types.join(' | ')}`)
        return
    }
    const { duration = 2000, grouping = true, plain = true } = args
    ElMessage({
        type,
        message,
        duration,
        grouping,
        plain,
        ...args,
    })
}

export const $message = {
    info: (message, args) => messageInfo('info', message, args),
    success: (message, args) => messageInfo('success', message, args),
    warning: (message, args) => messageInfo('warning', message, args),
    error: (message, args) => messageInfo('error', message, args),
}

/**
 * * @description 通知提示
 * * @param {String} type 通知类型，默认info，可选值：success/warning/info/error
 * * @param {String} title 通知标题
 * * @param {String} message 通知内容
 * * @param {Number} duration 消息显示时间
 * * @param {Object} args 其他参数，详见：https://element-plus.org/zh-CN/component/notification.html
 */
export const showNotification = (type, title, message, opts) => {
    const messageTypes = types.concat(['primary'])
    if (!messageTypes.includes(type)) {
        console.error(`Invalid message type! Like: ${messageTypes.join(' | ')}`)
        return
    }
    ElNotification({
        type,
        title,
        message,
        ...opts,
    })
}

export const $notification = {
    primary: (title, message, opts) =>
        showNotification('primary', title, message, opts),
    info: (title, message, opts) =>
        showNotification('info', title, message, opts),
    success: (title, message, opts) =>
        showNotification('success', title, message, opts),
    warning: (title, message, opts) =>
        showNotification('warning', title, message, opts),
    error: (title, message, opts) =>
        showNotification('error', title, message, opts),
}

/**
 * * @description 确认提示
 * * @param {String} message 消息内容
 * * @param {String} title 消息标题
 */
const messageBox = (type, message, opts = { title: '提示' }) => {
    if (!types.includes(type)) {
        console.error(`Invalid message type! Like: ${types.join(' | ')}`)
        return
    }
    const { title = '提示', ...params } = opts
    ElMessageBox({
        type,
        title,
        message,
        ...params,
    })
}

export const $msgbox = {
    info: (message, opts) => messageBox('info', message, opts),
    success: (message, opts) => messageBox('success', message, opts),
    warning: (message, opts) => messageBox('warning', message, opts),
    error: (message, opts) => messageBox('error', message, opts),
    confirm: (message, opts = {}) => {
        const { title = '提示', type = 'warning', ...args } = opts
        ElMessageBox.confirm(message, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type,
            cancelButtonClass: 'is-plain',
            ...args,
        })
            .then(() => {
                opts.onConfirm && opts.onConfirm()
            })
            .catch(() => {
                opts.onCancel && opts.onCancel()
            })
    },
}
