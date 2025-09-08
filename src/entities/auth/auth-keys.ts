export const authKeys = {
  root: ['auth'] as const,

  login: () => [...authKeys.root, 'login'] as const,
  register: () => [...authKeys.root, 'register'] as const,
  refresh: () => [...authKeys.root, 'refresh'] as const,
  logout: () => [...authKeys.root, 'logout'] as const,
} as const
