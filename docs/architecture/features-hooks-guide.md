# Custom Hooks Guide for Features

## 🎯 Features Structure

```
src/features/{feature-name}/
├── model/
│   ├── hooks/
│   │   ├── use-{feature}-data.ts
│   │   ├── use-{feature}-list.ts
│   │   ├── use-create-{feature}.ts
│   │   ├── use-update-{feature}.ts
│   │   ├── use-delete-{feature}.ts
│   │   └── index.ts
│   ├── store/
│   │   ├── {feature}-store.ts
│   │   └── index.ts
│   └── index.ts
├── ui/
│   ├── {feature}-component.tsx
│   └── index.ts
└── index.ts
```

## 🔄 Custom Hooks in Features

### 1. Query Hooks (for data fetching)

#### Principles for creating query hooks

**✅ Correct - hooks only for data:**

```typescript
// use-category-children.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { categoryApi, type CategoryChildrenParams } from '@/entities/category'

export const useCategoryChildren = (params?: CategoryChildrenParams) => {
  return useQuery({
    ...categoryApi.getCategoryChildrenQueryOptions(params),
  })
}

// Component with UI logic
export const CategoryList = ({ params }: Props) => {
  const { data, isLoading, isError } = useCategoryChildren(params)

  if (isLoading) return <CategorySkeleton />
  if (isError) return <CategoryError />
  if (!data?.length) return <CategoryEmpty />

  return (
    <div>
      {data.map(category => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}
```

**❌ Incorrect - mixing data and UI logic:**

```typescript
// ❌ Don't do this
export const useCategoryChildren = (params?: CategoryChildrenParams) => {
  const { data, isLoading, isError } = useQuery({
    ...categoryApi.getCategoryChildrenQueryOptions(params),
  })

  // ❌ UI logic in hook
  if (isLoading) return <CategorySkeleton />
  if (isError) return <CategoryError />
  if (!data?.length) return <CategoryEmpty />

  return data
}
```

#### Query Hook Structure

```typescript
// use-{feature}-data.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { {entityName}Api, type {EntityName}Params } from '@/entities/{entity-name}'

/**
 * Hook for fetching {feature} data
 *
 * @param params - Query parameters
 * @returns Query result with data, loading, error states
 */
export const use{Feature}Data = (params?: {EntityName}Params) => {
  return useQuery({
    ...{entityName}Api.get{EntityName}sQueryOptions(params),
  })
}
```

### 2. Mutation Hooks (for data modification)

#### Principles for creating mutation hooks

**✅ Correct - hooks with proper error handling and callbacks:**

```typescript
// use-create-category.ts
'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoryApi, categoryKeys } from '@/entities/category'
import { logError } from '@/shared/utils'

// use-create-category.ts

// use-create-category.ts

// use-create-category.ts

interface UseCreateCategoryOptions {
  onSuccess?: (data: Category) => void
  onError?: (error: Error, variables: CreateCategoryDto) => void
  onSettled?: () => void
}

/**
 * Hook for creating a new category
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useCreateCategory = (options: UseCreateCategoryOptions = {}) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryApi.create,

    // Retry logic
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: (data, variables, context) => {
      // Toast success notification
      toast.success('Category created successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })

      // Call success callback
      options.onSuccess?.(data)
    },

    onError: (error, variables, context) => {
      // Log error
      logError('❌ [useCreateCategory] Create error:', error)

      // Toast error notification
      toast.error('Failed to create category. Please try again.')

      // Call error callback
      options.onError?.(error, variables)
    },

    onSettled: () => {
      // Call settled callback
      options.onSettled?.()
    },
  })
}
```

#### Mutation Hook Structure

```typescript
// use-create-{feature}.ts
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { {entityName}Api, {entityName}Keys } from '@/entities/{entity-name}'
import { logError } from '@/shared/utils'

interface UseCreate{Feature}Options {
  onSuccess?: (data: {EntityName}) => void
  onError?: (error: Error, variables: Create{EntityName}Dto) => void
  onSettled?: () => void
}

/**
 * Hook for creating a new {feature}
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useCreate{Feature} = (options: UseCreate{Feature}Options = {}) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {entityName}Api.create,

    // Retry logic
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: (data, variables, context) => {
      // Toast success notification
      toast.success('{Feature} created successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })

      // Call success callback
      options.onSuccess?.(data)
    },

    onError: (error, variables, context) => {
      // Log error
      logError('❌ [useCreate{Feature}] Create error:', error)

      // Toast error notification
      toast.error('Failed to create {feature}. Please try again.')

      // Call error callback
      options.onError?.(error, variables)
    },

    onSettled: () => {
      // Call settled callback
      options.onSettled?.()
    },
  })
}
```

