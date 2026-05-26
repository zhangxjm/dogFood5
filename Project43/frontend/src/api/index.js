import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const categoryApi = {
  list: () => request.get('/categories'),
  get: (id) => request.get(`/categories/${id}`),
  create: (data) => request.post('/categories', data),
  update: (id, data) => request.put(`/categories/${id}`, data),
  delete: (id) => request.delete(`/categories/${id}`)
}

export const departmentApi = {
  list: () => request.get('/departments'),
  get: (id) => request.get(`/departments/${id}`),
  create: (data) => request.post('/departments', data),
  update: (id, data) => request.put(`/departments/${id}`, data),
  delete: (id) => request.delete(`/departments/${id}`)
}

export const employeeApi = {
  list: () => request.get('/employees'),
  get: (id) => request.get(`/employees/${id}`),
  create: (data) => request.post('/employees', data),
  update: (id, data) => request.put(`/employees/${id}`, data),
  delete: (id) => request.delete(`/employees/${id}`),
  listByDepartment: (deptId) => request.get(`/employees/department/${deptId}`)
}

export const applicationApi = {
  list: () => request.get('/applications'),
  get: (id) => request.get(`/applications/${id}`),
  create: (data) => request.post('/applications', data),
  delete: (id) => request.delete(`/applications/${id}`),
  listByDepartment: (deptId) => request.get(`/applications/department/${deptId}`),
  listByEmployee: (empId) => request.get(`/applications/employee/${empId}`)
}

export const inventoryApi = {
  list: () => request.get('/inventory'),
  get: (id) => request.get(`/inventory/${id}`),
  create: (data) => request.post('/inventory', data),
  delete: (id) => request.delete(`/inventory/${id}`),
  listByCategory: (catId) => request.get(`/inventory/category/${catId}`)
}

export const statisticsApi = {
  departmentStats: (params) => request.get('/statistics/department', { params }),
  categoryStats: (params) => request.get('/statistics/category', { params }),
  overallStats: () => request.get('/statistics/overall')
}
