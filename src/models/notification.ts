import type { IUser } from './user'
import type { IComplaint } from './complaint'

export type NotificationType = 
  | 'complaint_update' 
  | 'complaint_assigned' 
  | 'complaint_resolved'
  | 'new_comment'
  | 'status_change'
  | 'worker_assigned'
  | 'system'
  | 'other'

export interface INotification {
  _id: string
  type: NotificationType
  title: string
  message: string
  recipient: IUser
  isRead: boolean
  relatedComplaint?: IComplaint
  data?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ICreateNotification {
  type: NotificationType
  title: string
  message: string
  recipientId: string
  relatedComplaintId?: string
  data?: Record<string, any>
}

export interface IUpdateNotification {
  isRead?: boolean
}

export interface INotificationPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  notificationTypes: {
    [key in NotificationType]: boolean
  }
}

export interface INotificationStats {
  totalNotifications: number
  unreadNotifications: number
  notificationsByType: Record<NotificationType, number>
  averageResponseTime: number // in minutes
} 