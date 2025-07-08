import { ITrnsfersStats } from '@/models/transfer'

export interface RootState {
  auth: AuthState
  transfers: ITrnsfersStats
  services: ServiceState
  workers: WorkerState
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface ServiceState {
  services: Service[]
  currentService: Service | null
  loading: boolean
  error: string | null
}

export interface WorkerState {
  workers: Worker[]
  currentWorker: Worker | null
  loading: boolean
  error: string | null
}

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin' | 'worker' | 'manager' | 'supervisor'
  preferredLang?: string
  region?: string
  timeFormat: '12' | '24'
  image?: string
  createdAt: string
  updatedAt: string
  informationPreference: ['email', 'sms', 'call', 'whatsapp']
}

export interface Complaint {
  _id: string
  title: string
  description: string
  category: 'service' | 'worker' | 'payment' | 'technical' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'closed'
  transferId: string
  userId: string | User
  assignedToId?: string | User
  relatedWorkerId?: string | Worker
  closedByAdminId?: string | User
  attachments?: string[]
  resolution?: string
  responses?: Array<{
    message: string
    responderId: string | User
    responderRole: 'customer' | 'admin'
    attachments?: string[]
    createdAt: string
    updatedAt: string
  }>
  closedAt?: string
  createdAt: string
  updatedAt: string
}
export interface Service {
  _id: string
  name: string
  description: string
  price: number
  duration: number
  createdAt: string
  updatedAt: string
}

export interface ServiceRating {
  serviceId: string
  rating: number
  comment?: string
}

export interface Worker {
  _id: string
  name: string
  email: string
  phone: string
  status: 'Available' | 'Assigned' | 'OnTheWay' | 'OnLeave'
  specialization: string
  rating: number
  completedJobs: number
  skills: string[]
  certificates?: string[]
  experience: number
  serviceRatings: ServiceRating[]
  createdAt: string
  updatedAt: string
}
