'use client'

import { ImageIcon, MicIcon } from 'lucide-react'

interface MediaUploadFieldsProps {
  /** CSS классы */
  className?: string
  /** Отключены ли поля */
  disabled?: boolean
}

/**
 * Переиспользуемый компонент для полей загрузки медиа
 * Отображает кнопки для загрузки изображений и аудио
 */
export const MediaUploadFields = ({
  className,
  disabled = false,
}: MediaUploadFieldsProps) => {
  return (
    <div className={`grid grid-cols-1 gap-4 ${className || ''}`}>
      <div className='grid grid-cols-2 gap-4'>
        {/* IMAGE */}
        <div
          className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm ${
            disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted'
          }`}
        >
          <ImageIcon className='size-4 opacity-50' />
          <span>Image</span>
        </div>

        {/* AUDIO */}
        <div
          className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm ${
            disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted'
          }`}
        >
          <MicIcon className='size-4 opacity-50' />
          <span>Audio</span>
        </div>
      </div>
    </div>
  )
}
