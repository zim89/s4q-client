import { UserRole } from '@/shared/constants'

// ==============================
// REQUEST PARAMETERS
// ==============================

// No request parameters for auth (all data in request body)

// ==============================
// MAIN TYPES
// ==============================

/** Main user entity */
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  rights: UserRole[]
  isActive: boolean
  lastLoginAt: Date
  createdAt: Date
}

/** Authentication response */
export interface AuthResponse {
  user: User
  accessToken: string
}

// ==============================
// ADDITIONAL TYPES
// ==============================

/** User login data */
export interface LoginDto {
  email: string
  password: string
}

/** User registration data */
export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
}
