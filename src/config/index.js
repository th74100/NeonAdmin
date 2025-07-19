/** meta title */
export const META_TITLE = 'Vue3 NeonAdmin'

/** 登录地址 */
export const LOGIN_PATH = '/login'

/** 首页地址 */
export const HOME_PATH = '/dashboard'

/** 接口地址 */
export const API_URL =
    import.meta.env.VITE_NODE_ENV === 'development' &&
    import.meta.env.VITE_APP_PROXY === 'true'
        ? '/dev-api'
        : import.meta.env.VITE_APP_BASE_URL

/** 请求超时时间 */
export const REQUEST_TIMEOUT = 1000 * 20

/** Token 请求头名称 */
export const TOKEN_KEY = 'Authorization'

/** Token 前缀 */
export const TOKEN_PREFIX = 'Bearer '

/** 请求头参数 */
export const REQEUST_HEADERS = {}

/** pinia持久化存储的前缀 */
export const PINIA_PREFIX = 'NEON_'

/** 路由模式，可选 history | hash */
export const ROUTER_MODE = 'history'

/** Element Plus 组件默认尺寸，可选 large | default | small */
export const ELEMENT_PLUS_SIZE = 'default'

/** 默认布局，可选 default | vertical */
export const DEFAULT_LAYOUT = 'default'

/** 路由切换动画，可选 fade-slide | fade | fade-down | fade-scale */
export const ROUTER_ANIMATION = 'fade-slide'

/** 默认主题颜色 */
export const APP_COLOR = '#006be6'

/** 预设主题颜色（偏好设置中） */
export const APP_PREDEFINE_COLOR = [
    {
        label: '默认',
        color: '#006be6',
    },
    {
        label: '紫罗兰',
        color: '#7166f0',
    },
    {
        label: '樱花粉',
        color: '#e84a6c',
    },
    {
        label: '柠檬黄',
        color: '#efbd48',
    },
    {
        label: '天蓝色',
        color: '#4e69fd',
    },
    {
        label: '浅绿色',
        color: '#0bd092',
    },
    {
        label: '深绿色',
        color: '#0d9496',
    },
    {
        label: '深蓝色',
        color: '#0960be',
    },
    {
        label: '橙黄色',
        color: '#c1420b',
    },
    {
        label: '玫瑰红',
        color: '#bb1b1b',
    },
    {
        label: '暖灰色',
        color: '#A0A6B9',
    },
    {
        label: '焦炭黑',
        color: '#5D616C',
    },
    {
        label: '石板灰',
        color: '#344256',
    },
    {
        label: '中灰色',
        color: '#6f7174',
    },
]

/** 是否加密本地存储localStorage，为空不加密，可填写AES(模式ECB,移位Pkcs7)加密 */
export const APP_ENCRYPTION = ''

/** localStore AES加密密钥， 位数建议8的倍数*/
export const APP_ENCRYPTION_KEY = 'VqEzdPgkcl2dmgts'

/** 分页 */
export const PAGE_SIZE = 30
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50, 100]
