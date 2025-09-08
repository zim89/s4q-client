# Code Standards

This document defines standards and conventions for writing code for the FindOUT project.

## 🏗️ General Principles

### 1. Consistency

- **Follow these standards throughout the project**
- **Ensure unified code style**
- **Follow Feature-Sliced Design (FSD) methodology**

### 2. Localization

- **All comments and JSDoc should be written in English**
- **Use clear, descriptive English language**

### 3. Type Safety

- **Full TypeScript support**
- **Avoid using `any`**
- **Provide fallback values**

## 📝 Basic Rules

### Imports

- **Import only what you need through named exports**
- **FORBIDDEN to use `import * as React`**
- **Group imports from general to specific**

```typescript
// ✅ Correct - Named imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// ✅ Correct - Grouping from general to specific
// 1. React and external libraries
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// 2. Internal shared modules
import { Button } from '@/shared/components/ui/button'
import { logError } from '@/shared/utils'

// 3. Entities
import { authApi } from '@/entities/auth'

// 4. Features
import { useAuth } from '@/features/auth'

// 5. Local imports
import { workspaceData } from '../lib'
import { NavMain } from './nav-main'

// ❌ Incorrect - Forbidden imports
import * as React from 'react'
import React from 'react'
```

### Arrow Functions

- **Use arrow functions for all functions, pages and components**
- This ensures consistency throughout the project

```typescript
// ✅ Correct
const ComponentName = () => {
  return <div>Content</div>
}

const handleClick = () => {
  // handling logic
}

// ❌ Incorrect
function ComponentName() {
  return <div>Content</div>
}
```

### Named Exports

- **Use named exports for all exports**
- **Exception**: Next.js pages, layouts and other special files use default exports

```typescript
// ✅ Correct - Named exports
export const createUser = () => { /* ... */ }
export const updateUser = () => { /* ... */ }
export type { User, UserRole }

// ✅ Correct - Next.js exceptions
const HomePage = () => <div>Home</div>
export default HomePage
```

## 🏷️ Typing and Structure

### Component Props Types

- **Use simple name `Props` for component props types**
- **DO NOT use `ComponentNameProps` or similar names**
- This ensures brevity and code readability

```typescript
// ✅ Correct - Simple Props name
interface Props {
  /** User name */
  userName: string
  /** Click handler callback */
  onClick: () => void
  /** Additional CSS classes */
  className?: string
}

export const UserCard = ({ userName, onClick, className }: Props) => {
  return (
    <div className={className} onClick={onClick}>
      {userName}
    </div>
  )
}

// ❌ Incorrect - Long names with component name
interface UserCardProps {
  userName: string
  onClick: () => void
}
```

### Constants and Types

- **Primitive constants**: Use SCREAMING_SNAKE_CASE
- **Object/array constants**: Use camelCase
- **Types**: Generate below constant declaration

```typescript
// ✅ Correct - Primitive constants
const MAX_RETRY_ATTEMPTS = 3
const API_TIMEOUT = 5000
const DEFAULT_LOCALE = 'ru'

// ✅ Correct - Object/array constants
const apiEndpoints = {
  users: '/api/users',
  auth: '/api/auth',
} as const

// ✅ Correct - Types generated below constants
const userRoles = {
  admin: 'admin',
  user: 'user',
  moderator: 'moderator',
} as const

type UserRole = (typeof userRoles)[keyof typeof userRoles]
```

## 📁 File Organization

### Naming Convention

- **Use kebab-case for all file and directory names**
- **All words start with lowercase letters**
- **Separate words with hyphens (-)**

```typescript
// ✅ Correct
src/
├── shared/
│   ├── components/
│   ├── utils/
│   └── constants/
├── features/
│   ├── user-auth/
│   └── service-management/
└── app/
    ├── (root)/
    ├── (auth)/
    └── (admin)/

// ✅ Correct - File names
auth-cookies.ts
user-profile.tsx
api-endpoints.ts
form-validation.ts
button-component.tsx
```

### File Structure

```typescript
// Component files
export const ComponentName = () => {
  return <div>Content</div>
}

// Utility files
export const defaultConfig = {
  timeout: 5000,
  retries: 3,
} as const

export type Config = typeof defaultConfig
export const createConfig = (overrides?: Partial<Config>): Config => {
  return { ...defaultConfig, ...overrides }
}
```

## 🏷️ Variable and Function Naming

### Variables

- **Use camelCase for variables**
- **Use descriptive names**

```typescript
// ✅ Correct
const userName = 'John'
const isUserLoggedIn = true
const maxRetryCount = 3

// ❌ Incorrect
const un = 'John'
const logged = true
const mrc = 3
```

### Functions

- **Use camelCase for functions**
- **Start with verb for actions**

```typescript
// ✅ Correct
const getUserById = (id: number) => {
  /* ... */
}
const validateEmail = (email: string) => {
  /* ... */
}
const handleSubmit = () => {
  /* ... */
}

// ❌ Incorrect
const userById = (id: number) => {
  /* ... */
}
const email = (email: string) => {
  /* ... */
}
```

## 📝 Documentation

### JSDoc Comments

- **JSDoc structure in English**
- **Detailed descriptions of parameters and return values**

```typescript
/**
 * Creates a user in the system
 *
 * @param userData - User data for creation
 * @param options - Additional creation options
 * @returns Promise with created user
 */
export const createUser = async (
  userData: CreateUserData,
  options?: CreateUserOptions
): Promise<User> => {
  // implementation
}

/**
 * User card with main information
 *
 * @param user - User object to display
 * @param onEdit - Callback for editing user
 * @param className - Additional CSS classes
 */
export const UserCard = ({
  user,
  onEdit,
  className,
}: Props) => {
  return (
    <div className={className}>
      {/* component content */}
    </div>
  )
}
```

