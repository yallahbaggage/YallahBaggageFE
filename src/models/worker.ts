import type { IUser } from './user'

export interface IWorker extends IUser {
  specialization: string
  rating: number
  isAvailable: boolean
  completedJobs: number
  skills: string[]
  certificates?: string[]
  experience: number // in years
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