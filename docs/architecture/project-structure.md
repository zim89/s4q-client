# FindOut Client Project Structure

## Architecture Overview

The project is built on Feature-Sliced Design (FSD) principles with adaptation for Next.js and project specifics.

## Root Structure

```
space4quizlet/
├── docs/                    # Project documentation
│   ├── auth-strategy.md    # Auth implementation strategy
│   └── project-structure.md # Project structure
├── public/                  # Static files
│   ├── file.svg
│   ├── globe.svg
│   ├── icons/
│   │   ├── award-default.svg
│   │   ├── cert-default.svg
│   │   ├── graduation-cap-default.svg
│   │   ├── head-side-brain-default.svg
│   │   └── webcam-default.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/                     # Source code
├── tools/                   # Development tools
│   └── eslint/
│       ├── custom-config.ts
│       └── rules/
│           ├── no-console.ts
│           └── index.ts
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Source Code Structure (src/)

```
src/
├── app/                     # Next.js App Router
│   ├── (admin)/            # Admin route group
│   │   └── admin/
│   │       └── page.tsx
│   ├── (auth)/             # Auth route group
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── register/
│   │           └── page.tsx
│   ├── (base)/             # Base route group
│   │   └── page.tsx
│   ├── (workspace)/        # Workspace route group
│   │   └── workspace/
│   │       ├── page.tsx
│   │       └── layout.tsx
│   ├── favicon.ico
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── entities/               # Business entities
│   ├── auth/              # Authentication entity
│   │   ├── auth.api.ts
│   │   ├── auth.qkeys.ts
│   │   ├── auth.types.ts
│   │   └── index.ts
│   └── user/              # User entity
│       ├── user.api.ts
│       ├── user.qkeys.ts
│       ├── user.types.ts
│       └── index.ts
├── features/              # Business features
│   ├── auth/              # Authentication feature
│   │   ├── model/
│   │   │   ├── hooks/
│   │   │   │   ├── use-login.ts
│   │   │   │   ├── use-register.ts
│   │   │   │   ├── use-logout.ts
│   │   │   │   ├── use-refresh.ts
│   │   │   │   └── index.ts
│   │   │   ├── store/
│   │   │   │   ├── auth-store.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── user/              # User feature
│       ├── model/
│       │   ├── hooks/
│       │   │   ├── use-user-profile.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── ui/
│       │   ├── user-profile.tsx
│       │   └── index.ts
│       └── index.ts
├── screens/               # Page components
│   ├── auth/              # Auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── workspace/         # Workspace pages
│       ├── page.tsx
│       ├── layout.tsx
│       └── ui/
│           ├── workspace-sidebar.tsx
│           ├── workspace-header.tsx
│           └── index.ts
├── shared/                # Shared resources
│   ├── api/               # API configuration
│   │   ├── axios.ts
│   │   ├── query-client.ts
│   │   └── index.ts
│   ├── components/        # Shared components
│   │   ├── ui/            # UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── config/            # Configuration
│   │   ├── app-config.ts
│   │   ├── app-routes.ts
│   │   └── index.ts
│   ├── constants/         # Constants
│   │   ├── api-endpoints.ts
│   │   ├── query-params.ts
│   │   └── index.ts
│   ├── hooks/             # Shared hooks
│   │   ├── use-local-storage.ts
│   │   └── index.ts
│   ├── lib/               # Utilities
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   └── index.ts
│   ├── types/             # Shared types
│   │   ├── common.ts
│   │   └── index.ts
│   └── utils/             # Utility functions
│       ├── auth-cookies.ts
│       ├── logger.ts
│       └── index.ts
└── widgets/               # Complex UI blocks
    ├── header/
    │   ├── header.tsx
    │   └── index.ts
    └── sidebar/
        ├── sidebar.tsx
        └── index.ts
```

## Layer Descriptions

### 1. App Layer (`src/app/`)

- **Purpose**: Next.js App Router configuration
- **Contains**: Route groups, layouts, pages
- **Rules**: Only routing logic, no business logic

### 2. Pages Layer (`src/screens/`)

- **Purpose**: Page-level components
- **Contains**: Page components, layouts
- **Rules**: Composition of features and widgets

### 3. Widgets Layer (`src/widgets/`)

- **Purpose**: Complex UI blocks
- **Contains**: Composite components
- **Rules**: Combine multiple features

### 4. Features Layer (`src/features/`)

- **Purpose**: Business features
- **Contains**: Feature logic, hooks, components
- **Rules**: Self-contained business logic

### 5. Entities Layer (`src/entities/`)

- **Purpose**: Business entities
- **Contains**: API methods, types, query keys
- **Rules**: Pure business logic, no UI

### 6. Shared Layer (`src/shared/`)

- **Purpose**: Shared resources
- **Contains**: Common components, utilities, configs
- **Rules**: Reusable across all layers

## Import Rules

### Import Order

1. **React and external libraries**
2. **Shared modules**
3. **Entities**
4. **Features**
5. **Local imports**

### Example

```typescript
// 1. React and external libraries
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
// 4. Features
import { useAuth } from '@/features/auth'
// 3. Entities
import { authApi } from '@/entities/auth'
// 2. Shared modules
import { Button } from '@/shared/components/ui/button'
import { logError } from '@/shared/utils'
// 5. Local imports
import { workspaceData } from '../lib'
import { NavMain } from './nav-main'
```

## File Naming Conventions

### Files and Directories

- **Use kebab-case**: `user-profile.tsx`, `auth-store.ts`
- **All lowercase**: `button.tsx`, `input.tsx`
- **Separate words with hyphens**: `use-user-profile.ts`

### Components

- **Use PascalCase**: `UserProfile`, `AuthStore`
- **Descriptive names**: `LoginForm`, `UserCard`

### Functions and Variables

- **Use camelCase**: `getUserById`, `isLoading`
- **Descriptive names**: `handleSubmit`, `validateEmail`

## Best Practices

### 1. Layer Isolation

- **Don't import from higher layers**: Features can't import from Pages
- **Use shared layer**: Common functionality goes to shared
- **Entity independence**: Entities don't depend on other layers

### 2. Component Structure

- **Single responsibility**: One component, one purpose
- **Composition over inheritance**: Combine small components
- **Props interface**: Use `Props` type for component props

### 3. State Management

- **Local state**: Use `useState` for component state
- **Global state**: Use Zustand for app-wide state
- **Server state**: Use TanStack Query for API data

### 4. Error Handling

- **Error boundaries**: Catch and handle errors gracefully
- **Toast notifications**: Provide user feedback
- **Logging**: Use structured logging for debugging

### 5. Performance

- **Code splitting**: Lazy load components when possible
- **Memoization**: Use `useMemo` and `useCallback` appropriately
- **Query optimization**: Use proper query keys and caching

## Related Documentation

- [Entity Structure Guide](./entity-structure-guide.md)
- [Features Hooks Guide](./features-hooks-guide.md)
- [Code Standards](../code-standards.md)
