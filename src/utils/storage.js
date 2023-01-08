// 用于封装所有的localstorage的操作

const TOKEN_KEY = 'geek-pc-token'

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

/**
 * 判断是否有token
 * @returns
 * */ 
export const hasToken = () => !!getToken() // 转Boolean