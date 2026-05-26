import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

export const fetchUsers = () => api.get('/users')
export const fetchUserById = (id) => api.get(`/users/${id}`)
export const createUser = (user) => api.post('/users', user)

export const fetchDocuments = () => api.get('/documents')
export const fetchDocumentById = (id) => api.get(`/documents/${id}`)
export const fetchDocumentsByUploader = (uploaderId) => api.get(`/documents/uploader/${uploaderId}`)
export const uploadDocument = (formData) => api.post('/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const addReaders = (documentId, readerIds) => api.post(`/documents/${documentId}/readers`, readerIds)
export const markAsRead = (documentId, readerId) => api.post(`/documents/${documentId}/read`, null, {
  params: { readerId }
})
export const downloadDocument = (id) => {
  return axios.get(`/api/documents/${id}/download`, {
    responseType: 'blob'
  })
}
export const deleteDocument = (id) => api.delete(`/documents/${id}`)

export const fetchCirculationsByReader = (readerId) => api.get(`/circulations/reader/${readerId}`)
export const fetchCirculationsByReaderAndStatus = (readerId, status) => api.get(`/circulations/reader/${readerId}/status/${status}`)
export const fetchCirculationsByDocument = (documentId) => api.get(`/circulations/document/${documentId}`)
export const fetchCirculationStats = (documentId) => api.get(`/circulations/document/${documentId}/stats`)

export default api
