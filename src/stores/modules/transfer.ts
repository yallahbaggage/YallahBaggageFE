import { defineStore } from 'pinia'
import axios from 'axios'
import { Transfer } from '../types'

interface TransfersState {
  transfers: Transfer[]
  currentTransfer: Transfer | null
  loading: boolean
  error: string | null
}

export const useTransfersStore = defineStore('transfers', {
  state: (): TransfersState => ({
    transfers: [],
    currentTransfer: null,
    loading: false,
    error: null
  }),

  getters: {
    allTransfers: (state) => state.transfers,
    currentTransfer: (state) => state.currentTransfer,
    isLoading: (state) => state.loading,
    error: (state) => state.error
  },

  actions: {
    async getTransfers(filters = {}) {
      try {
        this.loading = true
        const response = await axios.get('/api/v1/transfers', { params: filters })
        this.transfers = response.data.data
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
        const response = await axios.get('/api/v1/transfers/my-transfers')
        this.transfers = response.data.data
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
        const response = await axios.get(`/api/v1/transfers/${transferId}`)
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
        const response = await axios.post('/api/v1/transfers', transferData)
        this.transfers.unshift(response.data.data)
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error creating transfer'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTransfer({ transferId, transferData }: { transferId: string; transferData: Partial<Transfer> }) {
      try {
        this.loading = true
        const response = await axios.put(`/api/v1/transfers/${transferId}`, transferData)
        const index = this.transfers.findIndex(transfer => transfer._id === transferId)
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

    async deleteTransfer(transferId: string) {
      try {
        this.loading = true
        await axios.delete(`/api/v1/transfers/${transferId}`)
        this.transfers = this.transfers.filter(transfer => transfer._id !== transferId)
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error deleting transfer'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 