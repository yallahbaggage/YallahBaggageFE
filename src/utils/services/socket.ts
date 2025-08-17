import { io, Socket } from 'socket.io-client';
import { Transfer } from '@/models/transfer';
import { useTransfersStore } from '@/stores/modules/transfer';

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

    this.socket = io(import.meta.env.VITE_API_URL || 'https://baggs10.onrender.com', {
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

    this.socket.on('transferStatusUpdated', (updatedTransfer: Transfer) => {
      const transferStore = useTransfersStore();
      transferStore.updateTransferStatus(updatedTransfer);
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

  emitTransferStatusUpdate(transferId: string, status: string) {
    if (this.socket?.connected) {
      this.socket.emit('updateTransferStatus', { transferId, status });
    }
  }
}

export const socketService = SocketService.getInstance(); 