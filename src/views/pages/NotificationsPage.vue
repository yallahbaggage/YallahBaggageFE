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
      <!-- Loading state for initial page load -->
      <div v-if="initialLoading" class="loading-state">
        <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        <p>{{ t('loading') }}</p>
      </div>
      
      <!-- Content when loaded -->
      <div v-else>
        <ServerTable
          :headers="headers"
          :items="items"
          :total-items="totalItems"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
        >
          <template #cell-_id="{ item }"> #{{ item?._id?.substring(0, 10) }} </template>
          <!-- <template #cell-sendNotificationOnDate="{ item }">
            {{ formatDate(item.sendNotificationOnDate) }}</template
          > -->
          <template #cell-type="{ item }">
            <v-chip
              :color="statusColor(getStatusAccordingToSendDate(item as INotification))"
              text-color="white"
              small
            >
              <span
                :style="{
                  backgroundColor: statusColor(getStatusAccordingToSendDate(item as INotification)),
                }"
                class="status-circle"
              ></span>
              {{ t(getStatusAccordingToSendDate(item as INotification)) }}
            </v-chip>
          </template>
          <!-- <template #cell-isRead="{ item }">
            <v-chip :color="item.isRead ? 'grey' : 'warning'" text-color="white" small>
              {{ item.isRead ? t('read') : t('unread') }}
            </v-chip>
          </template> -->
          <template #cell-title="{ item }">
            <span class="name-bold"> {{ item.title }}</span>
          </template>
          <template #cell-sendNotificationOnDate="{ item }">
            {{ item.sendNotificationOnDate && !item.sendNow ? formatDate(item.sendNotificationOnDate) : formatDate(item.createdAt) }}
          </template>
          <template #actions="{ item }">
            <v-menu location="bottom end" offset="4">
              <template #activator="{ props }">
                <v-btn icon v-bind="props" variant="text" density="comfortable">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list class="menu-list-style">
                <v-list class="menu-list">
                  <v-list-item class="menu-item" @click="viewDetails(item)">
                    <v-icon class="mr-2">mdi-eye-outline</v-icon>
                    {{ t('seeDetails') }}
                  </v-list-item>
                  <v-list-item class="menu-item" @click="editNotification(item)">
                    <v-icon class="mr-2">mdi-pencil-outline</v-icon>
                    {{ t('editNotification') }}
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
                      :min-date="getTodayForDatePicker()"
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
        <!-- Edit Drawer -->
        <Drawer
          :isOpen="isEditDialogOpen"
          :title="t('editNotification')"
          :desc="t('fillOutAllTheInformationsToUpdate')"
          @close="closeEditDrawer"
        >
          <div style="max-height: 75vh">
            <form @submit.prevent="handleUpdate()" class="form">
              <div>
                <div class="drawer-banner">
                  <p>{{ t('generalInformation') }}</p>
                </div>
                <div>
                  <div class="drawer-form-group">
                    <label for="edit-name" class="drawer-label-group">
                      {{ t('notificationTitle') }}<span class="required">*</span>
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      class="form-input no-focus-border"
                      :placeholder="t('notificationTitle')"
                      v-model="editingNotification.title"
                      required
                    />
                  </div>
                  <div class="drawer-form-group">
                    <label for="edit-message" class="drawer-label-group">
                      {{ t('notificationDesc') }}<span class="required">*</span>
                    </label>
                    <textarea
                      id="edit-message"
                      type="text"
                      class="form-input no-focus-border"
                      :placeholder="t('notificationDesc')"
                      v-model="editingNotification.message"
                      required
                      maxlength="200"
                    ></textarea>
                  </div>
                  <div class="drawer-banner">
                    <p>{{ t('advancedDetails') }}</p>
                  </div>

                  <div class="drawer-form-group">
                    <label for="edit-redirectTo" class="drawer-label-group">
                      {{ t('notificationWillRedirectTo') }}</label
                    >
                    <v-text-field
                      id="banner-redirectTo"
                      v-model="editingNotification.redirectTo"
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
                  <div class="drawer-form-group" v-if="!editingNotification.sendNow">
                    <label for="edit-sendOn" class="drawer-label-group">
                      {{ t('sendNotificationOn') }}</label
                    >
                    <DateTimePicker
                      v-model="editingNotification.sendNotificationOnDate"
                      :show-time="true"
                      :placeholder="t('sendNotificationOn')"
                      variant="outlined"
                      density="compact"
                      :min-date="getTodayForDatePicker()"
                      hide-details
                      class="no-focus-border"
                    />
                  </div>
                  <div class="drawer-form-group flex">
                    <v-switch
                      class="no-focus-border"
                      color="primary"
                      v-model="editingNotification.sendNow"
                      hide-details
                      :label="t('sendNotificationNow')"
                    ></v-switch>
                    <v-switch
                      class="no-focus-border"
                      color="primary"
                      v-model="editingNotification.isGlobal"
                      hide-details
                      :label="t('isGlobalNotification')"
                    ></v-switch>
                  </div>

                  <div
                    class="drawer-form-group"
                    v-if="!editingNotification.isGlobal && users?.length > 0"
                  >
                    <label for="edit-target" class="drawer-label-group">
                      {{ t('selectTargetCustomers') }}</label
                    >
                    <v-select
                      v-model="editingNotification.targetUsers"
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
                    @button-pressed="closeEditDrawer"
                    class="action-Btn"
                  />
                  <ActionButton :buttonText="t('update')" buttonType="submit" class="action-Btn" />
                </div>
              </div>
            </form>
          </div>
        </Drawer>
        <!-- Edit Drawer -->
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
import { formatDate, parseDateTimeString, getTodayForDatePicker } from '@/utils/helpers/date-helper'
import ConfirmPopupDialog from '@/components/base/ConfirmPopupDialog.vue'
import DateTimePicker from '@/components/base/DateTimePicker.vue'
import { useUserStore } from '@/stores/modules/userStore'
import { IUser } from '@/models/user'

