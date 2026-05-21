import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export function getVoterId() {
  let voterId = localStorage.getItem('voterId')
  if (!voterId) {
    voterId = 'voter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('voterId', voterId)
  }
  return voterId
}

export const pollApi = {
  getAllPolls: () => api.get('/polls'),
  getActivePolls: () => api.get('/polls/active'),
  getPollById: (id) => api.get(`/polls/${id}`),
  createPoll: (data) => api.post('/polls', data),
  vote: (id, data) => api.post(`/polls/${id}/vote`, data),
  closePoll: (id) => api.put(`/polls/${id}/close`),
  hasVoted: (id) => api.get(`/polls/${id}/has-voted?voterId=${getVoterId()}`),
  getHistory: () => api.get(`/polls/history?voterId=${getVoterId()}`)
}

export default api
