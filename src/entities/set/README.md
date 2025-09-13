# Set Entity

## Description

Entity for working with sets in the application. Provides API methods, query keys, and request functions for managing sets with pagination, filtering, and CRUD operations.

## API Methods

### HTTP Methods (setApi)

- `setApi.findById(id: string)` - Find set by ID
- `setApi.findMany(params?: SetParams)` - Find many sets with pagination and filtering
- `setApi.create(data: CreateSetDto)` - Create new set
- `setApi.update(id: string, data: UpdateSetDto)` - Update set
- `setApi.delete(id: string)` - Delete set
- `setApi.addCardToSet(setId: string, cardId: string)` - Add card to set
- `setApi.removeCardFromSet(setId: string, cardId: string)` - Remove card from set

### Query Options (setApi)

- `setApi.findByIdOptions(id: string)` - Query options for finding by ID
- `setApi.findManyOptions(params?: SetParams)` - Query options for finding many

**Note:** Mutation options are handled in custom hooks, not in the API class.

## Usage Examples

### In Components

```typescript
import { useQuery } from '@tanstack/react-query'
import { setApi } from '@/entities/set'

// Using query options
const { data: set, isLoading } = useQuery(setApi.findByIdOptions(id))

// Direct HTTP call
const set = await setApi.findById(id)
```

### In Hooks

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setApi, setKeys } from '@/entities/set'

const queryClient = useQueryClient()

// Using setApi directly in custom hooks
const createSetMutation = useMutation({
  mutationFn: setApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: setKeys.all() })
  },
})
```

## Types

- `Set` - Main entity type
- `SetParams` - Request parameters
- `CreateSetDto` - Data for creating
- `UpdateSetDto` - Data for updating

**Note:** For paginated responses, use `PaginatedResponse<Set>` from `@/shared/types`.

## File Structure

```
entities/set/
├── set-types.ts      // All types and interfaces
├── set-keys.ts       // TanStack Query keys
├── set-requests.ts   // HTTP methods (SetRequests class)
├── set-api.ts        // API class with query options
├── index.ts         // Public API exports
└── README.md        // Documentation
```

## Architecture

- **`SetRequests`** - Internal class with HTTP methods only
- **`SetApi`** - Public API class that delegates to SetRequests + provides query options
- **Query options** - Only for queries (findById, findMany), mutations handled in custom hooks
- **Types** - Use shared `PaginatedResponse<T>` for paginated responses
