import { defineStore } from 'pinia';
import { notificationsService, type CreateNotificationDto, type UpdateNotificationDto, type INotification } from '@/utils/services/notificationsService';
import { IUser } from '@/models/user';
import { useAuthStore } from './authStore';

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

interface IReadBy {
  user: IUser;
  readAt: Date;
}

interface NotificationsState {
  notifications: INotification[];
  currentNotification: INotification | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    notifications: [],
    currentNotification: null,
    loading: false,
    error: null,
    pagination: null,
  }),

  getters: {
    allNotifications: (state): INotification[] => state.notifications,
    currentNotificationData: (state): INotification | null => state.currentNotification,
    isLoading: (state): boolean => state.loading,
    errorMessage: (state): string | null => state.error,
    paginationInfo: (state): Pagination | null => state.pagination,
  },

  actions: {
    async fetchNotifications(params: { page?: string; limit?: string }): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const response = await notificationsService.getAll({
          page: params.page ? parseInt(params.page) : 1,
          limit: params.limit ? parseInt(params.limit) : 10,
        });
        this.notifications = response.data;
        this.pagination = response.pagination;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch notifications';
      } finally {
        this.loading = false;
      }
    },

    async createNotification(notification: CreateNotificationDto): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const newNotification = await notificationsService.create(notification);
        this.notifications.unshift(newNotification);
        if (this.pagination) {
          this.pagination.total += 1;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create notification';
      } finally {
        this.loading = false;
      }
    },

    async updateNotification(id: string, notification: UpdateNotificationDto): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const updatedNotification = await notificationsService.update(id, notification);
        const index = this.notifications.findIndex(n => n._id === id);
        if (index !== -1) {
          this.notifications[index] = updatedNotification;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update notification';
      } finally {
        this.loading = false;
      }
    },

    async deleteNotification(id: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await notificationsService.delete(id);
        this.notifications = this.notifications.filter(n => n._id !== id);
        if (this.pagination) {
          this.pagination.total -= 1;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete notification';
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(id: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const updatedNotification = await notificationsService.markAsRead(id);
        const index = this.notifications.findIndex(n => n._id === id);
        if (index !== -1) {
          this.notifications[index] = updatedNotification;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to mark notification as read';
      } finally {
        this.loading = false;
      }
    },

    async markAllAsRead(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error('User not authenticated');
        }
        await notificationsService.markAllAsRead();
        this.notifications = this.notifications.map(n => ({
          ...n,
          readBy: [...(n.readBy ?? []), { user: authStore.user!, readAt: new Date() }],
        }));
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      } finally {
        this.loading = false;
      }
    },

    setCurrentNotification(notification: INotification | null): void {
      this.currentNotification = notification;
    },
  },
});
