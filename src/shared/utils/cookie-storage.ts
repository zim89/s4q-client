import Cookies from 'js-cookie'

/** Cookie domain from environment variables */
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || ''

/** Default attributes for cookies **/
const defaultCookieAttrs = {
  /** Cookie domain (from environment variables) */
  domain: COOKIE_DOMAIN || undefined,
  /** SameSite policy for security */
  sameSite: 'strict' as const,
  /** Expiration in days */
  expires: 1,
}

/**
 * Создает универсальный cookie storage для заданного ключа
 * @param key - ключ для cookie
 * @param customAttrs - опциональные кастомные атрибуты cookie
 * @returns Объект с методами get, set, clear для работы с cookie
 * @example
 * const userStorage = createCookieStorage('user_preferences')
 * userStorage.set('dark_mode')
 * const theme = userStorage.get() // 'dark_mode'
 * userStorage.clear()
 *
 * const secureStorage = createCookieStorage('auth_token', {
 *   expires: 7,
 *   sameSite: 'strict'
 * })
 *
 * @description
 * Функция создает объект с тремя методами для работы с cookie:
 * - get(): возвращает значение cookie или null если не найден
 * - set(value): устанавливает значение cookie с атрибутами по умолчанию
 * - clear(): удаляет cookie
 *
 * По умолчанию используются безопасные атрибуты:
 * - sameSite: 'strict' для защиты от CSRF атак
 * - expires: 1 день
 * - domain: из переменной окружения NEXT_PUBLIC_COOKIE_DOMAIN
 *
 * Можно переопределить атрибуты через параметр customAttrs.
 */
export const createCookieStorage = (
  key: string,
  customAttrs?: Partial<typeof defaultCookieAttrs>,
) =>
  ({
    get(): string | null {
      return Cookies.get(key) ?? null
    },
    set(value: string) {
      Cookies.set(key, value, { ...defaultCookieAttrs, ...customAttrs })
    },
    clear() {
      Cookies.remove(key)
    },
  }) as const
