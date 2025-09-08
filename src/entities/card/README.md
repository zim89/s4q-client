# Card Entity

## Description

Entity for working with flashcards in the application. Provides API methods, query keys, and request functions for managing cards with pagination, filtering, and CRUD operations.

## API Methods

### HTTP Methods (cardApi)

- `cardApi.findById(id: string)` - Find card by ID
- `cardApi.findMany(params?: CardParams)` - Find many cards with pagination and filtering
- `cardApi.create(data: CreateCardDto)` - Create new card
- `cardApi.update(id: string, data: UpdateCardDto)` - Update card
- `cardApi.delete(id: string)` - Delete card

### Query Options (cardApi)

- `cardApi.findByIdOptions(id: string)` - Query options for finding by ID
- `cardApi.findManyOptions(params?: CardParams)` - Query options for finding many

**Note:** Mutation options are handled in custom hooks, not in the API class.

## Usage Examples

### In Components

```typescript
import { useQuery } from '@tanstack/react-query'
import { cardApi } from '@/entities/card'

// Using query options
const { data: card, isLoading } = useQuery(cardApi.findByIdOptions(id))

// Direct HTTP call
const card = await cardApi.findById(id)
```

### In Hooks

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardApi, cardKeys } from '@/entities/card'

const queryClient = useQueryClient()

// Using cardApi directly in custom hooks
const createCardMutation = useMutation({
  mutationFn: cardApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: cardKeys.all() })
  },
})
```

## Types

- `Card` - Main entity type
- `CardParams` - Request parameters
- `CreateCardDto` - Data for creating
- `UpdateCardDto` - Data for updating

**Note:** For paginated responses, use `PaginatedResponse<Card>` from `@/shared/types`.

### Available constants

```typescript
import {
  cardDifficulties,
  cardSortFields,
  contentStatuses,
  contentTypes,
  languageLevels,
  partsOfSpeech,
  sortOrders,
  verbTypes,
} from '@/shared/constants'

// Usage examples:
cardDifficulties.easy // 'EASY'
partsOfSpeech.noun // 'NOUN'
contentTypes.word // 'WORD'
cardSortFields.createdAt // 'createdAt'
sortOrders.desc // 'desc'
```

## File Structure

```
entities/card/
├── card-types.ts      // All types and interfaces
├── card-keys.ts       // TanStack Query keys
├── card-requests.ts   // HTTP methods (CardRequests class)
├── card-api.ts        // API class with query options
├── index.ts          // Public API exports
└── README.md         // Documentation
```

## Architecture

- **`CardRequests`** - Internal class with HTTP methods only
- **`CardApi`** - Public API class that delegates to CardRequests + provides query options
- **Query options** - Only for queries (findById, findMany), mutations handled in custom hooks
- **Types** - Use shared `PaginatedResponse<T>` for paginated responses
