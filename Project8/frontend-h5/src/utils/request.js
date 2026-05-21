import axios from 'axios'
import { showToast } from 'vant'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res
    } else {
      showToast(res.message || '请求失败')
      return Promise.reject(res)
    }
  },
  error => {
    showToast('网络错误')
    return Promise.reject(error)
  }
)

export default request
