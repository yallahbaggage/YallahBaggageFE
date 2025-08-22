import { Logging, StorageHelper } from ".";
import { infoMessage } from '@/utils/helpers/notification'
import { errorMessage } from '@/utils/helpers/notification'


// Status color configuration types
export interface StatusColorConfig {
  color: string;
  backgroundColor: string;
  textColor?: string;
}

export type StatusType =
  // Complaint statuses
  | 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'closed'
  // Transfer statuses
  | 'in_transit' | 'OnTheWay' | 'completed'
  // Notification statuses
  | 'sent' | 'failed'
  // Employee/Driver statuses
  | 'active' | 'assigned' | 'inactive' | 'available' | 'unavailable'
  // Banner/Ad statuses
  | 'active' | 'deactive'
  // Generic statuses
  | 'success' | 'error' | 'warning' | 'info'
  // Date-based statuses
  | 'expired' | 'expiring_soon' | 'valid'
  // Special statuses
  | 'NEW_ENTITY' | 'PROCESSING' | 'PROMISE' | 'RESTRUCTURE' | 'SCHEDULE' | 'EXCEPTIONAL' | 'CONTROL' | 'NO_INTERVIEW' | 'YES_INTERVIEW' | 'ESCALATION' | 'CALL_SUCCESS' | 'CALL_FAILED';

