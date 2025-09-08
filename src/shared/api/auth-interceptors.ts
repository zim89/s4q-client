import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { authCookies, logError } from '@/shared/utils'
import { apiRoutes } from './api-routes'

interface ApiErrorResponse {
  message?: string | string[]
}

/**
 * API error handling
 */
const errorCatch = (error: AxiosError<ApiErrorResponse>): string => {
  const message = error?.response?.data?.message

  return message
    ? Array.isArray(message)
      ? message[0]
      : message
    : error.message
}

/**
 * Check if token refresh is needed
 */
const shouldRefreshToken = (error: AxiosError<ApiErrorResponse>): boolean => {
  return (
    error?.response?.status === 401 ||
    errorCatch(error) === 'jwt expired' ||
    errorCatch(error) === 'jwt must be provided'
  )
}

/**
 * Check for critical refresh errors
 */
const isCriticalRefreshError = (
  error: AxiosError<ApiErrorResponse>,
): boolean => {
  return (
    errorCatch(error) === 'jwt expired' ||
    errorCatch(error) === 'Refresh token not passed' ||
    errorCatch(error) === 'Invalid refresh token'
  )
}

/**
 * Flag to block parallel refresh attempts
 */
let isRefreshing = false

/**
 * Queue of requests waiting for refresh
 */
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (error: Error) => void
}> = []

/**
 * Process request queue after refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (token) {
      resolve(token)
    } else {
      reject(new Error('No token provided'))
    }
  })

  failedQueue = []
}

/**
 * Setup request interceptor for adding token
 */
export const setupRequestInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    config => {
      const accessToken = authCookies.getAccessToken()

      if (config?.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    error => {
      return Promise.reject(error)
    },
  )
}

/**
 * Setup response interceptor for handling 401 and token refresh
 */
export const setupResponseInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig

      if (
        shouldRefreshToken(error) &&
        originalRequest &&
        !originalRequest._isRetry
      ) {
        if (isRefreshing) {
          // If refresh is already in progress, add request to queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return axiosInstance.request(originalRequest)
            })
            .catch(err => {
              return Promise.reject(err)
            })
        }

        originalRequest._isRetry = true
        isRefreshing = true

        try {
          const refreshToken = authCookies.getRefreshToken()

          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          // Perform token refresh by passing refresh token in body
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}${apiRoutes.auth.refresh}`,
            { refreshToken },
            { withCredentials: true },
          )

          // Save new tokens to cookies
          authCookies.set({
            accessToken: response.data.accessToken,
            userId: response.data.user.id,
          })

          // Process request queue
          processQueue(null, response.data.accessToken)

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
          return axiosInstance.request(originalRequest)
        } catch (refreshError) {
          // Handle refresh errors
          processQueue(
            refreshError instanceof Error
              ? refreshError
              : new Error(String(refreshError)),
            null,
          )

          if (axios.isAxiosError<ApiErrorResponse>(refreshError)) {
            if (isCriticalRefreshError(refreshError)) {
              // Critical error - clear cookies and redirect to login
              logError(
                'Critical refresh error, clearing auth data:',
                refreshError,
              )
              authCookies.clear()

              // Can add redirect to login
              if (typeof window !== 'undefined') {
                window.location.href = '/login'
              }
            }
          }

          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    },
  )
}

/**
 * Setup all auth interceptors for axios instance
 */
export const setupAuthInterceptors = (axiosInstance: AxiosInstance) => {
  setupRequestInterceptor(axiosInstance)
  setupResponseInterceptor(axiosInstance)
}
