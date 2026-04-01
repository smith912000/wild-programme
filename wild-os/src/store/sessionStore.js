import { create } from 'zustand'

export const useSessionStore = create((set) => ({
  activeSession: null,

  startSession: (type, id) => {
    set({
      activeSession: {
        type,
        id,
        startedAt: new Date().toISOString(),
      },
    })
  },

  endSession: () => {
    set({ activeSession: null })
  },
}))
