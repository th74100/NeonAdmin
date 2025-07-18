import axios from 'axios'
import {
    API_URL,
    REQUEST_TIMEOUT,
    REQEUST_HEADERS,
    TOKEN_KEY,
    TOKEN_PREFIX,
} from '@/config'
import { $message, tool } from '@/utils'

// 基础配置
const axiosConfig = {
    baseURL: API_URL,
    timeout: REQUEST_TIMEOUT || 1000 * 30,
}

class Neon {
    constructor(cfg) {
        this.instance = axios.create(cfg)
        this.interceptors()
    }

    // 拦截器
    interceptors() {
        // 请求拦截
        this.instance.interceptors.request.use(
            (cfg) => {
                const token = tool.local.get('USER', 'token')
                if (token) {
                    cfg.headers[TOKEN_KEY] = `${TOKEN_PREFIX}${token}`
                }
                Object.assign(cfg.headers, REQEUST_HEADERS)
                return cfg
            },
            (error) => {
                error.data = {}
                error.data.msg = '服务器繁忙，请稍后再试！'
                return error
            },
        )

        // 响应拦截
        this.instance.interceptors.response.use(
            (response) => {
                const { data } = response
                if (data.code === 200) {
                    return data
                } else if (data.code === 203) {
                    console.log('token过期')
                    return data
                } else {
                    $message.error(data.message)
                    return data
                }
            },
            (error) => {
                error.data = {}
                if (error && error.response) {
                    switch (error.response.status) {
                        case 400:
                            error.data.msg = '请求错误!'
                            break
                        case 401:
                            error.data.msg = '未授权，请登录!'
                            break
                        case 403:
                            error.data.msg = '拒绝访问!'
                            break
                        case 404:
                            error.data.msg = '请求地址出错!'
                            break
                        case 408:
                            error.data.msg = '请求超时!'
                            break
                        case 500:
                            error.data.msg = '服务器内部错误!'
                            break
                        case 501:
                            error.data.msg = '服务未实现!'
                            break
                        case 502:
                            error.data.msg = '网关错误!'
                            break
                        case 503:
                            error.data.msg = '服务不可用!'
                            break
                        case 504:
                            error.data.msg = '网关超时!'
                            break
                        case 505:
                            error.data.msg = 'HTTP版本不受支持!'
                            break
                        default:
                            error.data.msg = '未知错误!'
                    }
                } else {
                    error.data.msg = '连接服务器失败，请稍后再试!'
                }
                $message.error(error.data.msg)
                return Promise.reject(error)
            },
        )
    }

    // get 请求
    get = (url, params) => {
        return this.instance.get(url, { params })
    }

    // post 请求
    post = (url, data) => {
        return this.instance.post(url, data)
    }

    // put 请求
    put = (url, data) => {
        return this.instance.put(url, data)
    }

    // delete 请求
    delete = (url, data) => {
        return this.instance.delete(url, { data })
    }

    // formData post
    postForm = (url, params) => {
        return this.instance.post(url, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }
}
export default new Neon(axiosConfig)
