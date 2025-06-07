import { io, Socket } from 'socket.io-client';
import { useOrderStore } from '../stores/orderStore';
import { Order } from '../stores/types';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: {
        token
      },
      transports: ['websocket']
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('orderStatusUpdated', (updatedOrder: Order) => {
      const orderStore = useOrderStore();
      orderStore.updateOrderStatus(updatedOrder);
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emitOrderStatusUpdate(orderId: string, status: string) {
    if (this.socket?.connected) {
      this.socket.emit('updateOrderStatus', { orderId, status });
    }
  }
}

export const socketService = SocketService.getInstance(); 