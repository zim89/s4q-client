'use client'

import { useRouter } from 'next/navigation'
import { type CreateCardFormData } from '@/features/card/lib/schema'
import { CardForm } from './card-form'

/**
 * Виджет формы создания карточки
 * Инкапсулирует логику создания карточки и навигацию
 */
export const CreateCardForm = () => {
  const router = useRouter()

  const handleSubmit = (_data: CreateCardFormData) => {
    // Логика создания карточки будет обработана в useCardForm
    // После успешного создания - редирект
    router.push('/workspace/cards')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <CardForm
      mode='create'
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      cancelText='Back'
    />
  )
}
