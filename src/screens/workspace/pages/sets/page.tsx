'use client'

import { SetCard, useFindSets } from '@/features/set'
import { LoadingStates } from '@/shared/components'

export const SetsPage = () => {
  const { data, isLoading, isError } = useFindSets({ limit: 100 })

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Flashcards Sets</h1>
        <p className='text-muted-foreground'>Manage your flashcard sets</p>

        {(isLoading || isError) && (
          <LoadingStates isLoading={isLoading} isError={isError} />
        )}

        {!data && <p>No sets found</p>}

        {data && (
          <ul>
            {data.data.map(set => (
              <li key={set.id}>
                <SetCard set={set} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
