'use client'

import { SettingsIcon } from 'lucide-react'
import { Control, useWatch } from 'react-hook-form'
import { cardFormFields } from '@/features/card/lib/schema'
import {
  CheckboxField,
  EnumSelectField,
  MediaUploadFields,
  TextInputField,
} from '@/shared/components/forms'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import {
  cardFieldLabels,
  languageLevels,
  partsOfSpeech,
  verbTypes,
} from '@/shared/constants'

type Props = {
  /** Объект управления формой */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  /** Отключено ли поле */
  disabled?: boolean
  /** CSS классы */
  className?: string
}

/**
 * Переиспользуемый компонент настроек карточки
 * Содержит дополнительные поля: уровень, часть речи, тип глагола, медиа и опции
 */
export const CardSettingsPopover = ({
  control,
  disabled = false,
  className,
}: Props) => {
  // Отслеживаем значения полей для условного отображения
  const partOfSpeech = useWatch({
    control,
    name: cardFormFields.partOfSpeech,
  })
  const verbType = useWatch({
    control,
    name: cardFormFields.verbType,
  })

  return (
    <Popover>
      <PopoverTrigger className={className}>
        <SettingsIcon />
      </PopoverTrigger>
      <PopoverContent className='w-[300px]'>
        <div className='grid grid-cols-1 gap-4'>
          <MediaUploadFields disabled={disabled} />

          {/* LEVEL */}
          <EnumSelectField
            name={cardFormFields.level}
            control={control}
            label={cardFieldLabels.level.label}
            enumObject={languageLevels}
            placeholder={cardFieldLabels.level.placeholder}
            disabled={disabled}
          />

          {/* PART OF SPEECH */}
          <EnumSelectField
            name={cardFormFields.partOfSpeech}
            control={control}
            label={cardFieldLabels.partOfSpeech.label}
            enumObject={partsOfSpeech}
            placeholder={cardFieldLabels.partOfSpeech.placeholder}
            disabled={disabled}
          />

          {/* VERB TYPE - показывается только для глаголов */}
          {partOfSpeech === partsOfSpeech.verb && (
            <EnumSelectField
              name={cardFormFields.verbType}
              control={control}
              label={cardFieldLabels.verbType.label}
              enumObject={verbTypes}
              placeholder={cardFieldLabels.verbType.placeholder}
              disabled={disabled}
            />
          )}

          {/* Verb-specific fields - только для неправильных глаголов */}
          {partOfSpeech === partsOfSpeech.verb &&
            verbType === verbTypes.irregular && (
              <>
                {/* PAST SIMPLE */}
                <TextInputField
                  name={cardFormFields.pastSimple}
                  control={control}
                  label={cardFieldLabels.pastSimple.label}
                  placeholder={cardFieldLabels.pastSimple.placeholder}
                  disabled={disabled}
                />

                {/* PAST PARTICIPLE */}
                <TextInputField
                  name={cardFormFields.pastParticiple}
                  control={control}
                  label={cardFieldLabels.pastParticiple.label}
                  placeholder={cardFieldLabels.pastParticiple.placeholder}
                  disabled={disabled}
                />
              </>
            )}

          {/* OPTIONS */}
          <CheckboxField
            name={cardFormFields.isGlobal}
            control={control}
            label={cardFieldLabels.isGlobal.label}
            description={cardFieldLabels.isGlobal.description}
            disabled={disabled}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
