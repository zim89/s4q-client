'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import type { Card } from '@/entities/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export const cardsTableColumns: ColumnDef<Card>[] = [
  {
    accessorKey: 'term',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Term
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const term = row.getValue('term') as string
      return <div className='font-medium'>{term}</div>
    },
  },
  {
    accessorKey: 'definition',
    header: 'Definition',
    cell: ({ row }) => {
      const definition = row.getValue('definition') as string | null
      if (!definition) return <span className='text-muted-foreground'>—</span>
      return (
        <div
          className='max-w-xs truncate text-sm'
          dangerouslySetInnerHTML={{ __html: definition }}
        />
      )
    },
  },
  {
    accessorKey: 'partOfSpeech',
    header: 'Part of Speech',
    cell: ({ row }) => {
      const partOfSpeech = row.getValue('partOfSpeech') as string | null
      if (!partOfSpeech) return <span className='text-muted-foreground'>—</span>
      return <Badge variant='secondary'>{partOfSpeech}</Badge>
    },
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ row }) => {
      const difficulty = row.getValue('difficulty') as string | null
      if (!difficulty) return <span className='text-muted-foreground'>—</span>

      const variant =
        difficulty === 'easy'
          ? 'default'
          : difficulty === 'medium'
            ? 'secondary'
            : 'destructive'

      return <Badge variant={variant}>{difficulty}</Badge>
    },
  },
  {
    accessorKey: 'transcription',
    header: 'Transcription',
    cell: ({ row }) => {
      const transcription = row.getValue('transcription') as string | null
      if (!transcription)
        return <span className='text-muted-foreground'>—</span>
      return <span className='font-mono text-sm'>{transcription}</span>
    },
  },
  {
    accessorKey: 'isGlobal',
    header: 'Type',
    cell: ({ row }) => {
      const isGlobal = row.getValue('isGlobal') as boolean
      return (
        <Badge variant={isGlobal ? 'default' : 'outline'}>
          {isGlobal ? 'Global' : 'Personal'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return (
        <div className='text-sm'>{new Date(date).toLocaleDateString()}</div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const card = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(card.id)}
            >
              Copy card ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit card</DropdownMenuItem>
            <DropdownMenuItem className='text-destructive'>
              Delete card
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
