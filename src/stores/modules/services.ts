import { defineStore } from 'pinia'
import axios from 'axios'
import { Service } from '../types'

interface ServicesState {
  services: Service[]
  currentService: Service | null
  loading: boolean
  error: string | null
}

export const useServicesStore = defineStore('services', {
  state: (): ServicesState => ({
    services: [],
    currentService: null,
    loading: false,
    error: null
  }),

  getters: {
    allServices: (state) => state.services,
    currentService: (state) => state.currentService,
    isLoading: (state) => state.loading,
    error: (state) => state.error
  },

  actions: {
    async getServices() {
      try {
        this.loading = true
        const response = await axios.get('/api/v1/services')
        this.services = response.data.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching services'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getService(serviceId: string) {
      try {
        this.loading = true
        const response = await axios.get(`/api/v1/services/${serviceId}`)
        this.currentService = response.data.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching service'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 