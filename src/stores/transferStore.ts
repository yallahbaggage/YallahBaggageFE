import { defineStore } from 'pinia';
import { Transfer, TransferState } from './types';
import { socketService } from '@/services/socket';

export const useTransferStore = defineStore('transfers', {
  state: (): TransferState => ({
    transfers: [],
    currentTransfer: null,
    loading: false,
    error: null
  }),

  actions: {
    updateTransferStatus(updatedTransfer: Transfer) {
      const index = this.transfers.findIndex(transfer => transfer._id === updatedTransfer._id);
      if (index !== -1) {
        this.transfers[index] = updatedTransfer;
      }
      if (this.currentTransfer?._id === updatedTransfer._id) {
        this.currentTransfer = updatedTransfer;
      }
    },

    async updateTransfer(transferId: string, status: string) {
      try {
        this.loading = true;
        // Emit socket event for real-time update
        socketService.emitTransferStatusUpdate(transferId, status);
        
        // Update local state optimistically
        const updatedTransfer = { ...this.currentTransfer, status } as Transfer;
        this.updateTransferStatus(updatedTransfer);
        
        this.loading = false;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update transfer';
        this.loading = false;
        throw error;
      }
    }
  }
}); 