# Auth Entity

## Description

Entity for working with authentication in the application. Provides API methods, query keys, and request functions for managing user authentication, registration, and token management.

## API Methods

### HTTP Methods (authApi)

- `authApi.login(data: LoginDto)` - User login
- `authApi.register(data: RegisterDto)` - New user registration
- `authApi.refresh()` - Authentication token refresh
- `authApi.logout()` - User logout

**Note:** All auth methods are mutations and are handled in custom hooks, not in the API class.

## Usage Examples

### In Components

```typescript
import { authApi } from '@/entities/auth'

// Direct HTTP call
const authResponse = await authApi.login(loginData)
```

### In Hooks

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, authKeys } from '@/entities/auth'

const queryClient = useQueryClient()

// Using authApi directly in custom hooks
const loginMutation = useMutation({
  mutationFn: authApi.login,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: authKeys.root })
  },
})
```

## Types

- `User` - Main user entity
- `AuthResponse` - Authentication response with user and token
- `LoginDto` - Data for user login
- `RegisterDto` - Data for user registration

## File Structure

```
entities/auth/
├── auth-types.ts      // All types and interfaces
├── auth-keys.ts       // TanStack Query keys
├── auth-api.ts        // API class with query options (no requests file)
├── index.ts          // Public API exports
└── README.md         // Documentation
```

## Architecture

- **`AuthApi`** - Public API class with HTTP methods only
- **No requests file** - HTTP methods are implemented directly in AuthApi (exception for auth entity)
- **No query options** - All methods are mutations, handled in custom hooks
- **Types** - Standard interfaces for authentication data
