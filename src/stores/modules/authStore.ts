import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/utils/services/authService'
import type { IUser, LoginData, RegisterData } from '@/models/user'
import router from '@/router'

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

  async function login(data: LoginData) {
    try {
      const userData = await authService.login(data)
      isAuthenticated.value = true
      user.value = userData
      access_token.value = userData.access_token
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', userData.access_token)
      localStorage.setItem('accessTokenExpiresIn', userData.expires_in.toString())
      localStorage.setItem('refreshToken', userData.refresh_token)
      localStorage.setItem('refreshExpiresIn', userData.refresh_expires_in.toString())
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(data: RegisterData) {
    try {
      // Use the role from the data, defaulting to customer if not specified
      const registerData: RegisterData = {
        ...data,
        role: data.role || 'customer'
      }
      const userData = await authService.register(registerData)
      isAuthenticated.value = true
      user.value = userData
      
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  function resetAuthState() {
    isAuthenticated.value = false
    access_token.value = null
    user.value = null
    
    // Clear all tokens from localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('accessTokenExpiresIn')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('refreshExpiresIn')
    
    authService.logout()
    router.push('/login')
  }

  // Helper function to check user role
  function hasRole(role: string | string[]): boolean {
    if (!user.value) return false
    if (Array.isArray(role)) {
      return role.includes(user.value.role)
    }
    return user.value.role === role
  }

  return {
    isAuthenticated,
    access_token,
    user,
    login,
    register,
    resetAuthState,
    restoreAuthState,
    refreshLogin,
    hasRole,
    fetchUserData
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['isAuthenticated', 'access_token', 'user']
  }
}) 