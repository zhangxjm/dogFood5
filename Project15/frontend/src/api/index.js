import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export const supplierApi = {
  getList: (params) => request.get('/suppliers', { params }),
  getAll: () => request.get('/suppliers/all'),
  getDetail: (id) => request.get(`/suppliers/${id}`),
  create: (data) => request.post('/suppliers', data),
  update: (id, data) => request.put(`/suppliers/${id}`, data),
  delete: (id) => request.delete(`/suppliers/${id}`)
}

export const productApi = {
  getList: (params) => request.get('/products', { params }),
  getAll: () => request.get('/products/all'),
  getDetail: (id) => request.get(`/products/${id}`),
  create: (data) => request.post('/products', data),
  update: (id, data) => request.put(`/products/${id}`, data),
  delete: (id) => request.delete(`/products/${id}`)
}

export const inventoryApi = {
  getList: (params) => request.get('/inventory', { params }),
  getLogs: (params) => request.get('/inventory/logs', { params }),
  stockIn: (data) => request.post('/inventory/in', data),
  stockOut: (data) => request.post('/inventory/out', data)
}

export const orderApi = {
  getList: (params) => request.get('/orders', { params }),
  getDetail: (id) => request.get(`/orders/${id}`),
  create: (data) => request.post('/orders', data),
  complete: (id) => request.put(`/orders/${id}/complete`),
  cancel: (id) => request.put(`/orders/${id}/cancel`)
}