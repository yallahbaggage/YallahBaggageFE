import { defineStore } from 'pinia'
import { socketService } from '@/services/socket'
import { ITrnsfersStats, Transfer } from '@/models/transfer';
import api from '@/utils/services/api';

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}
interface TransfersState {
  transfers: Transfer[]
  currentTransfer: Transfer | null
  loading: boolean
  error: string | null,
  pagination: Pagination | null,
  stats: ITrnsfersStats | null,
  deleteTransfer: Transfer | null,
}

export const useTransfersStore = defineStore('transfers', {
  state: (): TransfersState => ({
    transfers: [],
    currentTransfer: null,
    loading: false,
    error: null,
    pagination: null,
    stats: null,
    deleteTransfer: null,
  }),

  getters: {
    allTransfers: (state) => state.transfers,
    currentTransfer: (state) => state.currentTransfer,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
    paginationInfo: (state): Pagination | null => state.pagination,
    transferStats: (state) => state.stats,
    deleteTransfer: (state): Transfer | null  => state.deleteTransfer,
  },

  actions: {
    async getTransfers(filters = {}) {
      try {
        this.loading = true
        const response = await api.get('/transfers', { params: filters })
        this.transfers = response.data.data
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
        this.transfers = response.data.data
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
        this.currentTransfer = response.data.data
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
        this.transfers.unshift(response.data.data)
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
    //     const updatedTransfer = { ...this.currentTransfer, status } as Transfer
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

        // Optimistically update currentTransfer if available
        if (this.currentTransfer && this.currentTransfer._id === transferId) {
          this.currentTransfer = { ...this.currentTransfer, ...transferData }
        }

        const response = await api.put(`/transfers/${transferId}`, transferData)

        // Update in transfer list
        const index = this.transfers.findIndex((transfer) => transfer._id === transferId)
        if (index !== -1) {
          this.transfers.splice(index, 1, response.data.data)
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
      const index = this.transfers.findIndex((transfer) => transfer._id === updatedTransfer._id)
      if (index !== -1) {
        this.transfers[index] = updatedTransfer
      }
      if (this.currentTransfer?._id === updatedTransfer._id) {
        this.currentTransfer = updatedTransfer
      }
    },

    async deleteTransfer(transferId: string) {
      try {
        this.loading = true
        await api.delete(`/transfers/${transferId}`)
        this.transfers = this.transfers.filter((transfer) => transfer._id !== transferId)
        this.currentTransfer = null
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error deleting transfer'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
