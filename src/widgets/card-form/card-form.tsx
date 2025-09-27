'use client'

import { cardFormFields } from '@/features/card/lib/schema'
import { type CreateCardFormData } from '@/features/card/lib/schema'
import { useCardForm } from '@/features/card/model'
import { useLanguages } from '@/features/language'
import {
  LanguageSelectField,
  TextEditorField,
  TextInputField,
} from '@/shared/components/forms'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { cardFieldLabels, partsOfSpeech } from '@/shared/constants'
import { CardSettingsPopover } from './card-settings-popover'

type CardFormMode = 'create' | 'edit' | 'import' | 'duplicate'

type Props = {
  /** Режим работы формы */
  mode: CardFormMode
  /** ID карточки для редактирования (только для edit режима) */
  _cardId?: string
  /** Начальные данные (для import/duplicate режимов) */
  initialData?: Partial<CreateCardFormData>
  /** Обработчик отправки формы */
  onSubmit: (data: CreateCardFormData) => void
  /** Обработчик отмены */
  onCancel?: () => void
  /** Заголовок формы */
  title?: string
  /** Текст кнопки отправки */
  submitText?: string
  /** Текст кнопки отмены */
  cancelText?: string
}

/**
 * Универсальная форма карточки с поддержкой различных режимов
 * Поддерживает создание, редактирование, импорт и дублирование карточек
 */
export const CardForm = ({
  mode,
  _cardId,
  initialData,
  onSubmit,
  onCancel,
  title,
  submitText,
  cancelText,
}: Props) => {
  const { languages } = useLanguages()

  // Настройка формы с учетом режима
  const { form, handleSubmit, termOnBlur, isSubmitting } = useCardForm({
    mode: mode === 'edit' ? 'edit' : 'create', // Пока поддерживаем только create/edit
    initialData,
    onSuccess: data => {
      onSubmit(data as CreateCardFormData)
    },
  })

  // Динамические значения на основе режима
  const formTitle = title || getFormTitle(mode)
  const formSubmitText = submitText || getSubmitText(mode)
  const formCancelText = cancelText || 'Cancel'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* Заголовок и кнопки */}
        <div className='flex items-center justify-between'>
          <h1 className='page-title'>{formTitle}</h1>

          <div className='flex gap-3'>
            {onCancel && (
              <Button
                type='button'
                variant='outline'
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {formCancelText}
              </Button>
            )}
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : formSubmitText}
            </Button>
          </div>
        </div>

        {/* Основной контент */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
            <CardTitle className='text-lg'>Basic Information</CardTitle>
            <CardSettingsPopover
              control={form.control}
              disabled={isSubmitting}
            />
          </CardHeader>

          <CardContent className='space-y-4'>
            {/* Основные поля */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <TextInputField
                name={cardFormFields.term}
                control={form.control}
                label={cardFieldLabels.term.label}
                placeholder={cardFieldLabels.term.placeholder}
                disabled={isSubmitting}
                description={
                  form.watch(cardFormFields.partOfSpeech) === partsOfSpeech.verb
                    ? '(will add "to " prefix for verbs)'
                    : undefined
                }
                onBlur={termOnBlur}
              />

              <TextInputField
                name={cardFormFields.translate}
                control={form.control}
                label={cardFieldLabels.translate.label}
                placeholder={cardFieldLabels.translate.placeholder}
                disabled={isSubmitting}
              />
            </div>

            {/* Язык */}
            <LanguageSelectField
              name={cardFormFields.languageId}
              control={form.control}
              label={cardFieldLabels.languageId.label}
              languages={languages || []}
              placeholder={cardFieldLabels.languageId.placeholder}
              disabled={isSubmitting}
            />

            {/* Транскрипция */}
            <TextInputField
              name={cardFormFields.transcription}
              control={form.control}
              label={cardFieldLabels.transcription.label}
              placeholder={cardFieldLabels.transcription.placeholder}
              disabled={isSubmitting}
            />

            {/* Определение */}
            <TextEditorField
              name={cardFormFields.definition}
              control={form.control}
              label={cardFieldLabels.definition.label}
              placeholder={cardFieldLabels.definition.placeholder}
              minHeight='120px'
            />

            {/* Пример */}
            <TextEditorField
              name={cardFormFields.example}
              control={form.control}
              label={cardFieldLabels.example.label}
              placeholder={cardFieldLabels.example.placeholder}
              minHeight='120px'
            />
          </CardContent>
        </Card>

        {/* Дополнительные кнопки внизу */}
        <div className='flex justify-end gap-3'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {formCancelText}
            </Button>
          )}
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : formSubmitText}
          </Button>
        </div>
      </form>
    </Form>
  )
}

/**
 * Возвращает заголовок формы на основе режима
 */
const getFormTitle = (mode: CardFormMode): string => {
  switch (mode) {
    case 'create':
      return 'Create a new flashcard'
    case 'edit':
      return 'Edit flashcard'
    case 'import':
      return 'Import flashcard'
    case 'duplicate':
      return 'Duplicate flashcard'
    default:
      return 'Flashcard'
  }
}

/**
 * Возвращает текст кнопки отправки на основе режима
 */
const getSubmitText = (mode: CardFormMode): string => {
  switch (mode) {
    case 'create':
      return 'Create Card'
    case 'edit':
      return 'Update Card'
    case 'import':
      return 'Import Card'
    case 'duplicate':
      return 'Duplicate Card'
    default:
      return 'Submit'
  }
}
