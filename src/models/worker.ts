import { IUser } from './user'

export interface IWorker extends IUser {
  // _id: string
  // name: string
  // email: string
  // phone: string
  serviceRatings: IServiceRating[]
  // preferredLang?: string
  // region?: string
  // timeFormat: '12' | '24'
  // image?: string
  role: 'worker' | 'manager' | 'supervisor'
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

export interface IServiceRating {
  serviceId: string
  rating: number
  comment?: string
} 