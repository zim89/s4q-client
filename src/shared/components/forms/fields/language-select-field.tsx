'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface Language {
  id: string
  name: string
}

interface LanguageSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /** Имя поля формы */
  name: TName
  /** Объект управления формой */
  control: Control<TFieldValues>
  /** Подпись поля */
  label: string
  /** Список доступных языков */
  languages: Language[]
  /** Placeholder для селекта */
  placeholder?: string
  /** Отключено ли поле */
  disabled?: boolean
  /** CSS классы */
  className?: string
}

/**
 * Переиспользуемый компонент для выбора языка
 * Отображает список языков с их названиями
 */
export const LanguageSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  languages,
  placeholder = 'Choose language',
  disabled = false,
  className,
}: LanguageSelectFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {languages.map(language => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
