'use client'

import BulletList from '@tiptap/extension-bullet-list'
import CodeBlock from '@tiptap/extension-code-block'
import Color from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EditorToolbar } from './editor-toolbar'

interface TextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

/**
 * Rich text editor built with Tiptap
 * Includes comprehensive formatting capabilities
 */
export const TextEditor = ({
  content = '',
  onChange,
  placeholder = 'Enter some text...',
  className = '',
}: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default strike extension as we'll use our own
        strike: false,
        // Disable default bulletList to avoid conflicts with TaskList
        bulletList: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
      CodeBlock,
      BulletList,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Subscript,
      Superscript,
    ],
    content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class:
          'tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    // Fix SSR hydration issues
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-300 ${className}`}
    >
      <EditorToolbar editor={editor} />
      <div className='min-h-[200px] p-4'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
