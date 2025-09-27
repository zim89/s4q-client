/**
 * Утилиты для нормализации терминов глаголов
 */

/**
 * Нормализует термин для глагола, добавляя префикс "to "
 * Простая функция без привязок к формам или другим зависимостям
 *
 * @param term - термин для нормализации
 * @returns нормализованный термин
 */
export const normalizeVerbTerm = (term: string): string => {
  if (!term.trim()) return term

  const trimmedTerm = term.trim()
  const toPrefix = 'to '

  // Если "to " префикс уже существует - ничего не делаем
  if (trimmedTerm.toLowerCase().startsWith(toPrefix)) {
    return trimmedTerm
  }

  // Добавляем "to " префикс для глаголов
  return `${toPrefix}${trimmedTerm}`
}

/**
 * Убирает префикс "to " из термина глагола
 *
 * @param term - термин для очистки
 * @returns термин без префикса "to "
 */
export const denormalizeVerbTerm = (term: string): string => {
  if (!term.trim()) return term

  const trimmedTerm = term.trim()
  const toPrefix = 'to '

  // Если есть префикс "to " - убираем его
  if (trimmedTerm.toLowerCase().startsWith(toPrefix)) {
    return trimmedTerm.substring(toPrefix.length)
  }

  return trimmedTerm
}