const { t } = useI18n()
const store = useNotificationsStore()

const page = ref(1)
const itemsPerPage = ref(8)
const isDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const isDetailsNotificationDrawerOpen = ref(false)
const isDeleteNotificationDrawerOpen = ref(false)
const isConfirmDeletePopupVisible = ref(false)
const selectedNotification = ref<INotification | null>(null)
const editingNotification = ref<Partial<CreateNotificationDto & { _id: string }>>({})
const items = computed(() => store.allNotifications)
const totalItems = computed(() => store.paginationInfo?.total ?? 0)
const loading = computed(() => store.isLoading)
const users = ref<IUser[]>([])
const initialLoading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([
      useUserStore().fetchUsers().then(result => users.value = result),
      fetchNotifications()
    ])
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    initialLoading.value = false
  }
})
const newNotification = ref<{
  title: string
  message: string
  type: string
  startAt: string
  expireDate: string
  redirectTo: string
  sendNotificationOnDate?: string
  status: string
  sendNow: boolean
  isGlobal: boolean
  targetUsers: string[]
}>({
  title: '',
  message: '',
  type: 'info',
  startAt: '',
  expireDate: '',
  redirectTo: '',
  // sendNotificationOnDate is now optional
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
    // sendNotificationOnDate is optional, let user select it
    status: 'active',
    sendNow: true, // Default to true for sending immediately
    isGlobal: true, // Default to true for not global
    targetUsers: [], // Default to empty array for target users
  }
}

