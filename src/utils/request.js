import axios from 'axios'
// import store from '@/store'
import { Message, MessageBox } from 'element-ui'
// import router from '@/router'
export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? '/infra/api/console/'
    : '/api/console/'

const uniqueConfirm = (() => {
  let isShow = false

  return () => {
    if (isShow) return

    isShow = true
    MessageBox.confirm('登录失效请重新登录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        localStorage.removeItem('loginInfo')
        window.location.reload()
      })
      .finally(() => (isShow = false))
  }
})()

// const origin = window.location.origin
const instance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
})

instance.interceptors.request.use(
  request => {
    const userInfo = localStorage.loginInfo
      ? JSON.parse(localStorage.loginInfo)
      : {}
    request.headers = {
      Authorization: userInfo.token,
      'Content-Type': 'application/json',
    }
    return request
  },
  error => Promise.reject(error),
)

instance.interceptors.response.use(
  response => {
    console.log(response, 'this.response.data--------')
    if (response.data.code === 20001) {
      uniqueConfirm()
      return {}
    }

    if (response.data.code !== 200) {
      return Promise.reject(new Error(response.data.message))
    }

    return response.data
  },
  error => {
    const errorString = error.toString()

    if (errorString.includes('timeout')) {
      return Promise.reject(new Error('接口请求超时'))
    }

    if (error.response.status >= 500) {
      Message.error('请求失败，服务器异常')
    }
    return Promise.reject(error.response.data.message)
  },
)

const request = (url, options = {}) => {
  return instance
    .request({
      url: url,
      ...options,
    })
    .catch(err => {
      Message.error(err.message)
    })
}

export default request
