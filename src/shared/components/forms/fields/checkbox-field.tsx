'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'

interface CheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /** Имя поля формы */
  name: TName
  /** Объект управления формой */
  control: Control<TFieldValues>
  /** Подпись поля */
  label: string
  /** Описание под чекбоксом */
  description?: string
  /** Отключено ли поле */
  disabled?: boolean
  /** CSS классы */
  className?: string
}

/**
 * Переиспользуемый компонент для чекбокса
 * Поддерживает описание под чекбоксом
 */
export const CheckboxField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  disabled = false,
  className,
}: CheckboxFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex flex-row items-start space-y-0 space-x-3 ${className || ''}`}
        >
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className='space-y-1 leading-none'>
            <FormLabel>{label}</FormLabel>
            {description && (
              <p className='text-muted-foreground text-sm'>{description}</p>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