const onAddButtonPressed = async () => {
  try {
    // 1. Validate target users or global setting
    if (!newNotification.value.isGlobal && newNotification.value.targetUsers.length === 0) {
      toastErrorMessage(
        'Please provide target users or set as global notification',
        'You must select at least one user for the notification or select it as a global.',
      )
      return
    }

    if (newNotification.value.isGlobal && newNotification.value.targetUsers.length !== 0) {
      newNotification.value.targetUsers = [] // clear target users if global
    }

    // 2. Validate sendNow vs sendNotificationOnDate
    if (!newNotification.value.sendNow && !newNotification.value.sendNotificationOnDate) {
      toastErrorMessage(
        'Please select a date and time',
        'You must select a date and time to send the notification if you are not sending it now.',
      )
      return
    }

    if (newNotification.value.sendNow) {
      // Don't send sendNotificationOnDate if sending now
      delete newNotification.value.sendNotificationOnDate
    } else {
      const isoDate = parseDateTimeString(newNotification.value.sendNotificationOnDate as string)

      if (!isoDate) {
        toastErrorMessage('Invalid date', 'The selected date format must be DD/MM/YYYY HH:mm')
        return
      }

      const selectedDate = new Date(isoDate)
      const now = new Date()

      // Allow today and future dates only
      const selectedDateOnly = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      )
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      if (selectedDateOnly < todayOnly) {
        toastErrorMessage(
          'Invalid date',
          'Please select today or a future date for sending the notification.',
        )
        return
      }

      // If user selected today's date with a past time, adjust to current time
      const isToday = selectedDateOnly.getTime() === todayOnly.getTime()
      if (isToday && selectedDate < now) {
        // Update the time to current time
        const currentTime = now.toTimeString().slice(0, 5)
        const [day, month, year] = selectedDate.toLocaleDateString('en-GB').split('/')
        const updatedDateTime = `${day}/${month}/${year} ${currentTime}`
        const updatedIsoDate = parseDateTimeString(updatedDateTime)
        if (updatedIsoDate) {
          newNotification.value.sendNotificationOnDate = updatedDateTime
          toastSuccessMessage(
            'Time adjusted',
            'The time has been adjusted to the current time since the selected time has already passed.',
          )
        }
      } else {
        newNotification.value.sendNotificationOnDate = isoDate
      }
      newNotification.value.sendNow = false
    }

    // 3. Submit
    console.log('Creating notification with data:', newNotification.value)
    await store.createNotification(newNotification.value as CreateNotificationDto)

    toastSuccessMessage(
      t('notificationSentSuccesfully'),
      t('yourNotificationIsSavedToBeSendToYourCstomerOnDateSuccesfully', {
        time: newNotification.value.sendNow
          ? formatDate(new Date())
          : newNotification.value.sendNotificationOnDate,
      }),
    )

    resetForm()
    isDialogOpen.value = false
    fetchNotifications() // Refresh the notifications list after adding a new notification
  } catch (error) {
    console.error(error)
    toastErrorMessage(t('anErrorOccured'), t('notificationErrorTryAgain'))
  }
}

const getStatusAccordingToSendDate = (item: INotification) => {
  if (item.sendNow) {
    return 'sent' // If sendNow is true, consider it sent immediately
  }
  if (item.sendNotificationOnDate) {
    const sendDate = new Date(
      item.sendNotificationOnDate.toLocaleString('en-GB', { timeZone: 'UTC' }),
    )
    const now = new Date()
    if (item.sendNow) return 'sent' // If sendNow is true, consider it sent immediately
    if (item.createdAt && new Date(item.createdAt) > sendDate) return 'failed' // If created date is after send date, consider it failed
    if (sendDate < now && item.sendNotificationOnDate) return 'sent'
    if (sendDate > now && item.sendNotificationOnDate) return 'pending'
  }
  return 'failed'
}

const editNotification = (notification: any) => {
  editingNotification.value = {
    _id: notification._id,
    title: notification.title,
    message: notification.message,
    redirectTo: notification.redirectTo,
    sendNow: notification.sendNow,
    isGlobal: notification.isGlobal,
    targetUsers: notification.targetUsers.map((user: any) => user._id),
    sendNotificationOnDate: notification.sendNotificationOnDate || undefined,
  }
  isEditDialogOpen.value = true
}

const closeEditDrawer = () => {
  isEditDialogOpen.value = false
  editingNotification.value = {}
}

