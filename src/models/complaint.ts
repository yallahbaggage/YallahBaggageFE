import type { IUser } from './user'
import type { IWorker } from './worker'

// export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected'
// export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ComplaintCategory = 'service' | 'worker' | 'payment' | 'technical' | 'other'


export const ComplaintStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  CLOSED: 'closed',
} as const;

export type ComplaintStatus = (typeof ComplaintStatus)[keyof typeof ComplaintStatus];

export const ComplaintPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type ComplaintPriority = (typeof ComplaintPriority)[keyof typeof ComplaintPriority];

export interface IComplaint {
  _id: string
  title: string
  description: string
  category: ComplaintCategory
  priority: ComplaintPriority
  status: ComplaintStatus
  orderId: string
  userId: IUser
  assignedToId?: IUser
  relatedWorkerId?: IWorker
  closedByAdminId?: IUser
  attachments?: string[]
  resolution?: string
  responses: IComplaintResponse[]
  closedAt?: string
  createdAt: string
  updatedAt: string
}

export interface IComplaintResponse {
  _id: string
  message: string
  responderId: IUser
  responderRole: 'customer' | 'admin'
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

export interface ICreateComplaint {
  title: string
  description: string
  category: ComplaintCategory
  priority: ComplaintPriority
  orderId: string
  relatedWorkerId?: string
  attachments?: File[]
}

export interface IUpdateComplaint {
  title?: string
  description?: string
  category?: ComplaintCategory
  priority?: ComplaintPriority
  status?: ComplaintStatus
  assignedToId?: string
  resolution?: string
  attachments?: File[]
}

export interface IAddComplaintResponse {
  message: string
  attachments?: File[]
}

export interface IComplaintStats {
  totalComplaints: number
  resolvedComplaints: number
  pendingComplaints: number
  averageResolutionTime: number // in hours
  complaintsByCategory: Record<ComplaintCategory, number>
  complaintsByPriority: Record<ComplaintPriority, number>
  complaintsByStatus: Record<ComplaintStatus, number>
}

export interface ComplaintFilterParams {
  status?: ComplaintStatus
  priority?: ComplaintPriority
  category?: ComplaintCategory
  assignedToId?: string
  relatedWorkerId?: string
  createdAt?: {
    from: string
    to: string
  }
  search?: string
  sortBy?: string
  order?: 'asc' | 'desc'
  page?: string
  limit?: string
}