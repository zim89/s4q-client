'use client'

import { TextEditor } from '@/shared/components/editor'

/**
 * Demo page for testing the Tiptap rich text editor
 */
export default function EditorDemoPage() {
  return (
    <div className='container mx-auto max-w-4xl py-8'>
      <h1 className='mb-4 text-3xl font-bold'>Tiptap Editor Demo</h1>
      <p className='mb-6 text-gray-600'>
        Полнофункциональный rich text редактор с панелью инструментов
      </p>

      <TextEditor
        placeholder='Начните печатать здесь...'
        onChange={content => console.log('Content changed:', content)}
      />
    </div>
  )
}
