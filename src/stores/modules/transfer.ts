import { defineStore } from 'pinia'
import { socketService } from '@/services/socket'
import { ITrnsfersStats, Transfer } from '@/models/transfer'
import api from '@/utils/services/api'

interface Pagination {
  total: number
  page: number
  limit: number
  pageCount: number
}
interface TransfersStoreState {
  allTransfers: Transfer[]
  currentSelectedTransfer: Transfer | null
  loading: boolean
  error: string | null
  pagination: Pagination | null
  stats: ITrnsfersStats | null
  deleteTransfer: Transfer | null
}

export const useTransfersStore = defineStore('transfers', {
  state: (): TransfersStoreState => ({
    allTransfers: [],
    currentSelectedTransfer: null,
    loading: false,
    error: null,
    pagination: null,
    stats: null,
    deleteTransfer: null,
  }),

  getters: {
    getAllTransfers: (state) => state.allTransfers,
    currentTransfer: (state) => state.currentSelectedTransfer,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    paginationInfo: (state): Pagination | null => state.pagination,
    transferStats: (state) => state.stats,
  },

  actions: {
    async getTransfers(filters = {}) {
      try {
        this.loading = true
        const response = await api.get('/transfers', { params: filters })
        this.allTransfers = response.data.data
        this.pagination = response.data.pagination

        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching transfers'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getMyTransfers() {
      try {
        this.loading = true
        const response = await api.get('/transfers/my-transfers')
        this.allTransfers = response.data.data
        this.pagination = response.data.pagination
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching transfers'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getTransfer(transferId: string) {
      try {
        this.loading = true
        const response = await api.get(`/transfers/${transferId}`)
        this.currentSelectedTransfer = response.data.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching transfer'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTransfer(transferData: Partial<Transfer>) {
      try {
        this.loading = true
        const response = await api.post('/transfers', transferData)
        this.allTransfers.unshift(response.data.data)
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error creating transfer'
        throw error
      } finally {
        this.loading = false
      }
    },

    // async updateTransfer({
    //   transferId,
    //   transferData,
    // }: {
    //   transferId: string
    //   transferData: Partial<Transfer>
    // }) {
    //   try {
    //     this.loading = true
    //     const response = await api.put(`/transfers/${transferId}`, transferData)
    //     const index = this.transfers.findIndex((transfer) => transfer._id === transferId)
    //     if (index !== -1) {
    //       this.transfers.splice(index, 1, response.data.data)
    //     }
    //     return response.data
    //   } catch (error: any) {
    //     this.error = error.response?.data?.message || 'Error updating transfer'
    //     throw error
    //   } finally {
    //     this.loading = false
    //   }
    // },

    //  async updateTransfer(transferId: string, status: string) {
    //   try {
    //     this.loading = true
    //     // Emit socket event for real-time update
    //     socketService.emitTransferStatusUpdate(transferId, status)

    //     // Update local state optimistically
    //     const updatedTransfer = { ...this.currentSelectedTransfer, status } as Transfer
    //     this.updateTransferStatus(updatedTransfer)

    //     this.loading = false
    //   } catch (error) {
    //     this.error = error instanceof Error ? error.message : 'Failed to update transfer'
    //     this.loading = false
    //     throw error
    //   }
    // },

    async updateTransfer({
      transferId,
      transferData,
      emitSocket = false,
    }: {
      transferId: string
      transferData: Partial<Transfer>
      emitSocket?: boolean
    }) {
      try {
        this.loading = true

        // Optionally emit socket event
        if (emitSocket && transferData.status) {
          socketService.emitTransferStatusUpdate(transferId, transferData.status)
        }

        // Optimistically update currentSelectedTransfer if available
        if (this.currentSelectedTransfer && this.currentSelectedTransfer._id === transferId) {
          this.currentSelectedTransfer = { ...this.currentSelectedTransfer, ...transferData }
        }

        const response = await api.put(`/transfers/${transferId}`, transferData)

        // Update in transfer list
        const index = this.allTransfers.findIndex((transfer) => transfer._id === transferId)
        if (index !== -1) {
          this.allTransfers.splice(index, 1, response.data.data)
        }

        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error updating transfer'
        throw error
      } finally {
        this.loading = false
      }
    },

    updateTransferStatus(updatedTransfer: Transfer) {
      const index = this.allTransfers.findIndex((transfer) => transfer._id === updatedTransfer._id)
      if (index !== -1) {
        this.allTransfers[index] = updatedTransfer
      }
      if (this.currentSelectedTransfer?._id === updatedTransfer._id) {
        this.currentSelectedTransfer = updatedTransfer
      }
    },

    async deleteTransfer(transferId: string) {
      try {
        this.loading = true
        await api.delete(`/transfers/${transferId}`)
        this.allTransfers = this.allTransfers.filter((transfer) => transfer._id !== transferId)
        this.currentSelectedTransfer = null
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error deleting transfer'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getTransfersStats(): Promise<ITrnsfersStats> {
      try {
        this.loading = true
        const response = await api.get('/transfers/stats')
        this.stats = response.data.data as ITrnsfersStats
        return response.data.data as ITrnsfersStats
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
