import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.locale('zh-cn')
dayjs.updateLocale('zh-cn', {
    relativeTime: {
        future: '%s',
        past: '%s前',
        s: '1秒钟',
        ss: '%d秒',
        d: '1天',
        dd: '%d天',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年',
    },
})

/**
 * 计算时间差
 * @params {string} time 时间戳 1742978021，默认秒
 * 如果是当前时间：时:分
 * 如果是相差一天：昨天
 * 如果相差超过一天：星期几
 * 如果相差超过一个星期：年/月/日 时:分
 * @returns {string} 20:30, 昨天，星期几，25年03月26日 20:30
 */
export const timeDiff = (time) => {
    if (!time) return ''
    const weeks = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
    ]

    const _time = time.toString().length === 10 ? time * 1000 : time

    // 当天 显示时分
    if (dayjs(_time).isToday()) {
        return dayjs(_time).format('HH:mm')
    }

    // 昨天 昨天+时分
    if (dayjs(_time).isYesterday()) {
        return `昨天 ${dayjs(_time).format('HH:mm')}`
    }

    // 本周 显示周几+时分
    if (dayjs().isSame(_time, 'week')) {
        const weekIndex = dayjs().day()
        return `${weeks[weekIndex]} ${dayjs(_time).format('HH:mm')}`
    }

    // 本周之前 显示年月日
    if (dayjs(_time).isBefore(new Date(), 'week')) {
        return dayjs(_time).format('YYYY年MM月DD日 HH:mm')
    }
}

/**
 * 格式化时间
 * @params {string} time 时间戳
 * @params {string} format 格式 YYYY-MM-DD HH:mm
 * @returns {string} 格式化后的时间
 */
export const formatTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!time) return ''

    const _time = time.toString().length === 10 ? Number(time) * 1000 : time
    const formattedTime = dayjs(_time)

    if (!formattedTime.isValid()) return ''
    return dayjs(_time).format(format)
}

/**
 * 当前时间加 1天，1月，1年等
 * @params {string} time 时间
 * @params {number} num 数量
 * @params {string} type 类型 day、month、year
 * @params {string} format 格式 YYYY-MM-DD HH:mm:ss
 * @returns {string} 增加后的时间
 */
export const addTime = (time, num, type, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!time) return ''
    const validUnits = ['day', 'month', 'year']
    if (!validUnits.includes(type)) {
        console.warn(`[addTime] 无效的时间单位: "${type}"，默认使用 "day"`)
        type = 'day'
    }

    try {
        const date = dayjs(time)
        if (!date.isValid()) {
            console.error('[addTime] 传入的时间格式无效:', time)
            return ''
        }
        return dayjs(time).add(num, type).format(format)
    } catch (e) {
        console.error(`[addTime] 时间处理出错: ${e}`)
    }
}

/**
 * 将时间转换为时间戳（秒级/毫秒级）
 * @params {string} time 时间
 * @params {object} options 单位 unit: 's' | 'ms'
 * @returns {number} 时间戳
 */
export const timeToTimestamp = (time, options = { unit: 's' }) => {
    if (!time) return 0
    const { unit } = options
    const date = dayjs(time)
    if (!date.isValid()) {
        console.error('[timeToTimestamp] 传入的时间格式无效:', time)
        return 0
    }
    return unit === 's' ? date.unix() : date.valueOf()
}

/**
 * 获取当前的小时，分，不足的补0
 * @returns {string} time unit: 'h' || 'm'
 * @returns {number} 23 || 59
 */

export const getCurrentTime = (unit = 'h') => {
    let time = ''
    if (unit === 'h') {
        time = dayjs().hour()
    } else if (unit === 'm') {
        time = dayjs().minute()
    } else {
        console.warn(`[getCurrentTime] 无效的时间单位: "${unit}"，默认使用 "h"`)
        time = dayjs().hour()
    }
    return time < 10 ? `0${time}` : time
}