### 3. Toast Notifications

#### Principles for toast notifications

- **Success operations**: Use `toast.success()` with descriptive message
- **Error operations**: Use `toast.error()` with helpful error message
- **Warning operations**: Use `toast.warning()` for non-critical issues
- **All messages should be in English**

```typescript
// ✅ Correct - Toast notifications
onSuccess: (data) => {
  toast.success('User created successfully')
  // ... other logic
},

onError: (error) => {
  toast.error('Failed to create user. Please try again.')
  // ... other logic
},

onSettled: () => {
  toast.warning('Operation completed with warnings')
  // ... other logic
}
```

### 4. Callbacks

#### Principles for callbacks

- **onSuccess**: Called when mutation succeeds, receives data and variables
- **onError**: Called when mutation fails, receives error and variables
- **onSettled**: Called when mutation completes (success or error)
- **All callbacks are optional and can be overridden**

```typescript
// ✅ Correct - Callback usage
const createUserMutation = useCreateUser({
  onSuccess: user => {
    console.log('User created:', user)
    router.push(`/users/${user.id}`)
  },
  onError: (error, userData) => {
    console.error('Failed to create user:', error)
    // Custom error handling
  },
  onSettled: () => {
    console.log('Create user operation completed')
    // Cleanup logic
  },
})
```

### 5. Retry Logic

#### Principles for retry logic

- **Query hooks**: Usually don't need retry (TanStack Query handles it)
- **Mutation hooks**: Use retry for network errors, not for business logic errors
- **Retry delay**: Use exponential backoff

```typescript
// ✅ Correct - Retry logic
return useMutation({
  mutationFn: api.create,

  // Retry configuration
  retry: 2, // Retry up to 2 times
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff

  onError: (error) => {
    // Only retry on network errors, not business logic errors
    if (error.status === 500) {
      // Will retry
    } else if (error.status === 400) {
      // Won't retry - business logic error
    }
  },
})
```

### 6. Optimistic Updates

#### Principles for optimistic updates

- **Use for UI responsiveness**: Update UI immediately, rollback on error
- **Provide rollback mechanism**: Store previous state for rollback
- **Handle edge cases**: Consider what happens if optimistic update fails

```typescript
// ✅ Correct - Optimistic updates
return useMutation({
  mutationFn: api.update,

  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: {entityName}Keys.detail(newData.id) })

    // Snapshot previous value
    const previousData = queryClient.getQueryData({entityName}Keys.detail(newData.id))

    // Optimistically update
    queryClient.setQueryData({entityName}Keys.detail(newData.id), newData)

    // Return context for rollback
    return { previousData }
  },

  onError: (error, newData, context) => {
    // Rollback on error
    if (context?.previousData) {
      queryClient.setQueryData({entityName}Keys.detail(newData.id), context.previousData)
    }
  },

  onSettled: (data, error, newData) => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: {entityName}Keys.detail(newData.id) })
  },
})
```

## 📋 Checklist for Mutation Hooks

### Required Elements:

- [ ] **JSDoc documentation** with description and parameter types
- [ ] **Toast notifications** for success and error states
- [ ] **Callback options** (onSuccess, onError, onSettled)
- [ ] **Retry logic** with exponential backoff
- [ ] **Error logging** using logError helper
- [ ] **Query invalidation** for related queries
- [ ] **Type safety** for all parameters and return values

### Optional Elements:

- [ ] **Optimistic updates** for better UX
- [ ] **Loading states** management
- [ ] **Custom error handling** for specific cases
- [ ] **Navigation** after successful operations

## 🎯 Best Practices

1. **Separation of Concerns**: Keep data logic in hooks, UI logic in components
2. **Error Handling**: Always provide meaningful error messages
3. **User Feedback**: Use toast notifications for all operations
4. **Type Safety**: Fully type all hooks and their parameters
5. **Documentation**: Document all public hooks with JSDoc
6. **Testing**: Write tests for all custom hooks
7. **Performance**: Use appropriate caching and invalidation strategies
8. **Accessibility**: Ensure error messages are accessible
9. **Consistency**: Follow the same patterns across all hooks
10. **Callbacks**: Provide flexible callback system for customization

## 📚 Related Documentation

- [Entity Structure Guide](./entity-structure-guide.md)
- [Project Structure](./project-structure.md)
- [Code Standards](../code-standards.md)
