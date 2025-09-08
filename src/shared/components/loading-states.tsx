'use client'

import { ReactNode } from 'react'

/**
 * Props for LoadingStates component
 */
type Props = {
  /** Loading state flag */
  isLoading: boolean
  /** Error state flag */
  isError: boolean
  /** Custom skeleton component for loading state */
  skeleton?: ReactNode
  /** Custom loading message */
  loadingMessage?: string
  /** Custom loading description */
  loadingDescription?: string
  /** Custom error message */
  errorMessage?: string
  /** Custom error description */
  errorDescription?: string
  /** Custom error action */
  errorAction?: ReactNode
}

/**
 * Universal component for handling loading and error states
 *
 * @description Handles loading and error states for pages,
 * displays appropriate UI elements with customizable messages and skeleton
 * @param props - Component props
 * @returns Loading, error, or null based on state
 */
export const LoadingStates = ({
  isLoading,
  isError,
  skeleton,
  loadingMessage = 'Loading...',
  loadingDescription,
  errorMessage = 'Loading error',
  errorDescription = 'Failed to load data. Please try refreshing the page.',
  errorAction,
}: Props) => {
  if (isLoading) {
    // Show custom skeleton if provided
    if (skeleton) {
      return <>{skeleton}</>
    }

    // Show default loading state
    return (
      <div className='container py-8'>
        <div className='text-center'>
          <div className='text-foreground-title text-lg font-medium'>
            {loadingMessage}
          </div>
          {loadingDescription && (
            <div className='text-muted mt-2 text-sm'>{loadingDescription}</div>
          )}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='container py-8'>
        <div className='text-center'>
          <div className='text-foreground-title text-lg font-medium'>
            {errorMessage}
          </div>
          <div className='text-muted mt-2 text-sm'>{errorDescription}</div>
          {errorAction && <div className='mt-4'>{errorAction}</div>}
        </div>
      </div>
    )
  }

  return null
}
