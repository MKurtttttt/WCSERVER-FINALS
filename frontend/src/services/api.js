import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

export const mediaAPI = {
  getAll: (params) => api.get('/media', { params }),
  getById: (id) => api.get(`/media/${id}`),
  getTrending: (limit = 10) => api.get('/media/trending', { params: { limit } }),
  create: (data) => api.post('/media', data),
  update: (id, data) => api.patch(`/media/${id}`, data),
  delete: (id) => api.delete(`/media/${id}`)
}

export const userMediaAPI = {
  getAll: () => api.get('/userMedia'),
  add: (data) => api.post('/userMedia', data),
  update: (id, data) => api.patch(`/userMedia/${id}`, data),
  delete: (id) => api.delete(`/userMedia/${id}`)
}

export default api