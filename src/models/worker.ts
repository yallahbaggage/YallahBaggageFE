import { IBaseUser } from './base'

export interface IWorker extends IBaseUser {
  role: 'admin' | 'worker';
  specialization?: string;
  rating?: number;
  totalTransfers?: number;
  status?: 'Available' | 'Assigned' | 'On The Way';
}

export interface IWorkerUpdateData {
  name?: string
  email?: string
  phone?: string
  address?: string
  specialization?: string
  isAvailable?: boolean
  skills?: string[]
  certificates?: string[]
  experience?: number
}

export interface IWorkerStats {
  totalJobs: number
  completedJobs: number
  averageRating: number
  totalEarnings: number
  monthlyJobs: number[]
}

export interface IServiceRating {
  serviceId: string
  rating: number
  comment?: string
} 