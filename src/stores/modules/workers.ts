import { defineStore } from 'pinia'
import axios from 'axios'
import { Worker } from '../types'

interface WorkersState {
  workers: Worker[]
  currentWorker: Worker | null
  loading: boolean
  error: string | null
}

export const useWorkersStore = defineStore('workers', {
  state: (): WorkersState => ({
    workers: [],
    currentWorker: null,
    loading: false,
    error: null
  }),

  getters: {
    allWorkers: (state) => state.workers,
    currentWorker: (state) => state.currentWorker,
    isLoading: (state) => state.loading,
    error: (state) => state.error
  },

  actions: {
    async getWorkers() {
      try {
        this.loading = true
        const response = await axios.get('/api/v1/workers')
        this.workers = response.data.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching workers'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getWorker(workerId: string) {
      try {
        this.loading = true
        const response = await axios.get(`/api/v1/workers/${workerId}`)
        this.currentWorker = response.data.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching worker'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 