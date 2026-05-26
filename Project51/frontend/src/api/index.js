import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export const inventoryApi = {
  list: () => request.get('/inventory'),
  get: (id) => request.get(`/inventory/${id}`),
  add: (data) => request.post('/inventory', data),
  update: (id, data) => request.put(`/inventory/${id}`, data),
  delete: (id) => request.delete(`/inventory/${id}`),
  byType: (type) => request.get(`/inventory/type/${type}`)
}

export const cleaningApi = {
  list: () => request.get('/cleaning'),
  get: (id) => request.get(`/cleaning/${id}`),
  add: (data) => request.post('/cleaning', data),
  update: (id, data) => request.put(`/cleaning/${id}`, data),
  delete: (id) => request.delete(`/cleaning/${id}`),
  byLinen: (linenId) => request.get(`/cleaning/linen/${linenId}`)
}

export const usageApi = {
  list: () => request.get('/usage'),
  get: (id) => request.get(`/usage/${id}`),
  add: (data) => request.post('/usage', data),
  update: (id, data) => request.put(`/usage/${id}`, data),
  delete: (id) => request.delete(`/usage/${id}`),
  byLinen: (linenId) => request.get(`/usage/linen/${linenId}`),
  return: (id) => request.post(`/usage/return/${id}`)
}

export const lossApi = {
  list: () => request.get('/loss'),
  get: (id) => request.get(`/loss/${id}`),
  add: (data) => request.post('/loss', data),
  update: (id, data) => request.put(`/loss/${id}`, data),
  delete: (id) => request.delete(`/loss/${id}`),
  byLinen: (linenId) => request.get(`/loss/linen/${linenId}`)
}
