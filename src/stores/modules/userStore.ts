import { IUser, RegisterData } from '@/models/user';
import { authService } from '@/utils/services/authService';
import { userService } from '@/utils/services/userService';
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


interface UserStoreError extends Error {
  code?: string;
  status?: number;
}

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null)
  const token = ref<string | null>(null)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function getUserInfo() {
    error.value = null
    try {
      if (localStorage.getItem('token')) {
        const currentUser = await userService.getCurrentUser()
        user.value = currentUser
        return currentUser
      }
      return null
    } catch (err) {
      const userError = err as UserStoreError
      error.value = userError.message || 'Failed to fetch user info'
      throw new Error(error.value)
    }
  }

  async function login(email: string, password: string) {
    error.value = null
    try {
      const loggedInUser = await authService.login({ email, password })
      user.value = loggedInUser
      token.value = localStorage.getItem('token')
      return loggedInUser
    } catch (err) {
      const userError = err as UserStoreError
      error.value = userError.message || 'Failed to login'
      throw new Error(error.value)
    }
  }

  async function fetchUsers() {
    error.value = null
    try {
      const users = await userService.getUsers()
      return users.filter(u => u.role !== 'admin') // Exclude admin users from the list
    } catch (err) {
      const userError = err as UserStoreError
      error.value = userError.message || 'Failed to fetch users'
      throw new Error(error.value)
    }
  }

  async function register(data: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
  }) {
    error.value = null
    try {
      // Ensure phone and address are always strings for RegisterData compatibility
      const registerData = {
        ...data,
        phone: data.phone ?? '',
        address: data.address ?? '',
      } as RegisterData;
      const registeredUser = await authService.register(registerData)
      user.value = registeredUser
      token.value = localStorage.getItem('token')
      return registeredUser
    } catch (err) {
      const userError = err as UserStoreError
      error.value = userError.message || 'Failed to register'
      throw new Error(error.value)
    }
  }

  async function updateProfile(data: Partial<IUser>) {
    error.value = null
    try {
      const updatedUser = await userService.updateUser(data)
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      const userError = err as UserStoreError
      error.value = userError.message || 'Failed to update profile'
      throw new Error(error.value)
    }
  }

  async function deleteUserByNameEmailAndPass(name: string, password: string, email: string) {
    error.value = null
    try {
      await userService.deleteUserByNameEmailAndPassword(name, password, email)
    } catch (err) {
      const userError = err as UserStoreError
      error.value = userError.message || 'Failed to delete user'  
      throw new Error(error.value)
    }
  }

  function logout() {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  function clearError() {
    error.value = null
  }

  // Initialize store from localStorage
  function init() {
    error.value = null
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      // Fetch user profile
      userService.getCurrentUser()
        .then(currentUser => {
          user.value = currentUser
        })
        .catch((err) => {
          const userError = err as UserStoreError
          error.value = userError.message || 'Failed to fetch user profile'
          logout()
        })
    }
  }

  return {
    user,
    token,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    updateProfile,
    logout,
    clearError,
    init,
    getUserInfo,
    deleteUserByNameEmailAndPass,
    fetchUsers
  }
}) 