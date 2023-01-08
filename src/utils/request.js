import axios from 'axios'
import { getToken, removeToken } from './storage'
import history from './history'
import {message} from 'antd'
// 创建axios实例
const instance = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0/',
  timeout: 5000
})

// 配置拦截器(文档)
// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器，只要data里面的数据
instance.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    if (error.response.status === 401) {
      removeToken()
      history.push('/login')
      message.warning('用户信息已过期')
    }
    return Promise.reject(error)
  }
)

export default instance
