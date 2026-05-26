import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

const api = axios.create({
  baseURL: '/',
  timeout: 15000
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status
      const detail = error.response.data?.detail || 'Request failed'
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        ElMessage.error('Session expired, please login again')
        router.push('/login')
      } else if (status === 403) {
        ElMessage.error('Permission denied')
      } else if (status === 404) {
        ElMessage.error('Resource not found')
      } else if (status === 422) {
        ElMessage.error('Invalid input data')
      } else {
        ElMessage.error(typeof detail === 'string' ? detail : 'Server error')
      }
    } else {
      ElMessage.error('Network error')
    }
    return Promise.reject(error)
  }
)

export default api
