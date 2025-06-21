<template>
  <div class="notifications-page">
    <BaseHeader
      :pageIcon="'mdi-bell-outline'"
      :title="t('notifications')"
      :desc="t('manageYourAppsNotifications')"
      :show-button="true"
      :button-text="t('newNotification')"
      v-on:button-pressed="() => (isDialogOpen = true)"
    />
    <div class="page-content">
      <ServerTable
        :headers="headers"
        :items="items"
        :total-items="totalItems"
        :loading="loading"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
      >
        <template #cell-_id="{ item }"> #{{ item._id.substring(0, 6) }} </template>
        <template #cell-type="{ item }">
          <v-chip
            :color="getTypeColor(item?.createdAt ? 'sent' : 'failed')"
            text-color="white"
            small
          >
            <span
              :style="{ backgroundColor: statusColor(item.status) }"
              class="status-circle"
            ></span>
            {{ item?.createdAt ? t('sent') : t('failed') }}
          </v-chip>
        </template>
        <!-- <template #cell-isRead="{ item }">
          <v-chip :color="item.isRead ? 'grey' : 'warning'" text-color="white" small>
            {{ item.isRead ? t('read') : t('unread') }}
          </v-chip>
        </template> -->
        <template #cell-createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
        <template #actions="{ item }">
          <v-menu location="bottom end" offset="4">
            <template #activator="{ props }">
              <v-btn icon v-bind="props" variant="text" density="comfortable">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="menu-list pa-0 ma-0">
              <v-list class="menu-list pa-0 ma-0">
                <v-list-item class="menu-item" @click="viewDetails(item)">
                  <v-icon class="mr-2">mdi-eye-outline</v-icon>
                  {{ t('seeDetails') }}
                </v-list-item>
                <v-list-item class="menu-item" @click="deleteNotification(item)">
                  <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                  {{ t('deleteNotification') }}
                </v-list-item>
              </v-list>
            </v-list>
          </v-menu>
        </template>
      </ServerTable>

      <!-- add Drawer -->
      <Drawer
        :isOpen="isDialogOpen"
        :title="t('sendNotification')"
        :desc="t('fillOutAllTheInformationsToAdd')"
        @close="
          () => {
            isDialogOpen = false
            resetForm()
          }
        "
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onAddButtonPressed()" class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('generalInformation') }}</p>
              </div>
              <div>
                <div class="drawer-form-group">
                  <label for="name" class="drawer-label-group">
                    {{ t('notificationTitle') }}<span class="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    class="form-input no-focus-border"
                    :placeholder="t('notificationTitle')"
                    v-model="newNotification.title"
                    required
                  />
                </div>
                <div class="drawer-form-group">
                  <label for="message" class="drawer-label-group">
                    {{ t('notificationDesc') }}<span class="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    type="text"
                    class="form-input no-focus-border"
                    :placeholder="t('notificationDesc')"
                    v-model="newNotification.message"
                    required
                    maxlength="200"
                  ></textarea>
                </div>
                <div class="drawer-banner">
                  <p>{{ t('advancedDetails') }}</p>
                </div>

                <div class="drawer-form-group">
                  <label for="redirectTo" class="drawer-label-group">
                    {{ t('notificationWillRedirectTo') }}</label
                  >
                  <v-text-field
                    id="banner-redirectTo"
                    v-model="newNotification.redirectTo"
                    placeholder="www.example.com"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="no-focus-border"
                  >
                    <template v-slot:prepend-inner>
                      <span class="url-prefix">://app</span>
                    </template>
                  </v-text-field>
                </div>
                <div class="drawer-form-group" v-if="!newNotification.sendNow">
                  <label for="redirectTo" class="drawer-label-group">
                    {{ t('sendNotificationOn') }}</label
                  >
                  <DateTimePicker
                    v-model="newNotification.sendNotificationOnDate"
                    :show-time="true"
                    :placeholder="t('sendNotificationOn')"
                    variant="outlined"
                    density="compact"
                    :min-date="new Date().toISOString().slice(0, 16)"
                    hide-details
                    class="no-focus-border"
                  />
                </div>
                <div class="drawer-form-group flex">
                  <v-switch
                    class="no-focus-border"
                    color="primary"
                    v-model="newNotification.sendNow"
                    hide-details
                    indeterminate
                    :label="t('sendNotificationNow')"
                  ></v-switch>
                  <v-switch
                    class="no-focus-border"
                    color="primary"
                    v-model="newNotification.isGlobal"
                    hide-details
                    indeterminate
                    :label="t('isGlobalNotification')"
                  ></v-switch>
                </div>

                <div
                  class="drawer-form-group"
                  v-if="!newNotification.isGlobal && users?.length > 0"
                >
                  <label for="redirectTo" class="drawer-label-group">
                    {{ t('selectTargetCustomers') }}</label
                  >

                  <v-select
                    v-model="newNotification.targetUsers"
                    :items="
                      users?.map((user: IUser) => ({
                        title: user.name,
                        value: user._id,
                      }))
                    "
                    item-title="title"
                    item-value="value"
                    multiple
                    chips
                    class="no-focus-border"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :placeholder="t('selectTargetCustomers')"
                  />
                </div>
              </div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  @button-pressed="
                    () => {
                      isDialogOpen = false
                      resetForm()
                    }
                  "
                  class="action-Btn"
                />
                <ActionButton :buttonText="t('save')" buttonType="submit" class="action-Btn" />
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- add Drawer -->
      <!-- details Drawer -->
      <Drawer
        :isOpen="isDetailsNotificationDrawerOpen"
        :title="t('notificationDetails')"
        :desc="t('seeYourNotificationDetail')"
        @close="isDetailsNotificationDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('generalInformation') }}</p>
              </div>
              <p class="drawer-title">{{ selectedNotification?.title }}</p>
              <p class="drawer-description">{{ selectedNotification?.message }}</p>
              <div class="drawer-banner">
                <p>{{ t('advancedDetails') }}</p>
              </div>
              <div>
                <div class="drawer-info">
                  <p class="drawer-key">{{ t('createdBy') }}</p>
                  <p class="drawer-value">{{ selectedNotification?.createdBy?.name ?? 'N/A' }}</p>
                </div>

                <div class="drawer-info">
                  <p class="drawer-key">{{ t('status') }}</p>
                  <p class="drawer-value">
                    <v-chip
                      :color="getTypeColor(selectedNotification?.createdAt ? 'sent' : 'failed')"
                      text-color="white"
                      small
                    >
                      <span
                        :style="{
                          backgroundColor: getTypeColor(
                            selectedNotification?.createdAt ? t('sent') : t('failed'),
                          ),
                        }"
                        class="status-circle"
                      ></span>
                      {{ selectedNotification?.createdAt ? t('sent') : t('failed') }}
                    </v-chip>
                  </p>
                </div>
                <div class="drawer-info">
                  <p class="drawer-key">{{ t('redirectTo') }}</p>
                  <p class="drawer-value">
                    {{ selectedNotification?.redirectTo ?? 'N/A' }}
                  </p>
                </div>

                <div class="drawer-info">
                  <p class="drawer-key">{{ t('sentOn') }}</p>
                  <p class="drawer-value">
                    {{
                      selectedNotification?.sendNotificationOnDate
                        ? formatDate(selectedNotification.sendNotificationOnDate)
                        : selectedNotification?.createdAt
                          ? formatDate(selectedNotification.createdAt)
                          : 'N/A'
                    }}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- details Drawer -->

      <!-- delete Drawer -->
      <Drawer
        :isOpen="isDeleteNotificationDrawerOpen"
        :title="t('notificationDetails')"
        :desc="t('seeYourNotificationDetail')"
        @close="isDeleteNotificationDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form class="form">
            <div>
              <div>
                <div class="drawer-banner">
                  <p>{{ t('generalInformation') }}</p>
                </div>
                <p class="drawer-title">{{ selectedNotification?.title }}</p>
                <p class="drawer-description">{{ selectedNotification?.message }}</p>
                <div class="drawer-banner">
                  <p>{{ t('advancedDetails') }}</p>
                </div>
                <div>
                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('createdBy') }}</p>
                    <p class="drawer-value">{{ selectedNotification?.createdBy?.name ?? 'N/A' }}</p>
                  </div>

                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('status') }}</p>
                    <p class="drawer-value">
                      <v-chip
                        :color="getTypeColor(selectedNotification?.createdAt ? 'sent' : 'failed')"
                        text-color="white"
                        small
                      >
                        <span
                          :style="{
                            backgroundColor: getTypeColor(
                              selectedNotification?.createdAt ? t('sent') : t('failed'),
                            ),
                          }"
                          class="status-circle"
                        ></span>
                        {{ selectedNotification?.createdAt ? t('sent') : t('failed') }}
                      </v-chip>
                    </p>
                  </div>
                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('redirectTo') }}</p>
                    <p class="drawer-value">
                      {{ selectedNotification?.redirectTo ?? 'N/A' }}
                    </p>
                  </div>

                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('sentOn') }}</p>
                    <p class="drawer-value">
                      {{
                        selectedNotification?.sendNotificationOnDate
                          ? formatDate(selectedNotification.sendNotificationOnDate)
                          : selectedNotification?.createdAt
                            ? formatDate(selectedNotification.createdAt)
                            : 'N/A'
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  class="action-Btn"
                  @button-pressed="() => (isDeleteNotificationDrawerOpen = false)"
                />
                <ActionButton
                  button-color="error"
                  :buttonText="t('deleteNotification')"
                  class="action-Btn"
                  @button-pressed="
                    () => {
                      isConfirmDeletePopupVisible = true
                      isDeleteNotificationDrawerOpen = false
                    }
                  "
                />
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- delete Drawer -->
    </div>

    <ConfirmPopupDialog
      :isVisible="isConfirmDeletePopupVisible"
      :title="t('deleteConfirmNotification')"
      :message="t('deleteConfirmBannerDescription')"
      :icon="'mdi-trash-can-outline'"
      :iconColor="'error'"
      @cancel="closeDeletePopup"
      @apply="confirmDelete(selectedNotification as INotification)"
      :cancelText="t('cancel')"
      :applyText="t('deleteConfirmButton')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue3-i18n'
import ActionButton from '@/components/base/ActionButton.vue'
import BaseHeader from '@/components/base/BaseHeader.vue'
import Drawer from '@/components/base/Drawer.vue'
import ServerTable from '@/components/base/ServerTable.vue'
import { useNotificationsStore } from '@/stores/modules/notificationsStore'
import {
  toastDeleteMessage,
  toastErrorMessage,
  toastSuccessMessage,
} from '@/utils/helpers/notification'
import type { CreateNotificationDto, INotification } from '@/utils/services/notificationsService'
import { formatDate } from '@/utils/helpers/date-helper'
import ConfirmPopupDialog from '@/components/base/ConfirmPopupDialog.vue'
import DateTimePicker from '@/components/base/DateTimePicker.vue'
import { useUserStore } from '@/stores/modules/userStore'
import { IUser } from '@/models/user'

const { t } = useI18n()
const store = useNotificationsStore()

const page = ref(1)
const itemsPerPage = ref(8)
const isDialogOpen = ref(false)
const isDetailsNotificationDrawerOpen = ref(false)
const isDeleteNotificationDrawerOpen = ref(false)
const isConfirmDeletePopupVisible = ref(false)
const selectedNotification = ref<INotification | null>(null)
const items = computed(() => store.allNotifications)
const totalItems = computed(() => store.paginationInfo?.total ?? 0)
const loading = computed(() => store.isLoading)
const users = ref<IUser[]>([])

onMounted(async () => {
  users.value = await useUserStore().fetchUsers() // calls the function and stores the result
})
const newNotification = ref({
  title: '',
  message: '',
  type: 'info',
  startAt: '',
  expireDate: '',
  redirectTo: '',
  sendNotificationOnDate: '',
  status: 'active',
  sendNow: true, // Default to true for sending immediately
  isGlobal: true, // Default to true for not global
  targetUsers: [], // Default to empty array for target users
})

const resetForm = () => {
  newNotification.value = {
    title: '',
    message: '',
    type: 'info',
    startAt: '',
    expireDate: '',
    redirectTo: '',
    sendNotificationOnDate: '',
    status: 'active',
    sendNow: true, // Default to true for sending immediately
    isGlobal: true, // Default to true for not global
    targetUsers: [], // Default to empty array for target users
  }
}

const onAddButtonPressed = async () => {
  try {
    if (!newNotification.value.isGlobal && newNotification.value.targetUsers.length === 0) {
      toastErrorMessage('Please provide target users or set as global notification', 'You must select at least one user for the notification or select it as a global.')
      return
    }
    if (newNotification.value.isGlobal && newNotification.value.targetUsers.length !== 0) {
      newNotification.value.targetUsers = [];
      return
    }
    if (!newNotification.value.sendNow && !newNotification.value.sendNotificationOnDate) {
      toastErrorMessage('Please select a date', 'You must select a date to send the notification if you are not sending it now.');
      return
    }
    if (newNotification.value.sendNow) {
      newNotification.value.sendNotificationOnDate = new Date().toISOString() // Set to current date if sending now
      return
    }
    if (newNotification.value.sendNotificationOnDate) {
      newNotification.value.sendNow = false // Ensure sendNow is false if a date is selected
      const selectedDate = new Date(newNotification.value.sendNotificationOnDate)
      if (selectedDate < new Date()) {
        toastErrorMessage('Invalid date selected', 'Please select a future date for sending the notification.')
        return
      }
    }
    
    newNotification.value.sendNotificationOnDate = new Date(newNotification.value.sendNotificationOnDate).toISOString() // Ensure the date is in ISO format
    console.log('Creating notification with data:', newNotification.value)
    await store.createNotification(newNotification.value as CreateNotificationDto)
    toastSuccessMessage(
      t('notificationSentSuccesfully'),
      t('yourNotificationIsSavedToBeSendToYourCstomerOnDateSuccesfully', {
        date: !newNotification.value.sendNow
          ? newNotification.value.sendNotificationOnDate
          : formatDate(new Date()),
      }),
    )
    isDialogOpen.value = false
    resetForm()
  } catch (error) {
    console.error(error)
    toastErrorMessage(t('anErrorOccured'), t('notificationErrorTryAgain'))
  }
}
// const form = ref<CreateNotificationDto>({
//   title: '',
//   message: '',
//   type: 'info'
// });
// const form = ref<any>(null)
// const title = ref('')
// const message = ref('')
// const type = ref('')

// const notificationTypes = [
//   { title: t('info'), value: 'info' },
//   { title: t('success'), value: 'success' },
//   { title: t('warning'), value: 'warning' },
//   { title: t('error'), value: 'error' },
// ]

const headers = [
  { title: 'ID', key: '_id', sortable: false },
  { title: t('notificationTitle'), key: 'title', sortable: false },
  { title: t('notificationDesc'), key: 'message', sortable: false },
  { title: t('sentOn'), key: 'createdAt', sortable: false },
  { title: t('status'), key: 'type', sortable: false },
  { title: t('actions'), key: '', sortable: false },
]

function viewDetails(item: any) {
  selectedNotification.value = item as INotification
  isDetailsNotificationDrawerOpen.value = true
}

function deleteNotification(item: any) {
  selectedNotification.value = item as INotification
  isDeleteNotificationDrawerOpen.value = true
}

function statusColor(status: string): string {
  switch (status) {
    case 'sent':
      return '#10b981' // green
    case 'failed':
      return '#ef4444' // red
    default:
      return '#9ca3af' // fallback gray
  }
}

const fetchNotifications = async () => {
  await store.fetchNotifications({
    page: page.value.toString(),
    limit: itemsPerPage.value.toString(),
  })
  if (store.paginationInfo && store.paginationInfo.page !== page.value) {
    page.value = store.paginationInfo.page
  }
  const totalPages = Math.ceil((store.paginationInfo?.total ?? 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

const closeDeletePopup = () => (isConfirmDeletePopupVisible.value = false)

const getTypeColor = (type: string) => {
  return (
    {
      sent: 'green',
      failed: 'red',
    }[type] || 'grey'
  )
}

const confirmDelete = async (notification: INotification) => {
  if (!notification._id) {
    toastErrorMessage(
      'No notification selected for deletion',
      'Please select a notification to delete.',
    )
    return
  }
  try {
    // await store.deleteNotification(notification._id)
    isDeleteNotificationDrawerOpen.value = false
    isConfirmDeletePopupVisible.value = false
    toastDeleteMessage(t('notificationDeletedSuccessfully'), '')
  } catch (error) {
    console.error('Failed to delete notification:', error)
    toastErrorMessage(t('anErrorOccured'), t('notificationErrorTryAgain'))
  }
}

onMounted(() => {
  fetchNotifications()
})

watch([page, itemsPerPage], fetchNotifications)
</script>

<style lang="scss" scoped>
.notification-info {
  margin-top: 16px;
}

.notification-key {
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.084px;
  color: #5c5c5c;
  margin-bottom: 8px;
}

.menu-list {
  min-width: 140px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-item {
  font-size: 14px;
  padding: 6px 12px;
  min-height: unset !important;
}

.action-btns {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.v-text-field .v-input__details {
  padding-inline: 0 !important;
}
</style>
