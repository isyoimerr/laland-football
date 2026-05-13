import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      setAccessToken: (accessToken) =>
        set({ accessToken }),
    }),
    {
      name: 'laland-auth',
      partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken, user: state.user }),
    }
  )
)

export default useAuthStore
