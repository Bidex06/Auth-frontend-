import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends the httpOnly refresh cookie automatically
})

// Attach the in-memory access token on every outgoing request
api.interceptors.request.use(config => {
  const token = window.__accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On a 401, attempt a silent token refresh once and retry the original request.
// Multiple parallel 401s share the same refresh promise so we don't spam the endpoint.
let refreshPromise = null

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh')
          .then(res => {
            window.__accessToken = res.data.accessToken
          })
          .catch(() => {
            window.__accessToken = null
            window.dispatchEvent(new CustomEvent('auth:expired'))
          })
          .finally(() => { refreshPromise = null })
      }
      await refreshPromise
      if (window.__accessToken) {
        original.headers.Authorization = `Bearer ${window.__accessToken}`
        return api(original)
      }
    }
    return Promise.reject(err)
  }
)

export default api
