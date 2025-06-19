<template>
  <div class="notifications-page">
    <BaseHeader
      :pageIcon="'mdi-bell-outline'"
      :title="t('notifications')"
      :desc="t('manageYourAppsNotifications')"
      :show-button="true"
      :button-text="t('newNotification')"
      v-on:button-pressed="showCreateDialog"
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
        <template #cell-type="{ item }">
          <v-chip
            :color="getTypeColor(item?.createdAt ? 'sent' : 'failed')"
            text-color="white"
            small
          >
            {{ item?.createdAt ? t('sent') : t('failed') }}
          </v-chip>
        </template>
        <template #cell-isRead="{ item }">
          <v-chip :color="item.isRead ? 'grey' : 'warning'" text-color="white" small>
            {{ item.isRead ? t('read') : t('unread') }}
          </v-chip>
        </template>
        <template #cell-createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
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

      <!-- Create/Edit Dialog -->
      <Drawer
        :isOpen="isDialogOpen"
        :desc="isEditing ? t('seeDetails') : t('deleteNotification')"
        @close="closeDialog"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="handleSubmit" class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('notificationDetails') }}</p>
              </div>
              <div>
                <div class="notification-info">
                  <p class="notification-key">{{ t('title') }}</p>
                  <v-text-field
                    v-model="title"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
                <div class="notification-info">
                  <p class="notification-key">{{ t('message') }}</p>
                  <v-text-field
                    v-model="message"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    rows="3"
                  />
                </div>
                <div class="notification-info">
                  <p class="notification-key">{{ t('type') }}</p>
                  <v-select
                    v-model="type"
                    :items="notificationTypes"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
              </div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  @button-pressed="closeDialog"
                />
                <ActionButton
                  :buttonText="isEditing ? t('update') : t('create')"
                  buttonType="submit"
                />
              </div>
            </div>
          </form>
        </div>
      </Drawer>
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
import { toastDeleteMessage, toastErrorMessage, toastSuccessMessage } from '@/utils/helpers/notification'
import type { CreateNotificationDto, INotification } from '@/utils/services/notificationsService'
import { formatDate } from '@/utils/helpers/date-helper'
import ConfirmPopupDialog from '@/components/base/ConfirmPopupDialog.vue'

const { t } = useI18n()
const store = useNotificationsStore()

const page = ref(1)
const itemsPerPage = ref(8)
const isDialogOpen = ref(false)
const isEditing = ref(false)
const isDetailsNotificationDrawerOpen = ref(false)
const isDeleteNotificationDrawerOpen = ref(false)
const isConfirmDeletePopupVisible = ref(false)
const currentId = ref<string | null>(null)
const selectedNotification = ref<INotification | null>(null)
const items = computed(() => store.allNotifications)
const totalItems = computed(() => store.paginationInfo?.total ?? 0)
const loading = computed(() => store.isLoading)
const rules = {
  required: (v: string) => !!v || 'Field is required',
  min: (v: string) => v.length >= 6 || 'Min 6 characters',
}
// const form = ref<CreateNotificationDto>({
//   title: '',
//   message: '',
//   type: 'info'
// });
const form = ref<any>(null)
const title = ref('')
const message = ref('')
const type = ref('')

const notificationTypes = [
  { title: t('info'), value: 'info' },
  { title: t('success'), value: 'success' },
  { title: t('warning'), value: 'warning' },
  { title: t('error'), value: 'error' },
]

const headers = [
  { title: 'ID', key: '_id' },
  { title: t('notificationTitle'), key: 'title' },
  { title: t('notificationDesc'), key: 'message' },
  { title: t('sentOn'), key: 'createdAt' },
  { title: t('status'), key: 'type' },
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

const showCreateDialog = () => {
  isEditing.value = false
  currentId.value = null
  form.value = {
    title: '',
    message: '',
    type: 'info',
  }
  isDialogOpen.value = true
}

const showEditDialog = (notification: INotification) => {
  isEditing.value = true
  currentId.value = notification._id
  form.value = {
    title: notification.title,
    message: notification.message,
    type: notification.type,
  }
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  form.value = {
    title: '',
    message: '',
    type: 'info',
  }
}

const handleSubmit = async () => {
  try {
    if (isEditing.value && currentId.value) {
      await store.updateNotification(currentId.value, form.value)
      toastSuccessMessage(t('notificationUpdated'), t('notificationUpdatedSuccess'))
    } else {
      await store.createNotification(form.value)
      toastSuccessMessage(t('notificationCreated'), t('notificationCreatedSuccess'))
    }
    closeDialog()
  } catch (error) {
    console.error('Operation failed:', error)
  }
}

const confirmDelete = async (notification: INotification) => {
  if (!notification._id) {
    toastErrorMessage('No notification selected for deletion','Please select a notification to delete.')
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

const markAsRead = async (id: string) => {
  try {
    await store.markAsRead(id)
    toastSuccessMessage(t('notificationMarkedAsRead'), t('notificationMarkedAsReadSuccess'))
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
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
</style>
