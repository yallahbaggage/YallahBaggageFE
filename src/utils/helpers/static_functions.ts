import { Phone, Settings } from "@/models";
import { Logging, StorageHelper } from ".";
import { infoMessage } from '@/utils/helpers/notification'
import { errorMessage } from '@/utils/helpers/notification'

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
  
   formatPhoneNumber(phone: Phone | string, settings: Settings) {
    let phoneNumberText: string;

    // Check if the input is a string or a Phone object
    if (typeof phone === 'string') phoneNumberText = phone
    else phoneNumberText = phone.phoneNumberText ?? '';

      //NOTE: Remove prefix if settings exist and showPhonePrefix is false
      if (settings?.showPhonePrefix === false && settings.phonePrefix) {
        if (phoneNumberText.startsWith(settings.phonePrefix)) {
          phoneNumberText = phoneNumberText.substring(settings.phonePrefix.length);
        }
      }
  
      //NOTE: Add relation type if available
      //   let relationTypeText = '';
      //   if (phone.relationType && phone.relationType.trim() !== '') {
      //     relationTypeText = ` (${t(phone.relationType)})`;
      //   }
  
    return phoneNumberText;
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
  }
};
