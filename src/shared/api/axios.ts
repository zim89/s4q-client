import axios, { type CreateAxiosDefaults } from 'axios'
import { setupAuthInterceptors } from './auth-interceptors'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _isRetry?: boolean
  }
}

const getContentType = () => ({
  'Content-Type': 'application/json',
})

const baseOptions: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000',
  headers: {
    ...getContentType(),
  },
  withCredentials: true,
}

export const axiosClient = axios.create(baseOptions)

// Setup auth interceptors for axiosClient (automatic token handling)
// This single instance automatically:
// - Adds Authorization header if token exists
// - Handles token refresh on 401 errors
// - Manages request queue during refresh
// - Clears auth data on critical errors
setupAuthInterceptors(axiosClient)

// Additional FormData processing
axiosClient.interceptors.request.use(config => {
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type']
  }
  return config
})
