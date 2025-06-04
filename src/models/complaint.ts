import type { IUser } from './user'
import type { IWorker } from './worker'

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected'
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ComplaintCategory = 'service' | 'worker' | 'payment' | 'technical' | 'other'

export interface IComplaint {
  _id: string
  title: string
  description: string
  category: ComplaintCategory
  priority: ComplaintPriority
  status: ComplaintStatus
  submittedBy: IUser
  assignedTo?: IWorker
  relatedWorker?: IWorker
  attachments?: string[] // URLs to attached files
  resolution?: string
  comments: IComplaintComment[]
  createdAt: string
  updatedAt: string
}

export interface IComplaintComment {
  _id: string
  text: string
  author: IUser
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

export interface ICreateComplaint {
  title: string
  description: string
  category: ComplaintCategory
  priority: ComplaintPriority
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

export interface IAddComplaintComment {
  text: string
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