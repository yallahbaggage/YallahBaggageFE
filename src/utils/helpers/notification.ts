import { ElMessage } from 'element-plus'

export const errorMessage = (message: string) => {
  ElMessage.error({
    message: message,
    duration: 2000,
  })
}

export const warnMessage = (message: string) => {
  ElMessage.warning({
    message: message,
    duration: 2000,
  })
}

export const infoMessage = (message: string) => {
  ElMessage.success({
    message: message,
    duration: 2000,
  })
}

import { ElNotification } from 'element-plus'

interface CustomNotificationOptions {
  title: string
  description: string
  icon?: string // Emoji or HTML
  type?: 'success' | 'warning' | 'info' | 'error'
}

export const showCustomNotification = ({
  title,
  description,
  icon,
  type = 'info',
}: CustomNotificationOptions) => {
  ElNotification({
    title: '',
    message: `
      <div class="custom-toast-content">
        <div class="toast-header">
          <div class="icon-and-type">
            <div class="icon-container ${type}-icon">
            ${icon || ''}
          </div>
          </div>
          <button class="close-btn" onclick="this.closest('.el-notification').style.display='none'">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="text-block">
          <div class="title">${title}</div>
          <div class="description">${description}</div>
        </div>
      </div>
    `,
    type,
    duration: 2000,
    dangerouslyUseHTMLString: true,
    customClass: `custom-toast ${type}-toast`,
    position: 'bottom-right',
    showClose: false,
  })
}

// Specific presets
export const toastSuccessMessage = (title: string, description: string) =>
  showCustomNotification({
    title,
    description,
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    type: 'success',
  })

export const toastDeleteMessage = (title: string, description: string) =>
  showCustomNotification({
    title,
    description,
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2.5 5H4.16667H17.5" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.8332 5V16.6667C15.8332 17.1087 15.6576 17.5326 15.345 17.845C15.0326 18.1575 14.6087 18.3333 14.1665 18.3333H5.83317C5.39114 18.3333 4.96722 18.1575 4.65466 17.845C4.3421 17.5326 4.1665 17.1087 4.1665 16.6667V5M6.6665 5V3.33333C6.6665 2.89131 6.8421 2.46738 7.15466 2.15482C7.46722 1.84226 7.89114 1.66667 8.33317 1.66667H11.6665C12.1085 1.66667 12.5325 1.84226 12.845 2.15482C13.1576 2.46738 13.3332 2.89131 13.3332 3.33333V5" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    type: 'error',
  })

export const toastErrorMessage = (title: string, description: string) =>
  showCustomNotification({
    title,
    description,
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5L15 15" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    type: 'error',
  })

export const toastInfoMessage = (title: string, description: string) =>
  showCustomNotification({
    title,
    description,
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.33333" stroke="white" stroke-width="2"/>
      <path d="M10 6.66666V10" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M10 13.3333H10.0083" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    type: 'info',
  })
