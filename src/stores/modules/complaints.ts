import { defineStore } from 'pinia'
import { ComplaintService } from '@/utils/services/complaintService'
import type {
  IComplaint,
  ICreateComplaint,
  IUpdateComplaint,
  ComplaintFilterParams,
  IComplaintStats,
} from '@/models/complaint'

const complaintService = new ComplaintService()

interface Pagination {
  total: number
  page: number
  limit: number
  pageCount: number
}

interface ComplaintsState {
  complaints: IComplaint[]
  currentComplaint: IComplaint | null
  loading: boolean
  error: string | null
  pagination: Pagination | null
  stats: IComplaintStats | null
}

export const useComplaintsStore = defineStore('complaints', {
  state: (): ComplaintsState => ({
    complaints: [],
    currentComplaint: null,
    loading: false,
    error: null,
    pagination: null,
    stats: null,
  }),

  getters: {
    allComplaints: (state): IComplaint[] => state.complaints,
    currentComplaintData: (state): IComplaint | null => state.currentComplaint,
    isLoading: (state): boolean => state.loading,
    errorMessage: (state): string | null => state.error,
    paginationInfo: (state): Pagination | null => state.pagination,
    complaintStats: (state): IComplaintStats | null => state.stats,
  },

  actions: {
    async fetchComplaints(params?: ComplaintFilterParams & { page?: string; limit?: string }) {
      try {
        this.loading = true
        const page = params?.page ?? '1'
        const limit = params?.limit ?? '8'
        const filters = { ...params }
        delete filters.page
        delete filters.limit
        const response = await complaintService.fetchComplaints(
          Number(page),
          Number(limit),
          filters,
        )
        this.complaints = response.data
        this.pagination = response.pagination
        return response
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching complaints'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchComplaint(id: string) {
      try {
        this.loading = true
        // You may need to implement a getComplaint method in complaintService if not present
        // For now, fetch all and find by id
        if (!this.complaints.length) {
          await this.fetchComplaints({})
        }
        const found = await complaintService.getComplaintById(id);
        this.currentComplaint = found
        return found
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching complaint'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async createComplaint(data: ICreateComplaint) {
      try {
        this.loading = true
        const response = await complaintService.createComplaint(data)
        // Optionally, refetch or push to complaints
        await this.fetchComplaints({})
        return response
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error creating complaint'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateComplaint(id: string, data: IUpdateComplaint) {
      try {
        this.loading = true
        const response = await complaintService.updateComplaint(id, data)
        await this.fetchComplaints({})
        return response
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error updating complaint'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteComplaint(id: string) {
      try {
        this.loading = true
        await complaintService.deleteComplaint(id)
        await this.fetchComplaints({})
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error deleting complaint'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateComplaintStatus(id: string, status: string) {
      try {
        this.loading = true
        const response = await complaintService.updateComplaintStatus(id, status)
        await this.fetchComplaints({})
        return response
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error updating complaint status'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },

    async getComplaintsStatsPage(): Promise<IComplaintStats> {
      try {
        this.loading = true
        const response = await complaintService.getComplaintsStats()
        this.stats = response.data as IComplaintStats
        return response.data as IComplaintStats
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching workers stats'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
