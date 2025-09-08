import { apiRoutes, axiosClient } from '@/shared/api'
import type { AuthResponse, LoginDto, RegisterDto } from './auth-types'

/**
 * API class for authentication
 * Contains HTTP methods and query options
 */
class AuthApi {
  /**
   * User login
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>(
      apiRoutes.auth.login,
      data,
    )
    return response.data
  }

  /**
   * New user registration
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>(
      apiRoutes.auth.register,
      data,
    )
    return response.data
  }

  /**
   * Authentication token refresh
   */
  async refresh(): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>(
      apiRoutes.auth.refresh,
      {},
    )
    return response.data
  }

  /**
   * User logout
   */
  async logout(): Promise<{ message: string }> {
    const response = await axiosClient.get<{ message: string }>(
      apiRoutes.auth.logout,
    )
    return response.data
  }
}

export const authApi = new AuthApi()
