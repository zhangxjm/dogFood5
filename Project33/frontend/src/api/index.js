import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const memberApi = {
  list: () => api.get('/members'),
  get: (id) => api.get(`/members/${id}`),
  search: (keyword) => api.get(`/members/search?keyword=${keyword}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`)
}

export const memberLevelApi = {
  list: () => api.get('/member-levels'),
  get: (id) => api.get(`/member-levels/${id}`),
  create: (data) => api.post('/member-levels', data),
  update: (id, data) => api.put(`/member-levels/${id}`, data),
  delete: (id) => api.delete(`/member-levels/${id}`)
}

export const consumptionRecordApi = {
  list: () => api.get('/consumption-records'),
  get: (id) => api.get(`/consumption-records/${id}`),
  getByMember: (memberId) => api.get(`/consumption-records/member/${memberId}`),
  create: (data) => api.post('/consumption-records', data),
  delete: (id) => api.delete(`/consumption-records/${id}`)
}

export const benefitApi = {
  list: () => api.get('/benefits'),
  available: () => api.get('/benefits/available'),
  get: (id) => api.get(`/benefits/${id}`),
  create: (data) => api.post('/benefits', data),
  update: (id, data) => api.put(`/benefits/${id}`, data),
  delete: (id) => api.delete(`/benefits/${id}`)
}

export const benefitClaimApi = {
  list: () => api.get('/benefit-claims'),
  get: (id) => api.get(`/benefit-claims/${id}`),
  getByMember: (memberId) => api.get(`/benefit-claims/member/${memberId}`),
  claim: (data) => api.post('/benefit-claims/claim', data)
}

export default api