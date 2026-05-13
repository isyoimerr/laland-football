import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

let isRefreshing = false
let pendingQueue = []

function getAuth() {
  try {
    const stored = localStorage.getItem('laland-auth')
    if (!stored) return null
    const { state } = JSON.parse(stored)
    return state
  } catch {
    return null
  }
}

function setAuth(state) {
  localStorage.setItem('laland-auth', JSON.stringify({ state }))
}

function clearAuth() {
  localStorage.removeItem('laland-auth')
  window.location.href = '/login'
}

api.interceptors.request.use((config) => {
  const auth = getAuth()
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const auth = getAuth()
    if (!auth?.refreshToken) {
      clearAuth()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true

    try {
      const res = await axios.post('/api/auth/refresh', { refreshToken: auth.refreshToken })
      const { accessToken } = res.data.data

      setAuth({ ...auth, accessToken })

      pendingQueue.forEach((cb) => cb(accessToken))
      pendingQueue = []

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch {
      clearAuth()
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
