import request from '../utils/request'

export const planApi = {
  getAll: () => request.get('/plans'),
  getById: (id) => request.get(`/plans/${id}`),
  create: (data) => request.post('/plans', data),
  update: (id, data) => request.put(`/plans/${id}`, data),
  delete: (id) => request.delete(`/plans/${id}`),
  getStatistics: (id) => request.get(`/plans/${id}/statistics`)
}

export const participantApi = {
  getByPlanId: (planId) => request.get(`/participants/plan/${planId}`),
  create: (data) => request.post('/participants', data),
  update: (id, data) => request.put(`/participants/${id}`, data),
  delete: (id) => request.delete(`/participants/${id}`)
}

export const expenseApi = {
  getByPlanId: (planId) => request.get(`/expenses/plan/${planId}`),
  create: (data) => request.post('/expenses', data),
  update: (id, data) => request.put(`/expenses/${id}`, data),
  delete: (id) => request.delete(`/expenses/${id}`)
}

export const reviewApi = {
  getByPlanId: (planId) => request.get(`/reviews/plan/${planId}`),
  create: (data) => request.post('/reviews', data),
  update: (id, data) => request.put(`/reviews/${id}`, data),
  delete: (id) => request.delete(`/reviews/${id}`)
}
