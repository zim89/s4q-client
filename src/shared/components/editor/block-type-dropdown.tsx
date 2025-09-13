'use client'

import { Editor } from '@tiptap/react'
import {
  Check,
  CheckSquare,
  ChevronDown,
  FileText,
  List,
  ListOrdered,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import { Separator } from '@/shared/components/ui/separator'

interface BlockTypeDropdownProps {
  editor: Editor
}

/**
 * Dropdown для выбора типа блока (Paragraph, Lists)
 * Использует shadcn/ui DropdownMenu
 */
export const BlockTypeDropdown = ({ editor }: BlockTypeDropdownProps) => {
  const getCurrentBlockType = () => {
    if (editor.isActive('heading', { level: 1 })) return 'heading-1'
    if (editor.isActive('heading', { level: 2 })) return 'heading-2'
    if (editor.isActive('heading', { level: 3 })) return 'heading-3'
    if (editor.isActive('bulletList')) return 'bullet-list'
    if (editor.isActive('orderedList')) return 'ordered-list'
    if (editor.isActive('taskList')) return 'task-list'
    return 'paragraph'
  }

  const getCurrentIcon = () => {
    const blockType = getCurrentBlockType()
    switch (blockType) {
      case 'heading-1':
      case 'heading-2':
      case 'heading-3':
        return <FileText className='h-4 w-4' />
      case 'bullet-list':
        return <List className='h-4 w-4' />
      case 'ordered-list':
        return <ListOrdered className='h-4 w-4' />
      case 'task-list':
        return <CheckSquare className='h-4 w-4' />
      default:
        return <span className='font-mono text-sm'>¶</span>
    }
  }

  const getCurrentLabel = () => {
    const blockType = getCurrentBlockType()
    switch (blockType) {
      case 'heading-1':
        return 'Heading 1'
      case 'heading-2':
        return 'Heading 2'
      case 'heading-3':
        return 'Heading 3'
      case 'bullet-list':
        return 'Bullet list'
      case 'ordered-list':
        return 'Numbered list'
      case 'task-list':
        return 'Todo list'
      default:
        return 'Paragraph'
    }
  }

  const blockTypes = [
    {
      id: 'paragraph',
      label: 'Paragraph',
      icon: <span className='font-mono text-sm'>¶</span>,
      action: () => editor.chain().focus().setParagraph().run(),
    },
    {
      id: 'heading-1',
      label: 'Heading 1',
      icon: <FileText className='h-4 w-4' />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: 'heading-2',
      label: 'Heading 2',
      icon: <FileText className='h-4 w-4' />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: 'heading-3',
      label: 'Heading 3',
      icon: <FileText className='h-4 w-4' />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: 'bullet-list',
      label: 'Bullet list',
      icon: <List className='h-4 w-4' />,
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      id: 'ordered-list',
      label: 'Numbered list',
      icon: <ListOrdered className='h-4 w-4' />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      id: 'task-list',
      label: 'Todo list',
      icon: <CheckSquare className='h-4 w-4' />,
      action: () => editor.chain().focus().toggleTaskList().run(),
    },
  ]

  const currentBlockType = getCurrentBlockType()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='flex h-8 items-center gap-2 px-2'
          title='Block type'
        >
          {getCurrentIcon()}
          <span className='text-sm'>{getCurrentLabel()}</span>
          <ChevronDown className='h-3 w-3' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-48 p-1' align='start'>
        {/* HIERARCHY Section */}
        <div className='px-2 py-1.5'>
          <div className='text-xs font-semibold text-gray-500 uppercase'>
            HIERARCHY
          </div>
        </div>
        {blockTypes.slice(0, 4).map(blockType => (
          <Button
            key={blockType.id}
            variant='ghost'
            size='sm'
            onClick={() => {
              blockType.action()
            }}
            className='h-8 w-full justify-start gap-3 px-2'
          >
            {blockType.icon}
            <span>{blockType.label}</span>
            {currentBlockType === blockType.id && (
              <Check className='ml-auto h-4 w-4 text-green-600' />
            )}
          </Button>
        ))}

        <Separator className='my-1' />

        {/* LISTS Section */}
        <div className='px-2 py-1.5'>
          <div className='text-xs font-semibold text-gray-500 uppercase'>
            LISTS
          </div>
        </div>
        {blockTypes.slice(4).map(blockType => (
          <Button
            key={blockType.id}
            variant='ghost'
            size='sm'
            onClick={() => {
              blockType.action()
            }}
            className='h-8 w-full justify-start gap-3 px-2'
          >
            {blockType.icon}
            <span>{blockType.label}</span>
            {currentBlockType === blockType.id && (
              <Check className='ml-auto h-4 w-4 text-green-600' />
            )}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
