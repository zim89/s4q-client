# Entity Structure Guide

## 📋 Entity Structure

Each entity should have the following structure:

```
src/entities/{entity-name}/
├── {entity-name}-types.ts
├── {entity-name}-keys.ts
├── {entity-name}-requests.ts
├── {entity-name}-api.ts
├── index.ts
└── README.md
```

## 📁 Files and Their Purpose

### 1. `{entity-name}-types.ts`

**Purpose:** All types and interfaces for the entity

**Structure:**

```typescript
import type { PaginatedResponse } from '@/shared/types'

// ==============================
// REQUEST PARAMETERS
// ==============================

/** Parameters for {entity-name} requests */
export interface {EntityName}Params {
  page?: number
  limit?: number
  // other parameters
}

// ==============================
// MAIN TYPES
// ==============================

/** Main {entity-name} entity */
export interface {EntityName} {
  id: string
  createdAt: Date
  updatedAt: Date

  // Core fields
  name: string
  description?: string

  // Additional fields
  status: string
  userId: string
}

// ==============================
// ADDITIONAL TYPES
// ==============================

/** Creating {entity-name} */
export interface Create{EntityName}Dto {
  name: string
  description?: string
  status?: string
}

/** Updating {entity-name} */
export interface Update{EntityName}Dto {
  name?: string
  description?: string
  status?: string
}
```

**Rules:**

- Group interfaces by purpose with explicit separators (`// ==============================`)
- Short comments for each interface
- If interface has many properties, group them with empty lines
- Use shared `PaginatedResponse<T>` for paginated responses

### 2. `{entity-name}-keys.ts`

**Purpose:** Query keys for TanStack Query

**Structure:**

```typescript
import type { {EntityName}Params } from './{entity-name}-types'

export const {entityName}Keys = {
  root: ['{entity-name}'] as const,

  all: () => [...{entityName}Keys.root, 'list'] as const,
  lists: () => [...{entityName}Keys.all()] as const,
  list: (filters: {EntityName}Params) => [...{entityName}Keys.lists(), { filters }] as const,

  details: () => [...{entityName}Keys.root, 'detail'] as const,
  detail: (id: string) => [...{entityName}Keys.details(), id] as const,
} as const
```

**Rules:**

- Group keys by purpose with empty lines
- No comments in the file
- Use camelCase for key names
- First element is always `root`

### 3. `{entity-name}-requests.ts`

**Purpose:** Internal HTTP requests class (not exported from module)

**Structure:**

```typescript
import { apiRoutes, axiosClient } from '@/shared/api'
import type { PaginatedResponse } from '@/shared/types'
import type {
  {EntityName},
  {EntityName}Params,
  Create{EntityName}Dto,
  Update{EntityName}Dto,
} from './{entity-name}-types'

/**
 * {EntityName} requests class
 * Contains all HTTP methods for {entity-name} operations
 */
class {EntityName}Requests {
  /**
   * Find {entity-name} by ID
   */
  async findById(id: string): Promise<{EntityName}> {
    const response = await axiosClient.get<{EntityName}>(apiRoutes.{entityName}.findOne(id))
    return response.data
  }

  /**
   * Find many {entity-name}s with pagination and filtering
   */
  async findMany(params?: {EntityName}Params): Promise<PaginatedResponse<{EntityName}>> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await axiosClient.get<PaginatedResponse<{EntityName}>>(
      `${apiRoutes.{entityName}.findMany}?${searchParams.toString()}`,
    )

    return response.data
  }

  /**
   * Create new {entity-name}
   */
  async create(data: Create{EntityName}Dto): Promise<{EntityName}> {
    const response = await axiosClient.post<{EntityName}>(apiRoutes.{entityName}.create, data)
    return response.data
  }

  /**
   * Update {entity-name}
   */
  async update(id: string, data: Update{EntityName}Dto): Promise<{EntityName}> {
    const response = await axiosClient.patch<{EntityName}>(
      apiRoutes.{entityName}.update(id),
      data,
    )
    return response.data
  }

  /**
   * Delete {entity-name}
   */
  async delete(id: string): Promise<void> {
    await axiosClient.delete(apiRoutes.{entityName}.delete(id))
  }
}

export const {entityName}Requests = new {EntityName}Requests()
```

**Rules:**

- Short JSDoc without examples
- Short comment for each function
- Not exported from module index
- Used only internally

### 4. `{entity-name}-api.ts`

**Purpose:** Public API class with HTTP methods and query options

**Structure:**

```typescript
import { {entityName}Keys } from './{entity-name}-keys'
import { {entityName}Requests } from './{entity-name}-requests'
import type { PaginatedResponse } from '@/shared/types'
import type { {EntityName}, {EntityName}Params } from './{entity-name}-types'

/**
 * API class for {entity-name}
 * Contains HTTP methods and query options
 */
class {EntityName}Api {
  findById = {entityName}Requests.findById
  findMany: (params?: {EntityName}Params) => Promise<PaginatedResponse<{EntityName}>> =
    {entityName}Requests.findMany
  create = {entityName}Requests.create
  update = {entityName}Requests.update
  delete = {entityName}Requests.delete

  /**
   * Query options for finding {entity-name} by ID
   */
  findByIdOptions(id: string) {
    return {
      queryKey: {entityName}Keys.detail(id),
      queryFn: () => this.findById(id),
      enabled: !!id,
    }
  }

  /**
   * Query options for finding many {entity-name}s
   */
  findManyOptions(params?: {EntityName}Params) {
    return {
      queryKey: {entityName}Keys.list(params || {}),
      queryFn: () => this.findMany(params),
    }
  }
}

export const {entityName}Api = new {EntityName}Api()
```