export const StaticFunctions = {
  async scrollToBottom(scrollElement: HTMLElement) { 
    await new Promise(resolve => setTimeout(resolve, 100));
    scrollElement.scrollTop = scrollElement.scrollHeight; //NOTE: Scroll to bottom
    Logging.logDebug('scrollToBottom jump?');
  },

  tokenClean() {
    Logging.logDebug('AuthenticationManager._tokenClean()');
    StorageHelper.delete('code');
    StorageHelper.delete('accessToken');
    StorageHelper.delete('idToken');
    StorageHelper.delete('accessTokenExpireDate');

    Logging.logDebug('Token Cleaned');
  },

  refreshTokenClean() {
    Logging.logDebug('AuthenticationManager._refreshTokenClean()');
    StorageHelper.delete('code');
    StorageHelper.delete('refreshToken');
    StorageHelper.delete('refreshTokenExpireDate');
  },

  copyToClipboard: async (textToCopy: string, t: (key: string) => string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      infoMessage(t('copiedSuccessfully'))
    } catch (err) {
      Logging.logError('Failed to copy: '+ err)
      errorMessage(t('standardError'))
    }
  },

  saveOffset(page: number): void {
    const newState = { ...history.state };
    if (!newState.startPage || newState.startPage !== page) {
      newState.startPage = page;
      history.replaceState(newState, '', window.location.href);
    }
  },

  // ===== STATUS COLOR FUNCTIONS =====

  /**
   * Get status color for any status type across the application
   * @param status - The status string
   * @returns StatusColorConfig with color, backgroundColor, and textColor
   */
  getStatusColor(status: string): StatusColorConfig {
    const statusLower = status.toLowerCase();

    // Complaint statuses
    if (['Pending', 'pending'].includes(statusLower)) {
      return { color: '#f59e0b', backgroundColor: '#FFF3EB', textColor: '#ffffff' };
    }
    if (['In_progress','in_progress','Assigned','assigned', 'inprogress'].includes(statusLower)) {
      return { color: '#335CFF', backgroundColor: '#EBF1FF', textColor: '#ffffff' };
    }
    if (['Resolved', 'resolved'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['Rejected', 'rejected'].includes(statusLower)) {
      return { color: '#FB3748', backgroundColor: '#FFEBEC', textColor: '#ffffff' };
    }
    if (['Closed', 'closed'].includes(statusLower)) {
      return { color: '#6b7280', backgroundColor: '#f3f4f6', textColor: '#ffffff' };
    }

    // Transfer statuses
    if (['in_transit','In_transit', 'intransit'].includes(statusLower)) {
      return { color: '#FFC107', backgroundColor: '#FFF8D9', textColor: '#000000' };
    }
    if (['OnTheWay', 'ontheway'].includes(statusLower)) {
      return { color: '#FA7319', backgroundColor: '#FFF3EB', textColor: '#000000' };
    }
    if (['Completed', 'completed'].includes(statusLower)) {
      return { color: '#1fc16b', backgroundColor: '#E9F9EE', textColor: '#ffffff' };
    }

    // Notification statuses
    if (['Sent', 'sent'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['Failed', 'failed'].includes(statusLower)) {
      return { color: '#FB3748', backgroundColor: '#FFEBEC', textColor: '#ffffff' };
    }

    // Employee/Driver statuses
    if (['active', 'available'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['inactive', 'unavailable'].includes(statusLower)) {
      return { color: '#6b7280', backgroundColor: '#f3f4f6', textColor: '#ffffff' };
    }

    // Banner/Ad statuses
    if (['Active', 'active'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['deactive', 'inactive'].includes(statusLower)) {
      return { color: '#6b7280', backgroundColor: '#f3f4f6', textColor: '#ffffff' };
    }

    // Generic statuses
    if (['success', 'success'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['error', 'error'].includes(statusLower)) {
      return { color: '#FB3748', backgroundColor: '#FFEBEC', textColor: '#ffffff' };
    }
    if (['warning', 'warning'].includes(statusLower)) {
      return { color: '#f59e0b', backgroundColor: '#FFF3EB', textColor: '#ffffff' };
    }
    if (['info', 'info'].includes(statusLower)) {
      return { color: '#335CFF', backgroundColor: '#EBF1FF', textColor: '#ffffff' };
    }

    // Special statuses
    if (['NEW_ENTITY', 'new_entity'].includes(statusLower)) {
      return { color: '#FF9800', backgroundColor: '#FFF4E5', textColor: '#000000' };
    }
    if (['PROCESSING', 'processing'].includes(statusLower)) {
      return { color: '#335CFF', backgroundColor: '#EBF1FF', textColor: '#ffffff' };
    }
    if (['PROMISE', 'promise'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['RESTRUCTURE', 'restructure'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['SCHEDULE', 'schedule'].includes(statusLower)) {
      return { color: '#335CFF', backgroundColor: '#EBF1FF', textColor: '#ffffff' };
    }
    if (['EXCEPTIONAL', 'exceptional'].includes(statusLower)) {
      return { color: '#8B5CF6', backgroundColor: '#F3E8FF', textColor: '#ffffff' };
    }
    if (['CONTROL', 'control'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['NO_INTERVIEW', 'no_interview'].includes(statusLower)) {
      return { color: '#FB3748', backgroundColor: '#FFEBEC', textColor: '#ffffff' };
    }
    if (['YES_INTERVIEW', 'yes_interview'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['ESCALATION', 'escalation'].includes(statusLower)) {
      return { color: '#FF9800', backgroundColor: '#FFF4E5', textColor: '#000000' };
    }
    if (['CALL_SUCCESS', 'call_success'].includes(statusLower)) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' };
    }
    if (['CALL_FAILED', 'call_failed'].includes(statusLower)) {
      return { color: '#FB3748', backgroundColor: '#FFEBEC', textColor: '#ffffff' };
    }

    // Default fallback
    return { color: '#9ca3af', backgroundColor: '#f3f4f6', textColor: '#ffffff' };
  },

  /**
   * Get only the main color for a status (for backward compatibility)
   * @param status - The status string
   * @returns The main color string
   */
  getStatusColorOnly(status: string): string {
    return this.getStatusColor(status).color;
  },

  /**
   * Get only the background color for a status
   * @param status - The status string
   * @returns The background color string
   */
  getStatusBackgroundColor(status: string): string {
    return this.getStatusColor(status).backgroundColor;
  },

  /**
   * Get status color based on expire date
   * @param date - The expire date
   * @returns StatusColorConfig
   */
  getStatusColorByExpireDate(date: string | Date): StatusColorConfig {
    const now = new Date();
    const expire = new Date(date);

    if (expire > now) {
      return { color: '#1FC16B', backgroundColor: '#E0FAEC', textColor: '#ffffff' }; // green - valid
    }
    if (expire.toDateString() === now.toDateString()) {
      return { color: '#6b7280', backgroundColor: '#f3f4f6', textColor: '#ffffff' }; // grey - expiring today
    }
    return { color: '#FB3748', backgroundColor: '#FFEBEC', textColor: '#ffffff' }; // red - expired
  },

  /**
   * Get status color based on expire date (for backward compatibility)
   * @param date - The expire date
   * @returns The main color string
   */
  getStatusColorByExpireDateOnly(date: string | Date): string {
    return this.getStatusColorByExpireDate(date).color;
  }
};
