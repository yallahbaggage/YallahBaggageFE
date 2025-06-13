import { defineStore } from 'pinia'
import { IWorker, IWorkersStats } from '@/models/worker'
import { workerService } from '@/utils/services/workerService'

interface Pagination {
  total: number
  page: number
  limit: number
  pageCount: number
}

interface WorkersState {
  workers: IWorker[]
  currentWorker: IWorker | null
  loading: boolean
  error: string | null
  pagination: Pagination | null
  stats: IWorkersStats | null
  deleteWorker: IWorker | null
}

export const useWorkersStore = defineStore('workers', {
  state: (): WorkersState => ({
    workers: [],
    currentWorker: null,
    loading: false,
    error: null,
    pagination: null,
    stats: null,
    deleteWorker: null
  }),

  getters: {
    allWorkers: (state): IWorker[] => state.workers,
    currentWorkerData: (state): IWorker | null => state.currentWorker,
    isLoading: (state): boolean => state.loading,
    errorMessage: (state): string | null => state.error,
    paginationInfo: (state): Pagination | null => state.pagination,
    workersStats: (state): IWorkersStats | null => state.stats,
    deleteWorker: (state): IWorker | null => state.currentWorker
  },

  actions: {
    async getWorkers(params?: { page?: number; limit?: number }): Promise<{ data: IWorker[]; pagination: Pagination }> {
      try {
        this.loading = true
        const response = await workerService.getWorkers(params)
        this.workers = response.data
        this.pagination = response.pagination
        return response as { data: IWorker[]; pagination: Pagination }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching workers'
        console.error(errorMsg)
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async getWorker(workerId: string): Promise<IWorker> {
      try {
        this.loading = true
        const response = await workerService.getWorker(workerId)
        this.currentWorker = response as IWorker
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching worker'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async getWorkersStats(): Promise<IWorkersStats> {
      try {
        this.loading = true
        const response = await workerService.getWorkersStats()
        this.stats = response.data as IWorkersStats
        return response.data as IWorkersStats
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching workers stats'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteSelectedWorker(workerId: string): Promise<void> {
      try {
        this.loading = true
        await workerService.deleteWorker(workerId)
        this.workers = this.workers.filter(worker => worker._id !== workerId)
        this.currentWorker = null
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error deleting worker'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