**Rules:**

- Short JSDoc without examples
- Short comment for each function
- Only query options (no mutation options)
- Naming: `{request}Options`
- Delegates HTTP methods to requests class

### 5. `index.ts`

**Purpose:** Public API of the entity

**Structure:**

```typescript
export * from './{entity-name}-types'
export * from './{entity-name}-keys'
export * from './{entity-name}-api'
```

**Rules:**

- No comments in the file
- Only export public API
- Do not export `{entity-name}-requests.ts`

### 6. `README.md`

**Purpose:** Documentation for the entity

**Structure:**

````markdown
# {Entity-Name} Entity

## Description

Entity for working with {entity-name}s in the application. Provides API methods, query keys, and request functions for managing {entity-name}s with pagination, filtering, and CRUD operations.

## API Methods

### HTTP Methods ({entityName}Api)

- `{entityName}Api.findById(id: string)` - Find {entity-name} by ID
- `{entityName}Api.findMany(params?: {EntityName}Params)` - Find many {entity-name}s with pagination and filtering
- `{entityName}Api.create(data: Create{EntityName}Dto)` - Create new {entity-name}
- `{entityName}Api.update(id: string, data: Update{EntityName}Dto)` - Update {entity-name}
- `{entityName}Api.delete(id: string)` - Delete {entity-name}

### Query Options ({entityName}Api)

- `{entityName}Api.findByIdOptions(id: string)` - Query options for finding by ID
- `{entityName}Api.findManyOptions(params?: {EntityName}Params)` - Query options for finding many

**Note:** Mutation options are handled in custom hooks, not in the API class.

## Usage Examples

### In Components

```typescript
import { useQuery } from '@tanstack/react-query'
import { {entityName}Api } from '@/entities/{entity-name}'

// Using query options
const { data: {entityName}, isLoading } = useQuery({entityName}Api.findByIdOptions(id))

// Direct HTTP call
const {entityName} = await {entityName}Api.findById(id)
```
````

### In Hooks

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { {entityName}Api, {entityName}Keys } from '@/entities/{entity-name}'

const queryClient = useQueryClient()

// Using {entityName}Api directly in custom hooks
const create{EntityName}Mutation = useMutation({
  mutationFn: {entityName}Api.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
  },
})
```

## Types

- `{EntityName}` - Main entity type
- `{EntityName}Params` - Request parameters
- `Create{EntityName}Dto` - Data for creating
- `Update{EntityName}Dto` - Data for updating

**Note:** For paginated responses, use `PaginatedResponse<{EntityName}>` from `@/shared/types`.

## File Structure

```
entities/{entity-name}/
├── {entity-name}-types.ts      // All types and interfaces
├── {entity-name}-keys.ts       // TanStack Query keys
├── {entity-name}-requests.ts   // HTTP methods ({EntityName}Requests class)
├── {entity-name}-api.ts        // API class with query options
├── index.ts                   // Public API exports
└── README.md                  // Documentation
```

## Architecture

- **`{EntityName}Requests`** - Internal class with HTTP methods only
- **`{EntityName}Api`** - Public API class that delegates to {EntityName}Requests + provides query options
- **Query options** - Only for queries (findById, findMany), mutations handled in custom hooks
- **Types** - Use shared `PaginatedResponse<T>` for paginated responses

````

## 📝 Naming Conventions

### File Naming (kebab-case)

- `{entity-name}-types.ts` - all types and interfaces
- `{entity-name}-keys.ts` - TanStack Query keys
- `{entity-name}-requests.ts` - HTTP methods (internal)
- `{entity-name}-api.ts` - public API class

### Function Naming (camelCase)

- `findById` - finding by ID
- `findMany` - finding many with pagination
- `create` - creating
- `update` - updating
- `delete` - deleting

### Type Naming (PascalCase)

- `{EntityName}` - main entity
- `{EntityName}Params` - request parameters
- `Create{EntityName}Dto` - creation data
- `Update{EntityName}Dto` - update data

## 🔄 Query Invalidation

### Custom Hooks for Mutations

Mutations should be handled in custom hooks with proper invalidation:

```typescript
const useCreate{EntityName} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {entityName}Api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}

const useUpdate{EntityName} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => {entityName}Api.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.detail(id) })
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}

const useDelete{EntityName} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {entityName}Api.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}
````

## 🎯 Best Practices

1. **Single Source of Truth**: Only `{EntityName}Api` is exported, `{EntityName}Requests` is internal
2. **Type Safety**: All methods should be fully typed
3. **Error Handling**: Use shared error handling from `@/shared/api`
4. **Caching**: Use appropriate query keys for efficient caching
5. **Documentation**: Document all public methods and types
6. **Consistency**: Follow the same structure for all entities
7. **Testing**: Write tests for all API methods and query options
8. **Separation**: Query options only for queries, mutations in custom hooks
9. **Reusability**: Use shared `PaginatedResponse<T>` for paginated responses
10. **Clean Code**: Short comments, grouped interfaces, no unnecessary exports

## 📚 Related Documentation

- [Features Hooks Guide](./features-hooks-guide.md)
- [Project Structure](./project-structure.md)
- [Code Standards](../code-standards.md)
