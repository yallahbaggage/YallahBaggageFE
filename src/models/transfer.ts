import { Complaint, User } from '@/stores/types';

export interface TransferItem {
  name: string;
  weight: number;
  images: string[];
  isBreakable: boolean;
}

export interface TransferRating {
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Transfer {
  _id: string;
  userId: string | User;
  workerId?: string | Worker;
  complaintId?: string | Complaint;
  items: TransferItem[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  scheduledDate: string;
  from: string;
  to: string;
  flightGate?: string;
  flightNumber?: string;
  pickUpDate: string;
  pickUpTime: string;
  completedAt?: string;
  cancelledAt?: string;
  rating?: TransferRating;
  createdAt: string;
  updatedAt: string;
}


export interface ITrnsfersStats {
  data: {
    todaysTransfers: number
    todaysTransfersChange: number
    currentTransfers: number
    currentTransfersChange: number
    cancelledTransfers: number
    cancelledTransfersChange: number
  } | null
  todaysTransfers: number
  todaysTransfersChange: number
  currentTransfers: number
  currentTransfersChange: number
  cancelledTransfers: number
  cancelledTransfersChange: number
}
