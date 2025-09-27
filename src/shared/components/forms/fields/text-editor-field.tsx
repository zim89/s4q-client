'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { TextEditor } from '@/shared/components/editor/text-editor'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'

interface TextEditorFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /** Имя поля формы */
  name: TName
  /** Объект управления формой */
  control: Control<TFieldValues>
  /** Подпись поля */
  label: string
  /** Placeholder для редактора */
  placeholder?: string
  /** Минимальная высота редактора */
  minHeight?: string
  /** CSS классы */
  className?: string
}

/**
 * Переиспользуемый компонент для rich text редактора
 * Использует TipTap редактор для создания форматированного контента
 */
export const TextEditorField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  placeholder,
  minHeight = '120px',
  className,
}: TextEditorFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TextEditor
              content={field.value || ''}
              onChange={field.onChange}
              placeholder={placeholder}
              className={`min-h-[${minHeight}]`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
