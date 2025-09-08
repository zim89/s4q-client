'use client'

import { Suspense } from 'react'
import { CardsTable } from '@/features/card'

export const FlashcardsPage = () => {
  return (
    <div className='container py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Flashcards</h1>
        <p className='text-muted-foreground'>
          Manage your flashcard collection
        </p>
      </div>
      <Suspense fallback={null}>
        <CardsTable />
      </Suspense>
    </div>
  )
}
