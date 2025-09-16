'use client'

import { CreateSetForm } from '@/features/set'

export const SetCreatePage = () => {
  return (
    <div>
      {/* <div>
        <h1 className='text-3xl font-bold'>Create Set</h1>
        <p className='text-muted-foreground'>Create a new flashcards set</p>
      </div> */}

      <CreateSetForm />
    </div>
  )
}
