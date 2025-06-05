import { defineStore } from 'pinia'
import axios from 'axios'
import { Order } from '../types'

interface OrdersState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),

  getters: {
    allOrders: (state) => state.orders,
    currentOrder: (state) => state.currentOrder,
    isLoading: (state) => state.loading,
    error: (state) => state.error
  },

  actions: {
    async getOrders(filters = {}) {
      try {
        this.loading = true
        const response = await axios.get('/api/v1/orders', { params: filters })
        this.orders = response.data.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching orders'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getMyOrders() {
      try {
        this.loading = true
        const response = await axios.get('/api/v1/orders/my-orders')
        this.orders = response.data.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching orders'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getOrder(orderId: string) {
      try {
        this.loading = true
        const response = await axios.get(`/api/v1/orders/${orderId}`)
        this.currentOrder = response.data.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching order'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrder(orderData: Partial<Order>) {
      try {
        this.loading = true
        const response = await axios.post('/api/v1/orders', orderData)
        this.orders.unshift(response.data.data)
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error creating order'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrder({ orderId, orderData }: { orderId: string; orderData: Partial<Order> }) {
      try {
        this.loading = true
        const response = await axios.put(`/api/v1/orders/${orderId}`, orderData)
        const index = this.orders.findIndex(order => order._id === orderId)
        if (index !== -1) {
          this.orders.splice(index, 1, response.data.data)
        }
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error updating order'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteOrder(orderId: string) {
      try {
        this.loading = true
        await axios.delete(`/api/v1/orders/${orderId}`)
        this.orders = this.orders.filter(order => order._id !== orderId)
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error deleting order'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 