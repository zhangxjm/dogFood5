import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 10000
})

api.interceptors.response.use(
    response => response.data,
    error => {
        console.error('API Error:', error)
        return Promise.reject(error)
    }
)

export const productApi = {
    list: (params) => api.get('/products', { params }),
    get: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    categories: () => api.get('/products/categories')
}

export const customerApi = {
    list: (params) => api.get('/customers', { params }),
    get: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post('/customers', data),
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
    orders: (id) => api.get(`/customers/${id}/orders`)
}

export const orderApi = {
    list: (params) => api.get('/orders', { params }),
    get: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
    statuses: () => api.get('/orders/statuses'),
    logs: (id) => api.get(`/orders/${id}/logs`)
}

export const statsApi = {
    dashboard: () => api.get('/statistics/dashboard'),
    salesByCategory: () => api.get('/statistics/sales-by-category'),
    salesByDate: (params) => api.get('/statistics/sales-by-date', { params }),
    topProducts: (params) => api.get('/statistics/top-products', { params })
}

export default api
