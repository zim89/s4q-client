# Cards Table with Server-Side Pagination

This guide explains how to use the Cards Table component with server-side pagination, sorting, and filtering.

## Overview

The Cards Table is built using TanStack Table with shadcn/ui components and provides:

- **Server-side pagination** - Only loads data for the current page
- **Server-side sorting** - Sorting is handled by the API
- **Server-side filtering** - Search is handled by the API
- **URL state management** - Table state is synchronized with URL parameters
- **Responsive design** - Works on all screen sizes

## Components

### Main Components

- **`CardsTable`** - Main table component with all functionality
- **`cardsTableColumns`** - Column definitions with sorting and actions
- **`CardsTablePagination`** - Pagination controls component

### File Structure

```
src/features/card/ui/
├── cards-table.tsx              # Main table component
├── cards-table-columns.tsx      # Column definitions
├── cards-table-pagination.tsx   # Pagination component
└── index.ts                     # Exports
```

## Usage

### Basic Usage

```tsx
import { CardsTable } from '@/features/card'

export const MyPage = () => {
  return (
    <div className='container py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Flashcards</h1>
        <p className='text-muted-foreground'>
          Manage your flashcard collection
        </p>
      </div>
      <CardsTable />
    </div>
  )
}
```

### URL Parameters

The table automatically manages these URL parameters:

- **`page`** - Current page number (default: 1)
- **`limit`** - Items per page (default: 10)
- **`search`** - Search query
- **`sort`** - Sort field (e.g., 'wordOrPhrase', 'createdAt')
- **`order`** - Sort order ('asc' or 'desc')

Example URL: `/cards?page=2&limit=20&search=hello&sort=wordOrPhrase&order=asc`

## Features

### 1. Pagination

- **Page size selection**: 10, 20, 25, 30, 40, 50 items per page
- **Navigation**: First, previous, next, last page buttons
- **Page counter**: Shows current page and total pages
- **Selection counter**: Shows selected rows count

### 2. Sorting

Sortable columns:

- **Term** - Sort by `term` field
- **Created** - Sort by `createdAt` field

Click column headers to toggle sorting (asc → desc → none).

### 3. Search

- **Global search** - Search across all card fields
- **Real-time** - Search updates as you type
- **URL sync** - Search query is saved in URL

### 4. Column Display

Columns shown:

- **Term** - Main content with sorting
- **Part of Speech** - Badge with part of speech
- **Difficulty** - Color-coded difficulty badge
- **Transcription** - Phonetic transcription
- **Type** - Global/Personal badge
- **Created** - Creation date with sorting
- **Actions** - Dropdown menu with actions

### 5. Actions

Each row has a dropdown menu with:

- **Copy card ID** - Copy card ID to clipboard
- **View details** - View card details (placeholder)
- **Edit card** - Edit card (placeholder)
- **Delete card** - Delete card (placeholder)

## API Integration

### Data Flow

1. **URL parameters** are read using `nuqs`
2. **Parameters** are passed to `useFindCards` hook
3. **API call** is made with server-side pagination
4. **Data** is displayed in the table
5. **User interactions** update URL parameters
6. **New API call** is triggered automatically

### Required API Response

The API must return data in this format:

```typescript
interface PaginatedResponse<Card> {
  data: Card[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

### API Parameters

The table sends these parameters to the API:

```typescript
interface CardParams {
  page?: number // Current page (1-based)
  limit?: number // Items per page
  search?: string // Search query
  sort?: CardSortField // Sort field
  order?: SortOrder // Sort order ('asc' | 'desc')
}
```

## Customization

### Adding New Columns

1. **Define column** in `cardsTableColumns`:

```tsx
{
  accessorKey: 'newField',
  header: 'New Column',
  cell: ({ row }) => {
    const value = row.getValue('newField')
    return <div>{value}</div>
  },
}
```

2. **Add sorting** if needed:

```tsx
{
  accessorKey: 'newField',
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      New Column
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  // ... cell definition
}
```

### Customizing Actions

Modify the actions dropdown in `cardsTableColumns`:

```tsx
{
  id: 'actions',
  cell: ({ row }) => {
    const card = row.original

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleCustomAction(card)}>
            Custom Action
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
```

### Styling

The table uses Tailwind CSS classes and can be customized:

```tsx
// Custom table wrapper
<div className="w-full border rounded-lg">
  <CardsTable />
</div>

// Custom loading state
if (isLoading) {
  return <CustomLoadingComponent />
}
```

## Performance

### Optimizations

- **Server-side pagination** - Only loads current page data
- **Debounced search** - Search is debounced to avoid excessive API calls
- **URL state** - State is preserved in URL, no unnecessary re-renders
- **Memoized columns** - Column definitions are memoized

### Best Practices

1. **Use appropriate page sizes** - Don't set too large page sizes
2. **Implement search debouncing** - Avoid API calls on every keystroke
3. **Cache API responses** - Use TanStack Query for caching
4. **Optimize column rendering** - Use `useMemo` for complex cell renderers

## Troubleshooting

### Common Issues

1. **Table not updating** - Check if URL parameters are being updated
2. **Sorting not working** - Verify API supports the sort field
3. **Pagination issues** - Check if `pageCount` is set correctly
4. **Search not working** - Verify API supports search parameter

### Debug Mode

Add debug logging to see what parameters are being sent:

```tsx
useEffect(() => {
  console.log('Table params:', params)
}, [params])
```

## Examples

### Complete Page Example

```tsx
'use client'

import { Plus } from 'lucide-react'
import { CardsTable } from '@/features/card'
import { Button } from '@/shared/components/ui/button'

export const CardsPage = () => {
  return (
    <div className='container py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Flashcards</h1>
          <p className='text-muted-foreground'>
            Manage your flashcard collection
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add Card
        </Button>
      </div>
      <CardsTable />
    </div>
  )
}
```

### Custom Loading State

```tsx
import { CardsTable } from '@/features/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

export const CardsPageWithCustomLoading = () => {
  return (
    <div className='container py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Flashcards</h1>
        <p className='text-muted-foreground'>
          Manage your flashcard collection
        </p>
      </div>
      <Suspense fallback={<CardsTableSkeleton />}>
        <CardsTable />
      </Suspense>
    </div>
  )
}

const CardsTableSkeleton = () => (
  <div className='space-y-4'>
    <Skeleton className='h-10 w-full' />
    <Skeleton className='h-64 w-full' />
    <Skeleton className='h-10 w-full' />
  </div>
)
```

## Related Documentation

- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [shadcn/ui Data Table](https://ui.shadcn.com/docs/components/data-table)
- [nuqs Documentation](https://nuqs.47ng.com/)
- [Card Entity Documentation](../entities/card/README.md)
