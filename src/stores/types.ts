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

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: 'service' | 'worker' | 'payment' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'closed';
  orderId: string;
  userId: string | User;
  assignedToId?: string | User;
  relatedWorkerId?: string | Worker;
  closedByAdminId?: string | User;
  attachments?: string[];
  resolution?: string;
  responses?: Array<{
    message: string;
    responderId: string | User;
    responderRole: 'customer' | 'admin';
    attachments?: string[];
    createdAt: string;
    updatedAt: string;
  }>;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  name: string;
  weight: number;
  images: string[];
  isBreakable: boolean;
}

export interface OrderRating {
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  workerId?: string | Worker;
  complaintId?: string | Complaint;
  items: OrderItem[];
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
  rating?: OrderRating;
  createdAt: string;
  updatedAt: string;
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
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Worker {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  specialization: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  certificates?: string[];
  experience: number;
  serviceRatings: ServiceRating[];
  createdAt: string;
  updatedAt: string;
} 