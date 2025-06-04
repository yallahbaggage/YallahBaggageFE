import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/utils/services/authService'
import type { IUser } from '@/models/user'
import router from '@/router'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  identityNumber?: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const access_token = ref<string | null>(null)
  const user = ref<IUser | null>(null)

  async function restoreAuthState() {
    try {
      const token = localStorage.getItem('accessToken')
      const expiresIn = localStorage.getItem('accessTokenExpiresIn')
      const refreshToken = localStorage.getItem('refreshToken')
      const refreshExpiresIn = localStorage.getItem('refreshExpiresIn')

      if (token && expiresIn && Date.now() < parseInt(expiresIn)) {
        console.log('Token is valid')
        isAuthenticated.value = true
        access_token.value = token
        await fetchUserData()
      } else if (refreshToken && refreshExpiresIn && Date.now() < parseInt(refreshExpiresIn)) {
        console.log('Token is expired but refresh token is valid')
        await refreshLogin()
      } else {
        console.log('No valid tokens found')
        resetAuthState()
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      resetAuthState()
    }
  }

  async function refreshLogin() {
    try {
      const tokenData = await authService.refreshAuthToken()
      if (!tokenData) {
        throw new Error('No refresh token data received')
      }
      isAuthenticated.value = true
      access_token.value = tokenData.access_token
      await fetchUserData()
      return true
    } catch (error) {
      console.error('Error during token refresh:', error)
      resetAuthState()
      return false
    }
  }

  async function fetchUserData() {
    try {
      const userData = await authService.getMe()
      user.value = userData
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      throw error
    }
  }

  async function login({ email, password }: LoginData) {
    try {
      const userData = await authService.login({ email, password })
      isAuthenticated.value = true
      user.value = userData
      router.push('/users')
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(data: RegisterData) {
    try {
      const userData = await authService.register(data)
      isAuthenticated.value = true
      user.value = userData
      router.push('/users')
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  function resetAuthState() {
    isAuthenticated.value = false
    access_token.value = null
    user.value = null
    authService.logout()
    router.push('/login')
  }

  return {
    isAuthenticated,
    access_token,
    user,
    login,
    register,
    resetAuthState,
    restoreAuthState,
    refreshLogin
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['isAuthenticated', 'access_token', 'user']
  }
}) 