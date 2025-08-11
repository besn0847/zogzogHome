import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Login action
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email,
            password
          })

          const { user, accessToken, refreshToken } = response.data
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          })

          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Erreur de connexion'
          return { success: false, error: message }
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData)

          const { user, accessToken, refreshToken } = response.data
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          })

          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Erreur d\'inscription'
          return { success: false, error: message }
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        })
        
        // Remove axios default header
        delete axios.defaults.headers.common['Authorization']
      },

      // Check authentication status
      checkAuth: () => {
        const { accessToken } = get()
        if (accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          set({ isAuthenticated: true })
        } else {
          set({ isAuthenticated: false })
        }
      },

      // Refresh token
      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          get().logout()
          return false
        }

        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken
          })

          const { accessToken: newAccessToken } = response.data
          
          set({ accessToken: newAccessToken })
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
          
          return true
        } catch (error) {
          get().logout()
          return false
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
