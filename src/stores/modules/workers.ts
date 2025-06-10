import { defineStore } from 'pinia'
import { IWorker } from '@/models/worker'
import { workerService } from '@/utils/services/workerService'

interface WorkersState {
  workers: IWorker[]
  currentWorker: IWorker | null
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
        const response = await workerService.getWorkers()
        this.workers = response
        return response
      } catch (error: any) {
        this.error = error.message || 'Error fetching workers'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getWorker(workerId: string) {
      try {
        this.loading = true
        const response = await workerService.getWorker(workerId)
        this.currentWorker = response
        return response
      } catch (error: any) {
        this.error = error.message || 'Error fetching worker'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 