const handleUpdate = async () => {
  try {
    if (!editingNotification.value._id) {
      toastErrorMessage('Notification ID is missing.', 'Cannot update notification without an ID.')
      return
    }

    const updatePayload = { ...editingNotification.value }

    // Similar validation as onAddButtonPressed
    if (
      !updatePayload.isGlobal &&
      (!updatePayload.targetUsers || updatePayload.targetUsers.length === 0)
    ) {
      toastErrorMessage(
        'Please provide target users or set as global notification.',
        'You must select at least one user for the notification or select it as a global.',
      )
      return
    }
    if (updatePayload.isGlobal) {
      updatePayload.targetUsers = []
    }

    if (!updatePayload.sendNow) {
      if (!updatePayload.sendNotificationOnDate) {
        toastErrorMessage(
          'Please select a date',
          'You must select a date to send the notification if you are not sending it now.',
        )
        return
      }

      const dateValue = updatePayload.sendNotificationOnDate

      // If it's already an ISO string, use it directly
      if (typeof dateValue === 'string' && dateValue.includes('T')) {
        // It's already an ISO string, validate it
        const selectedDate = new Date(dateValue)
        const now = new Date()

        // Allow today and future dates only
        const selectedDateOnly = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        )
        const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        if (selectedDateOnly < todayOnly) {
          toastErrorMessage(
            'Invalid date',
            'Please select today or a future date for sending the notification.',
          )
          return
        }
        updatePayload.sendNotificationOnDate = dateValue
      } else {
        // It's in DD/MM/YYYY HH:mm format, parse it
        const dateString = dateValue instanceof Date ? dateValue.toISOString() : dateValue
        const isoDate = parseDateTimeString(dateString)
        if (!isoDate) {
          toastErrorMessage('Invalid date', 'The selected date format must be DD/MM/YYYY HH:mm')
          return
        }

        const selectedDate = new Date(isoDate)
        const now = new Date()

        // Allow today and future dates only
        const selectedDateOnly = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        )
        const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        if (selectedDateOnly < todayOnly) {
          toastErrorMessage(
            'Invalid date',
            'Please select today or a future date for sending the notification.',
          )
          return
        }

        // If user selected today's date with a past time, adjust to current time
        const isToday = selectedDateOnly.getTime() === todayOnly.getTime()
        if (isToday && selectedDate < now) {
          // Update the time to current time
          const currentTime = now.toTimeString().slice(0, 5)
          const [day, month, year] = selectedDate.toLocaleDateString('en-GB').split('/')
          const updatedDateTime = `${day}/${month}/${year} ${currentTime}`
          const updatedIsoDate = parseDateTimeString(updatedDateTime)
          if (updatedIsoDate) {
            updatePayload.sendNotificationOnDate = updatedDateTime
            toastSuccessMessage(
              'Time adjusted',
              'The time has been adjusted to the current time since the selected time has already passed.',
            )
          }
        } else {
          updatePayload.sendNotificationOnDate = isoDate
        }
      }
      updatePayload.sendNow = false
    } else {
      delete updatePayload.sendNotificationOnDate
    }

    await store.updateNotification(editingNotification.value._id!, updatePayload as any)
    toastSuccessMessage(t('notificationUpdated'), 'The notification has been updated successfully.')
    closeEditDrawer()
    fetchNotifications()
  } catch (error) {
    console.error(error)
    toastErrorMessage(t('anErrorOccured'), t('notificationErrorTryAgain'))
  }
}

const headers = [
  { title: 'ID', key: '_id', sortable: false },
  { title: t('notificationTitle'), key: 'title', sortable: false },
  { title: t('notificationDesc'), key: 'message', sortable: false },
  { title: t('sentOn'), key: 'sendNotificationOnDate', sortable: false },
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
    case 'pending':
      return '#f59e0b' // yellow
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
    }[type] ?? 'grey'
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
    await store.deleteNotification(notification._id)
    isDeleteNotificationDrawerOpen.value = false
    isConfirmDeletePopupVisible.value = false
    toastDeleteMessage(t('notificationDeletedSuccessfully'), '')
  } catch (error) {
    console.error('Failed to delete notification:', error)
    toastErrorMessage(t('anErrorOccured'), t('notificationErrorTryAgain'))
  }
}

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


.action-btns {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.v-text-field .v-input__details {
  padding-inline: 0 !important;
}
</style>
