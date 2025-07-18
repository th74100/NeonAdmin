import Neon from "@/request"

const API = {
    LOGIN_PATH: "/login",
    MENU_LIST_PATH: "/menu",
    USER_INFO_PATH: "/user/info",
}

export const userLogin = (params) => {
    return Neon.post(API.LOGIN_PATH, params)
}

export const getMenus = (params) => {
    return Neon.get(API.MENU_LIST_PATH, params)
}

export const getUserInfo = (params) => {
    return Neon.get(API.USER_INFO_PATH, params)
}