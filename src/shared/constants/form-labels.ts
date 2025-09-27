/**
 * Константы лейблов и плейсхолдеров для полей форм карточек
 * Используются в компонентах форм для консистентности
 */

export const cardFieldLabels = {
  // Основные поля
  term: {
    label: 'Term *',
    placeholder: 'Enter term',
  },
  translate: {
    label: 'Translation',
    placeholder: 'Enter translation',
  },
  definition: {
    label: 'Definition',
    placeholder: 'Enter definition',
  },
  example: {
    label: 'Example',
    placeholder: 'Enter example usage',
  },
  transcription: {
    label: 'Transcription',
    placeholder: 'Enter phonetic transcription',
  },

  // Грамматические поля
  partOfSpeech: {
    label: 'Part of Speech',
    placeholder: 'Select ...',
  },
  verbType: {
    label: 'Verb Type',
    placeholder: 'Select verb type',
  },
  pastSimple: {
    label: 'Past Simple',
    placeholder: 'Enter past simple form',
  },
  pastParticiple: {
    label: 'Past Participle',
    placeholder: 'Enter past participle form',
  },

  // Настройки
  level: {
    label: 'Level',
    placeholder: 'Select ...',
  },
  languageId: {
    label: 'Language',
    placeholder: 'Choose language',
  },
  isGlobal: {
    label: 'Global Card',
    description: 'Card will be available to all users',
  },

  // Медиа
  imageUrl: {
    label: 'Image URL',
    placeholder: 'Enter image URL',
  },
  audioUrl: {
    label: 'Audio URL',
    placeholder: 'Enter audio URL',
  },
} as const

/**
 * Тип для ключей полей карточки
 */
export type CardFieldKey = keyof typeof cardFieldLabels
