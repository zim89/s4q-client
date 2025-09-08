'use client'

import { useEffect, useState } from 'react'
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useQueryState } from 'nuqs'
import type { CardParams } from '@/entities/card'
import { Input } from '@/shared/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import type { CardSortField, SortOrder } from '@/shared/constants'
import { useFindCards } from '../model/hooks'
import { cardsTableColumns } from './cards-table-columns'
import { CardsTablePagination } from './cards-table-pagination'

export const CardsTable = () => {
  // URL state management with nuqs
  const [page, setPage] = useQueryState('page', { defaultValue: '1' })
  const [limit, setLimit] = useQueryState('limit', { defaultValue: '10' })
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [sort, setSort] = useQueryState('sort', { defaultValue: '' })
  const [order, setOrder] = useQueryState('order', { defaultValue: '' })

  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Build params for API call
  const params: CardParams = {
    page: parseInt(page),
    limit: parseInt(limit),
    ...(search && { search }),
    ...(sort && { sort: sort as CardSortField }),
    ...(order && { order: order as SortOrder }),
  }

  // Fetch data
  const { data, isLoading, isError } = useFindCards(params)

  // Update URL state when sorting changes
  useEffect(() => {
    if (sorting.length > 0) {
      const sortColumn = sorting[0]
      setSort(sortColumn.id)
      setOrder(sortColumn.desc ? 'desc' : 'asc')
    } else {
      setSort('')
      setOrder('')
    }
  }, [sorting, setSort, setOrder])

  // Update URL state when page size changes
  const handlePageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize.toString())
    setPage('1') // Reset to first page
  }

  // Update URL state when page changes
  const handlePageChange = (newPage: number) => {
    setPage((newPage + 1).toString()) // TanStack Table uses 0-based indexing
  }

  const table = useReactTable({
    data: data?.data || [],
    columns: cardsTableColumns,
    pageCount: data?.pagination.totalPages || 0,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: parseInt(page) - 1, // Convert to 0-based
        pageSize: parseInt(limit),
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newPagination = updater({
          pageIndex: parseInt(page) - 1,
          pageSize: parseInt(limit),
        })
        handlePageChange(newPagination.pageIndex)
        handlePageSizeChange(newPagination.pageSize)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Server-side pagination
    manualSorting: true, // Server-side sorting
    manualFiltering: true, // Server-side filtering
  })

  if (isLoading) {
    return <div className='py-8 text-center'>Loading cards...</div>
  }

  if (isError) {
    return (
      <div className='text-destructive py-8 text-center'>
        Failed to load cards
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Search cards...'
          value={search}
          onChange={event => setSearch(event.target.value)}
          className='max-w-sm'
        />
      </div>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={cardsTableColumns.length}
                  className='h-24 text-center'
                >
                  No cards found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <CardsTablePagination table={table} />
      </div>
    </div>
  )
}
