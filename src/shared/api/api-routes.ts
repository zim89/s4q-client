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
    search: `${API_BASE}/cards/search`,
  },
  set: {
    create: `${API_BASE}/sets`,
    findMany: `${API_BASE}/sets`,
    findOne: (id: string) => `${API_BASE}/sets/${id}`,
    update: (id: string) => `${API_BASE}/sets/${id}`,
    delete: (id: string) => `${API_BASE}/sets/${id}`,
    addCardToSet: (setId: string, cardId: string) =>
      `${API_BASE}/sets/${setId}/cards/${cardId}`,
    removeCardFromSet: (setId: string, cardId: string) =>
      `${API_BASE}/sets/${setId}/cards/${cardId}`,
  },
  language: {
    findMany: `${API_BASE}/languages`,
  },
  workspace: {
    index: '/workspace',
  },
} as const
