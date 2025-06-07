import { defineStore } from 'pinia';
import { Order, OrderState } from './types';
import { socketService } from '@/services/socket';

export const useOrderStore = defineStore('orders', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),

  actions: {
    updateOrderStatus(updatedOrder: Order) {
      const index = this.orders.findIndex(order => order._id === updatedOrder._id);
      if (index !== -1) {
        this.orders[index] = updatedOrder;
      }
      if (this.currentOrder?._id === updatedOrder._id) {
        this.currentOrder = updatedOrder;
      }
    },

    async updateOrder(orderId: string, status: string) {
      try {
        this.loading = true;
        // Emit socket event for real-time update
        socketService.emitOrderStatusUpdate(orderId, status);
        
        // Update local state optimistically
        const updatedOrder = { ...this.currentOrder, status } as Order;
        this.updateOrderStatus(updatedOrder);
        
        this.loading = false;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update order';
        this.loading = false;
        throw error;
      }
    }
  }
}); 