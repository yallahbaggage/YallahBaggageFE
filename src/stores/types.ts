export interface RootState {
  auth: AuthState
  orders: OrderState
  services: ServiceState
  workers: WorkerState
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
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
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface Order {
  _id: string
  userId: string | User
  serviceId: string | Service
  workerId: string | Worker
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  scheduledDate: string
  completedAt?: string
  cancelledAt?: string
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

export interface Worker {
  _id: string
  name: string
  email: string
  phone: string
  status: 'available' | 'busy' | 'offline'
  createdAt: string
  updatedAt: string
} 