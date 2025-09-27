'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'

interface TextInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /** Имя поля формы */
  name: TName
  /** Объект управления формой */
  control: Control<TFieldValues>
  /** Подпись поля */
  label: string
  /** Placeholder для поля ввода */
  placeholder?: string
  /** Отключено ли поле */
  disabled?: boolean
  /** CSS классы */
  className?: string
  /** Дополнительная информация под лейблом */
  description?: string
  /** Обработчик onBlur */
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement>,
    field: { onBlur: () => void },
  ) => void
}

/**
 * Переиспользуемый компонент для текстового поля ввода
 * Поддерживает дополнительную информацию и обработчик onBlur
 */
export const TextInputField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  placeholder,
  disabled = false,
  className,
  description,
  onBlur,
}: TextInputFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {description && (
              <span className='text-muted-foreground ml-2 text-sm font-normal'>
                {description}
              </span>
            )}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              onBlur={onBlur ? e => onBlur(e, field) : field.onBlur}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
