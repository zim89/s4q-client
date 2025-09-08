const API_BASE = '/api/v0'

export const apiRoutes = {
  auth: {
    register: `${API_BASE}/auth/register`,
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    refresh: `${API_BASE}/auth/refresh`,
  },
  card: {
    create: `${API_BASE}/cards`,
    findMany: `${API_BASE}/cards`,
    findOne: (id: string) => `${API_BASE}/cards/${id}`,
    update: (id: string) => `${API_BASE}/cards/${id}`,
    delete: (id: string) => `${API_BASE}/cards/${id}`,
  },
  workspace: {
    index: '/workspace',
  },
} as const
