import { IUser } from '@/models/user';
import api from './api';

interface IReadBy {
  user: IUser;
  readAt: Date;
}

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetUsers: IUser[];
  isGlobal: boolean;
  createdBy: IUser;
  readBy: IReadBy[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetUsers?: string[];
  isGlobal?: boolean;
  expiresAt?: Date;
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  targetUsers?: string[];
  isGlobal?: boolean;
  expiresAt?: Date;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

class NotificationsService {
  private readonly baseUrl = `/notifications`;

  async getAll(params: { page: number; limit: number }): Promise<PaginatedResponse<INotification>> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  async getById(id: string): Promise<INotification> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(notification: CreateNotificationDto): Promise<INotification> {
    const response = await api.post(this.baseUrl, notification);
    return response.data;
  }

  async update(id: string, notification: UpdateNotificationDto): Promise<INotification> {
    const response = await api.patch(`${this.baseUrl}/${id}`, notification);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async markAsRead(id: string): Promise<INotification> {
    const response = await api.patch(`${this.baseUrl}/${id}/read`);
    return response.data;
  }

  async markAllAsRead(): Promise<void> {
    await api.patch(`${this.baseUrl}/read-all`);
  }
}

export const notificationsService = new NotificationsService();
