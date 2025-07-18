import CryptoJS from 'crypto-js'
import {
    PINIA_PREFIX,
    APP_ENCRYPTION,
    APP_ENCRYPTION_KEY,
    APP_COLOR,
} from '@/config'

export const tool = {
    /**
     * 全屏/退出全屏
     * @param {String} element
     * example: tool.fullscreen(document.documentElement)
     */
    screen(element) {
        const isFull = !!(
            document.webkitIsFullScreen ||
            document.mozFullScreen ||
            document.msFullscreenElement ||
            document.fullscreenElement
        )
        if (isFull) {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            }
        } else {
            if (element.requestFullscreen) {
                element.requestFullscreen()
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen()
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen()
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen()
            }
        }
    },
    /**
     * 本地数据存储
     * @param {String} key
     * @param {String} value
     * example: tool.local.set('key', 'value')
     * example: tool.local.get('key')
     * example: tool.local.get('key', 'name')
     * example: tool.local.remove('key')
     * example: tool.local.clear()
     */
    local: {
        set(key, value) {
            let cacheValue = value

            //加密
            if (APP_ENCRYPTION == 'AES') {
                cacheValue = tool.crypto.AES.encrypt(
                    JSON.stringify(cacheValue),
                    APP_ENCRYPTION_KEY,
                )
            }

            localStorage.setItem(
                `${PINIA_PREFIX}${key}`,
                JSON.stringify(cacheValue),
            )
        },
        get(key, name) {
            try {
                let value = localStorage.getItem(`${PINIA_PREFIX}${key}`)

                if (value) {
                    //解密
                    if (APP_ENCRYPTION == 'AES') {
                        value = tool.crypto.AES.decrypt(
                            value,
                            APP_ENCRYPTION_KEY,
                        )
                    }

                    const _value = JSON.parse(value)
                    return name ? _value[name] : _value
                }
                return null
            } catch (err) {
                console.log(err)
                return null
            }
        },
        remove(key) {
            localStorage.removeItem(`${PINIA_PREFIX}${key}`)
        },
        clear() {
            localStorage.clear()
        },
    },

    /**
     * 加密 MD5, SHA256
     * 加解密 AES
     * @param {String} data
     * @returns {String}
     * example: tool.crypto.MD5('123456') => 'e10adc3949ba59abbe56e057f20f883e'
     * example: tool.crypto.SHA256('123456') => '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
     */
    crypto: {
        MD5(data) {
            return CryptoJS.MD5(data).toString()
        },
        SHA256(data) {
            return CryptoJS.SHA256(data).toString()
        },
        AES: {
            encrypt(data, secretKey, config = {}) {
                if (secretKey.length % 8 != 0) {
                    console.warn(
                        '[AES Error]: 秘钥长度需为8的倍数，否则解密将会失败。',
                    )
                }
                const result = CryptoJS.AES.encrypt(
                    data,
                    CryptoJS.enc.Utf8.parse(secretKey),
                    {
                        iv: CryptoJS.enc.Utf8.parse(config.iv || ''),
                        mode: CryptoJS.mode[config.mode || 'ECB'],
                        padding: CryptoJS.pad[config.padding || 'Pkcs7'],
                    },
                )
                return result.toString()
            },
            decrypt(cipher, secretKey, config = {}) {
                const result = CryptoJS.AES.decrypt(
                    cipher,
                    CryptoJS.enc.Utf8.parse(secretKey),
                    {
                        iv: CryptoJS.enc.Utf8.parse(config.iv || ''),
                        mode: CryptoJS.mode[config.mode || 'ECB'],
                        padding: CryptoJS.pad[config.padding || 'Pkcs7'],
                    },
                )
                return CryptoJS.enc.Utf8.stringify(result)
            },
        },
    },

    /**
     * pinia 自定义序列化
     * 用于在持久化之前序列化数据，并在解除冻结存储之前反序列化数据
     */
    serialize(value) {
        let _value = value
        if (APP_ENCRYPTION == 'AES') {
            _value = tool.crypto.AES.encrypt(
                JSON.stringify(value),
                APP_ENCRYPTION_KEY,
            )
            return _value
        }
        return JSON.stringify(_value)
    },
    deserialize(value) {
        let _value = value
        if (APP_ENCRYPTION == 'AES') {
            _value = tool.crypto.AES.decrypt(value, APP_ENCRYPTION_KEY)
        }
        return JSON.parse(_value)
    },

    /**
     * 绑定on，解绑off 事件
     * @param {HTMLElement} el
     * @param {String} event
     * @param {Function} handler
     * @example: tool.event.on(document, 'click', () => { console.log('click') })
     * @example: tool.event.off(document, 'click', () => { console.log('click') })
     */
    event: {
        on(el, event, handler) {
            if (el && event && handler) {
                el.addEventListener(event, handler, false)
                return () => el.removeEventListener(event, handler, false)
            }
        },

        off(el, event, handler) {
            if (el && event) {
                el.removeEventListener(event, handler, false)
            }
        },
    },

    /**
     * 从一个对象中删除不需要的属性，返回一个新对象
     * @param {Object} obj
     * @param {...args} props
     * @returns {Object}
     * example: tool.omit({ a: 1, b: 2, c: 3 }, ['a', 'c']) => { b: 2 }
     */
    omit(obj, ...props) {
        if (!obj || typeof obj !== 'object') return {}

        // 扁平化props参数
        const omitProps = props.flat()

        return Object.keys(obj).reduce((acc, key) => {
            if (!omitProps.includes(key)) {
                acc[key] = obj[key]
            }
            return acc
        }, {})
    },

    /**
     * 将16进制颜色值转换为RGB格式
     * @param {String} hex
     * @return {Array}
     * example: tool.hexToRgb('#FFFFFF') => [255, 255, 255]
     */
    hexToRgb(value) {
        value = value.replace('#', '')
        const hxs = value.match(/../g)
        for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16)
        return hxs
    },

    /**
     * 将RGB颜色值转换为16进制格式
     * @param {Number} r
     * @param {Number} g
     * @param {Number} b
     * @return {String}
     * example: tool.rgbToHex(255, 255, 255) => '#FFFFFF'
     */
    rgbToHex(r, g, b) {
        const hexs = [r.toString(16), g.toString(16), b.toString(16)]
        for (let i = 0; i < 3; i++) {
            if (hexs[i].length == 1) hexs[i] = '0' + hexs[i]
        }
        return '#' + hexs.join('')
    },

    /**
     * 颜色加深
     * @param {String} color
     * @param {Number} percent
     * @return {String}
     * example: tool.darken('#FFFFFF', 0.5) => '#7F7F7F'
     */
    darken(color, percent) {
        const rgbc = this.hexToRgb(color)
        for (let i = 0; i < 3; i++)
            rgbc[i] = Math.floor(rgbc[i] * (1 - percent))
        return this.rgbToHex(rgbc[0], rgbc[1], rgbc[2])
    },

    /**
     * 颜色变浅
     * @param {String} color
     * @param {Number} percent
     * @return {String}
     * example: tool.lighten('#000000', 0.5) => '#3F3F3F'
     */
    lighten(color, percent) {
        const rgbc = this.hexToRgb(color)
        for (let i = 0; i < 3; i++)
            rgbc[i] = Math.floor((255 - rgbc[i]) * percent + rgbc[i])
        return this.rgbToHex(rgbc[0], rgbc[1], rgbc[2])
    },

    /**
     * 初始化主题
     */
    initTheme(store) {
        const appColor = tool.local.get('GLOBAL', 'colorPrimary') || APP_COLOR
        store.theme(appColor)
    },
}
