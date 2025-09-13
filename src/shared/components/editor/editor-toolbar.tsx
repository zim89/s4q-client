'use client'

import { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Italic,
  Link,
  Palette,
  Quote,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { BlockTypeDropdown } from './block-type-dropdown'

interface EditorToolbarProps {
  editor: Editor
}

/**
 * Toolbar component for Tiptap editor
 * Provides comprehensive formatting options
 */
export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) {
    return null
  }

  const TooltipButton = ({
    onClick,
    isActive,
    icon: Icon,
    tooltip,
    disabled = false,
  }: {
    onClick: () => void
    isActive: boolean
    icon: React.ComponentType<{ className?: string }>
    tooltip: string
    disabled?: boolean
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={`rounded p-2 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            isActive ? 'bg-gray-300' : ''
          }`}
          type='button'
        >
          <Icon className='h-4 w-4' />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )

  return (
    <TooltipProvider>
      <div className='flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2'>
        {/* Block Type Dropdown */}
        <BlockTypeDropdown editor={editor} />

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Text Formatting */}
        <TooltipButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          tooltip='Bold'
        />

        <TooltipButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          tooltip='Italic'
        />

        <TooltipButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={Underline}
          tooltip='Underline'
        />

        <TooltipButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={Strikethrough}
          tooltip='Strikethrough'
        />

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Code */}
        <TooltipButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={Code}
          tooltip='Inline Code'
        />

        <TooltipButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={Code2}
          tooltip='Code Block'
        />

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Color */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button className='rounded p-2 hover:bg-gray-200' type='button'>
                  <Palette className='h-4 w-4' />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Text Color</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className='w-[200px] p-2'>
            <div className='space-y-3'>
              <h4 className='text-sm font-medium'>Text Color</h4>
              <div className='grid grid-cols-10 gap-1'>
                {/* Предустановленные цвета */}
                {[
                  '#000000',
                  '#434343',
                  '#666666',
                  '#999999',
                  '#B7B7B7',
                  '#CCCCCC',
                  '#D9D9D9',
                  '#EFEFEF',
                  '#F2F2F2',
                  '#FFFFFF',
                  '#980000',
                  '#FF0000',
                  '#FF9900',
                  '#FFFF00',
                  '#00FF00',
                  '#00FFFF',
                  '#4A86E8',
                  '#0000FF',
                  '#9900FF',
                  '#FF00FF',
                  '#E6B8AF',
                  '#F4CCCC',
                  '#FCE5CD',
                  '#FFF2CC',
                  '#D9EAD3',
                  '#D0E0E3',
                  '#C9DAF8',
                  '#CFE2F3',
                  '#D9D2E9',
                  '#EAD1DC',
                  '#DD7E6B',
                  '#EA9999',
                  '#F9CB9C',
                  '#FFE599',
                  '#B6D7A8',
                  '#A2C4C9',
                  '#A4C2F4',
                  '#B4A7D6',
                  '#D5A6BD',
                  '#CC0000',
                  '#E06666',
                  '#F6B26B',
                  '#FFD966',
                  '#93C47D',
                  '#76A5AF',
                  '#6D9EEB',
                  '#8E7CC3',
                  '#C27BA0',
                  '#A61C00',
                  '#CC4125',
                  '#E69138',
                  '#F1C232',
                  '#6AA84F',
                  '#45818E',
                  '#3C78D8',
                  '#674EA7',
                  '#A64D79',
                  '#85200C',
                  '#B45F06',
                  '#BF9000',
                  '#38761D',
                  '#134F5C',
                  '#1155CC',
                  '#351C75',
                  '#741B47',
                  '#5B0F00',
                  '#783F04',
                  '#7F6000',
                  '#274E13',
                  '#0C343D',
                  '#1C4587',
                  '#20124D',
                ].map(color => (
                  <button
                    key={color}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    className='size-4 rounded-full border border-gray-300 transition-transform hover:scale-110'
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>Custom:</span>
                <input
                  type='color'
                  onChange={e =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  className='h-8 w-12 cursor-pointer rounded border border-gray-300'
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Link */}
        <TooltipButton
          onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          isActive={editor.isActive('link')}
          icon={Link}
          tooltip='Add Link'
        />

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Subscript/Superscript */}
        <TooltipButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          icon={Subscript}
          tooltip='Subscript'
        />

        <TooltipButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          icon={Superscript}
          tooltip='Superscript'
        />

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Text Alignment */}
        <TooltipButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          tooltip='Align Left'
        />

        <TooltipButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          tooltip='Align Center'
        />

        <TooltipButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          tooltip='Align Right'
        />

        <TooltipButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          icon={AlignJustify}
          tooltip='Justify'
        />

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Quote */}
        <TooltipButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={Quote}
          tooltip='Quote'
        />

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Undo/Redo */}
        <TooltipButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          icon={Undo}
          tooltip='Undo'
          disabled={!editor.can().undo()}
        />

        <TooltipButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          icon={Redo}
          tooltip='Redo'
          disabled={!editor.can().redo()}
        />
      </div>
    </TooltipProvider>
  )
}
