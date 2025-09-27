'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { Card, CreateCardDto } from '@/entities/card'
import { partsOfSpeech } from '@/shared/constants'
import { normalizeVerbTerm } from '@/shared/utils'
import { defaultCardForm } from '../lib/constants'
import { cardFormFields } from '../lib/schema'
import { type CreateCardFormData, createCardSchema } from '../lib/schema'
import { useCreateCard } from './use-create-card'

/**
 * Опции для хука формы карточки
 */
export interface UseCardFormOptions {
  /** Режим работы формы */
  mode?: 'create' | 'edit' | 'import' | 'duplicate'
  /** Начальные данные формы */
  initialData?: Partial<CreateCardFormData>
  /** Колбэк при успешном создании карточки */
  onSuccess?: (data: Card) => void
  /** Колбэк при ошибке */
  onError?: (error: Error) => void
}

/**
 * Хук для управления формой создания/редактирования карточки
 * Инкапсулирует всю бизнес-логику формы
 *
 * @param options - опции хука
 * @returns объект с методами и состоянием формы
 */
export const useCardForm = (
  options: UseCardFormOptions = { mode: 'create' },
) => {
  const router = useRouter()

  // Настройка формы с валидацией
  const form = useForm<CreateCardFormData>({
    resolver: zodResolver(createCardSchema),
    defaultValues: { ...defaultCardForm, ...options.initialData },
  })

  // Мутация для создания карточки
  const createCardMutation = useCreateCard({
    onSuccess: data => {
      options.onSuccess?.(data)

      // Перенаправление после успешного создания
      if (options.mode === 'create') {
        router.push('/workspace/cards')
      }
    },
    onError: options.onError,
  })

  // Обработчик нормализации глаголов
  const termOnBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>, field: { onBlur: () => void }) => {
      const partOfSpeech = form.getValues(cardFormFields.partOfSpeech)

      if (partOfSpeech === partsOfSpeech.verb && e.target.value) {
        const normalizedTerm = normalizeVerbTerm(e.target.value)

        if (normalizedTerm !== e.target.value) {
          form.setValue('term', normalizedTerm)
        }
      }

      // Вызываем оригинальный onBlur для валидации
      field.onBlur()
    },
    [form],
  )

  /**
   * Обработчик отправки формы
   * Очищает данные и отправляет запрос на создание карточки
   *
   * @param data - данные формы
   */
  const handleSubmit = useCallback(
    (data: CreateCardFormData) => {
      // Очистка пустых строк и преобразование в undefined
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === '' ? undefined : value,
        ]),
      ) as unknown as CreateCardDto

      createCardMutation.mutate(cleanedData)
    },
    [createCardMutation],
  )

  return {
    /** Объект формы React Hook Form */
    form,
    /** Обработчик отправки формы */
    handleSubmit,
    /** Обработчик onBlur для поля термина с нормализацией глаголов */
    termOnBlur,
    /** Флаг загрузки */
    isSubmitting: createCardMutation.isPending,
    /** Флаг ошибки */
    isError: createCardMutation.isError,
    /** Объект ошибки */
    error: createCardMutation.error,
  }
}
