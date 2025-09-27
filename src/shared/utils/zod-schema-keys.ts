import { z } from 'zod'

/**
 * Извлекает ключи полей из Zod схемы
 *
 * @param schema - Zod схема
 * @returns объект с ключами полей схемы
 */
export const extractSchemaKeys = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) => {
  const shape = schema.shape
  const keys = Object.keys(shape) as Array<keyof T>

  return keys.reduce(
    (acc, key) => {
      acc[key] = key
      return acc
    },
    {} as Record<keyof T, keyof T>,
  )
}

/**
 * Создает тип для ключей схемы
 */
export type SchemaKeys<T extends z.ZodRawShape> = keyof T
