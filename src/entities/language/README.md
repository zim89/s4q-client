# Language Entity

## Description

Entity for working with languages in the application. Provides API methods, query keys, and request functions for managing languages with filtering.

## API Methods

### HTTP Methods (languageApi)

- `languageApi.findMany(params?: LanguageParams)` - Find many languages with filtering

### Query Options (languageApi)

- `languageApi.findManyOptions(params?: LanguageParams)` - Query options for finding many languages

**Note:** Mutation options are handled in custom hooks, not in the API class.

## Usage Examples

### In Components

```typescript
import { useQuery } from '@tanstack/react-query'
import { languageApi } from '@/entities/language'

// Using query options
const { data: languages, isLoading } = useQuery(languageApi.findManyOptions({ isEnabled: true }))

// Direct HTTP call
const languages = await languageApi.findMany({ search: 'english' })
```

### In Hooks

```typescript
import { useQuery } from '@tanstack/react-query'
import { languageApi } from '@/entities/language'

// Using languageApi directly in custom hooks
const useLanguages = (params?: LanguageParams) => {
  return useQuery(languageApi.findManyOptions(params))
}
```

## Types

- `Language` - Main entity type
- `LanguageParams` - Request parameters

**Note:** For paginated responses, use `PaginatedResponse<Language>` from `@/shared/types`.

## File Structure

```
entities/language/
├── language-types.ts      // All types and interfaces
├── language-keys.ts       // TanStack Query keys
├── language-requests.ts   // HTTP methods (LanguageRequests class)
├── language-api.ts        // API class with query options
├── index.ts              // Public API exports
└── README.md             // Documentation
```

## Architecture

- **`LanguageRequests`** - Internal class with HTTP methods only
- **`LanguageApi`** - Public API class that delegates to LanguageRequests + provides query options
- **Query options** - Only for queries (findMany), mutations handled in custom hooks
- **Types** - Use shared `PaginatedResponse<T>` for paginated responses
