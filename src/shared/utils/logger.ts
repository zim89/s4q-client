/**
 * Helper for logging with disabled ESLint no-console rule
 * Use this helper instead of direct console.log
 */

// eslint-disable-next-line no-console
export const log = (...args: unknown[]) => console.log(...args)

// eslint-disable-next-line no-console
export const logError = (...args: unknown[]) => console.error(...args)

// eslint-disable-next-line no-console
export const logWarn = (...args: unknown[]) => console.warn(...args)

// eslint-disable-next-line no-console
export const logInfo = (...args: unknown[]) => console.info(...args)

// eslint-disable-next-line no-console
export const logDebug = (...args: unknown[]) => console.debug(...args)

// Log grouping
export const logGroup = (label: string, fn: () => void) => {
  // eslint-disable-next-line no-console
  console.group(label)
  fn()
  // eslint-disable-next-line no-console
  console.groupEnd()
}

// Log objects in table format
// eslint-disable-next-line no-console
export const logTable = (...args: unknown[]) => console.table(...args)

// Logging with timestamp
export const logWithTime = (...args: unknown[]) => {
  const timestamp = new Date().toISOString()
  // eslint-disable-next-line no-console
  console.log(`[${timestamp}]`, ...args)
}
