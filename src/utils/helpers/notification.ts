import { ElMessage } from "element-plus";

export const errorMessage = (message: string) => {
	ElMessage.error({
		message: message,
		duration: 2000,
	});
};

export const warnMessage = (message: string) => {
	ElMessage.warning({
		message: message,
		duration: 2000,
	});
};

export const infoMessage = (message: string) => {
	ElMessage.success({
		message: message,
		duration: 2000,

	});
};

import { ElNotification } from 'element-plus';

interface CustomNotificationOptions {
  title: string;
  description: string;
  icon?: string; // Emoji or HTML
  type?: 'success' | 'warning' | 'info' | 'error';
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
        ${icon ? `<div class="custom-icon">${icon}</div>` : ''}
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
  });
};


// Specific presets
export const toastSuccessMessage = (title: string, description: string) =>
  showCustomNotification({
    title,
    description,
    icon: '✅',
    type: 'success',
  });

export const toastDeleteMessage = (title: string, description: string) =>
  showCustomNotification({
    title,
    description,
    icon: '🗑️',
    type: 'warning',
  });

export const toastErrorMessage = (title: string, description: string) =>
  showCustomNotification({
    title,
    description,
    icon: '❌',
    type: 'error',
  });

export const toastInfoMessage = (title: string, description: string) =>
  showCustomNotification({
    title,
    description,
    icon: 'ℹ️',
    type: 'info',
  });
