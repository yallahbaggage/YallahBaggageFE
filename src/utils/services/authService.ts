import axios from 'axios'
import type { IUser, LoginData, RegisterData } from '@/models/user'

const API_URL = process.env.NODE_ENV === 'production'
? 'https://baggs10.onrender.com/'
: 'http://localhost:9091/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data)
    const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data.data

    // Store tokens
    localStorage.setItem('accessToken', access_token)
    localStorage.setItem('refreshToken', refresh_token)
    localStorage.setItem('accessTokenExpiresIn', expires_in.toString())
    localStorage.setItem('refreshExpiresIn', refresh_expires_in.toString())

    return response.data.data
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data)
    const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data.data

    // Store tokens
    localStorage.setItem('accessToken', access_token)
    localStorage.setItem('refreshToken', refresh_token)
    localStorage.setItem('accessTokenExpiresIn', expires_in.toString())
    localStorage.setItem('refreshExpiresIn', refresh_expires_in.toString())

    return response.data.data
  },

  async getMe(): Promise<IUser> {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  async refreshAuthToken() {
    const refresh_token = localStorage.getItem('refreshToken')
    if (!refresh_token) {
      throw new Error('No refresh token found')
    }

    const response = await api.post('/auth/refresh', { refresh_token })
    const { access_token, expires_in } = response.data.data

    // Update stored tokens
    localStorage.setItem('accessToken', access_token)
    localStorage.setItem('accessTokenExpiresIn', expires_in.toString())

    return response.data.data
  },

  logout() {
    // Remove tokens
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessTokenExpiresIn')
    localStorage.removeItem('refreshExpiresIn')
  }
} 