## 🔧 Error Handling

### Error Logging

- **Use logError function instead of console.error**
- **Provide fallback values**

```typescript
// ✅ Correct - Use logError function
import { logError } from '@/shared/utils'

try {
  const result = await apiCall()
  return result
} catch (error) {
  logError('❌ [ComponentName] API call error:', error)
  throw error
}

// ✅ Correct - Provide fallback values
const userName = user?.name || 'Unknown user'
const userAvatar = user?.avatar || '/images/default-avatar.png'
```

## 📝 Logging and Debugging

### Logging Rules

- **For debugging**: Use `console.log` - linter will highlight warning
- **For errors and important events**: Use helpers from `logger.ts` with defined pattern
- **After debugging**: Remove all `console.log` from production code

### Logging Pattern

```typescript
// ✅ Correct - Use helpers with defined pattern
import { logError, logInfo, logWarn } from '@/shared/utils/logger'

// Errors - use ❌ icon
logError('❌ [RootPage generateMetadata] Error:', error)
logError('❌ [UserService createUser] API Error:', { error, userData })

// Warnings - use ⚠️ icon
logWarn('⚠️ [CategoryService] Cache miss for category:', categoryId)

// Information - use 🔵 icon
logInfo('🔵 [SearchService] Query executed:', {
  query: searchTerm,
  results: count,
})
```

### Log Message Structure

**Format:** `{icon} [Context] Description: {data}`

- **Icon**: ❌ for errors, ⚠️ for warnings, 🔵 for information
- **Context**: `[ComponentName]` or `[ServiceName]` - where logging occurs
- **Description**: Brief description of event in English
- **Data**: Object with additional information or error

### Examples of Correct Usage

```typescript
// ✅ Correct - API error logging
try {
  const user = await userApi.getUserById(userId)
  return user
} catch (error) {
  logError('❌ [UserService getUserById] API Error:', { userId, error })
  throw error
}

// ✅ Correct - Important event logging
const handleUserLogin = async (credentials: LoginCredentials) => {
  try {
    const user = await authService.login(credentials)
    logInfo('🔵 [AuthService] User logged in successfully:', {
      userId: user.id,
    })
    return user
  } catch (error) {
    logError('❌ [AuthService] Login failed:', {
      credentials: { email: credentials.email },
      error,
    })
    throw error
  }
}
```

### Debugging with console.log

```typescript
// ✅ Correct - For temporary debugging
const processData = (data: unknown[]) => {
  console.log('🔍 [DEBUG] Processing data:', { count: data.length, data })

  const result = data.map(item => {
    console.log('🔍 [DEBUG] Processing item:', item)
    return transformItem(item)
  })

  console.log('🔍 [DEBUG] Processing result:', result)
  return result
}

// After debugging - REMOVE all console.log!
const processData = (data: unknown[]) => {
  const result = data.map(item => transformItem(item))
  return result
}
```

### Logging Imports

```typescript
// ✅ Correct - Import needed functions
import { logError, logInfo, logWarn } from '@/shared/utils/logger'

// ❌ Incorrect - Direct console usage
console.error('Error:', error)
console.warn('Warning:', warning)
```

## 📋 Code Review Checklist

### General Principles:

- [ ] Do you follow unified style throughout the project?
- [ ] Are all comments in English?
- [ ] Do you use arrow functions?

### Imports:

- [ ] Do you import only needed functions through named exports?
- [ ] Do you NOT use `import * as React`?
- [ ] Do you group imports from general to specific?
- [ ] Do you follow order: React → external libraries → shared → entities → features → local?

### Typing:

- [ ] Are component props types named simply `Props`?
- [ ] Is there no use of `any`?
- [ ] Do you provide fallback values?

### Organization:

- [ ] Are file names in kebab-case?
- [ ] Do you use named exports?
- [ ] Does structure follow FSD?

### Logging:

- [ ] Do you use `console.log` for debugging?
- [ ] Do you use `logError` for errors?
- [ ] Do you follow pattern `{icon} [Context] Description: {data}`?

## 🎯 Summary

1. **General Principles**: Consistency, localization, type safety
2. **Basic Rules**: Arrow functions, named exports
3. **Imports**: Only named imports, grouping from general to specific, forbidden `import * as React`
4. **Typing**: Simple `Props` names, full TypeScript support
5. **Organization**: kebab-case, FSD structure, logical grouping
6. **Naming**: camelCase, descriptive names, verbs for functions
7. **Documentation**: JSDoc in English, detailed descriptions
8. **Error Handling**: logError, fallback values
9. **Logging**: console.log for debugging, helpers for production
10. **Log Format**: `{icon} [Context] Description: {data}`

## 🚀 Benefits

- **Structure**: Logical grouping from general to specific
- **Consistency**: Unified code style throughout the project
- **Readability**: Clear, understandable code structure
- **Maintainability**: Easier to maintain and scale
- **Team Collaboration**: Common standards for all developers
- **FSD Compliance**: Follows Feature-Sliced Design methodology
- **Localization**: All comments in English for the team
- **Brevity**: Simple prop type names improve readability
- **Tree-shaking**: Named imports allow bundler to remove unused code
- **Performance**: Smaller bundle size thanks to precise imports
- **Debugging**: Linter automatically highlights console.log for removal
- **Monitoring**: Structured logs with context for quick diagnostics
- **Professionalism**: Unified logging style throughout the project
