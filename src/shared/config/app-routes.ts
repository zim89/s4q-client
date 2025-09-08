// Helper for creating routes
const route = (path: string) => path

export const appRoutes = {
  home: route('/'),

  auth: {
    index: route('/auth'),
    login: route('/auth/login'),
    register: route('/auth/register'),
  },

  workspace: {
    index: route('/workspace'),
    cards: route('/workspace/cards'),
    cardSets: route('/workspace/sets'),
    folders: route('/workspace/folders'),
    saved: route('/workspace/saved'),
    trash: route('/workspace/trash'),
  },

  admin: {
    index: route('/admin'),
  },
} as const
