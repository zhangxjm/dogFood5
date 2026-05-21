import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export const getMaterials = (params) => request.get('/materials', { params })
export const getAllMaterials = () => request.get('/materials/all')
export const createMaterial = (data) => request.post('/materials', data)
export const updateMaterial = (id, data) => request.put(`/materials/${id}`, data)
export const deleteMaterial = (id) => request.delete(`/materials/${id}`)

export const getTeams = (params) => request.get('/teams', { params })
export const getAllTeams = () => request.get('/teams/all')
export const createTeam = (data) => request.post('/teams', data)
export const updateTeam = (id, data) => request.put(`/teams/${id}`, data)
export const deleteTeam = (id) => request.delete(`/teams/${id}`)

export const getRecords = (params) => request.get('/records', { params })
export const createRecord = (data) => request.post('/records', data)
