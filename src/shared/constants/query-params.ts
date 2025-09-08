/**
 * Keys for URL query parameters
 */
export const queryParamsKeys = {
  redirect: 'redirect',
} as const

export type QueryParamsKey =
  (typeof queryParamsKeys)[keyof typeof queryParamsKeys]
