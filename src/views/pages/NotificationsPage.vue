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
          <v-chip :color="getTypeColor(item.type)" text-color="white" small>
            {{ item.type }}
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
              <v-list-item 
                v-if="!item.isRead" 
                class="menu-item" 
                @click="markAsRead(item._id)"
              >
                <v-icon class="mr-2">mdi-check</v-icon>
                {{ t('markAsRead') }}
              </v-list-item>
              <v-list-item class="menu-item" @click="showEditDialog(item as INotification)">
                <v-icon class="mr-2">mdi-pencil</v-icon>
                {{ t('edit') }}
              </v-list-item>
              <v-list-item class="menu-item" @click="confirmDelete(item as INotification)">
                <v-icon class="mr-2">mdi-delete</v-icon>
                {{ t('delete') }}
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </ServerTable>

      <!-- Create/Edit Dialog -->
      <!-- <Drawer
        :isOpen="isDialogOpen"
        :desc="isEditing ? t('editNotification') : t('newNotification')"
        :status="t('active')"
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
                    v-model="form.title"
                    :rules="[v => !!v || t('titleRequired')]"
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
                <div class="notification-info">
                  <p class="notification-key">{{ t('message') }}</p>
                  <v-textarea
                    v-model="form.message"
                    :rules="[v => !!v || t('messageRequired')]"
                    variant="outlined"
                    density="comfortable"
                    rows="3"
                  />
                </div>
                <div class="notification-info">
                  <p class="notification-key">{{ t('type') }}</p>
                  <v-select
                    v-model="form.type"
                    :items="notificationTypes"
                    :rules="[v => !!v || t('typeRequired')]"
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
      </Drawer> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue3-i18n';
import ActionButton from '@/components/base/ActionButton.vue';
import BaseHeader from '@/components/base/BaseHeader.vue';
import Drawer from '@/components/base/Drawer.vue';
import ServerTable from '@/components/base/ServerTable.vue';
import { useNotificationsStore } from '@/stores/modules/notificationsStore';
import { toastDeleteMessage, toastSuccessMessage } from '@/utils/helpers/notification';
import type { CreateNotificationDto, INotification } from '@/utils/services/notificationsService';

const { t } = useI18n();
const store = useNotificationsStore();

const page = ref(1);
const itemsPerPage = ref(8);
const isDialogOpen = ref(false);
const isEditing = ref(false);
const currentId = ref<string | null>(null);

const items = computed(() => store.allNotifications);
const totalItems = computed(() => store.paginationInfo?.total || 0);
const loading = computed(() => store.isLoading);

const form = ref<CreateNotificationDto>({
  title: '',
  message: '',
  type: 'info'
});

const notificationTypes = [
  { title: t('info'), value: 'info' },
  { title: t('success'), value: 'success' },
  { title: t('warning'), value: 'warning' },
  { title: t('error'), value: 'error' }
];

const headers = [
  { title: 'ID', key: '_id' },
  { title: t('notificationTitle'), key: 'title' },
  { title: t('notificationDesc'), key: 'message' },
  { title: t('sentOn'), key: 'createdAt' },
  { title: t('status'), key: 'type' },
  { title: t('actions'), key: '', sortable: false },
];

const fetchNotifications = async () => {
  await store.fetchNotifications({
    page: page.value.toString(),
    limit: itemsPerPage.value.toString()
  });
  if (store.paginationInfo && store.paginationInfo.page !== page.value) {
    page.value = store.paginationInfo.page;
  }
  const totalPages = Math.ceil((store.paginationInfo?.total || 0) / itemsPerPage.value);
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages;
  }
};

const getTypeColor = (type: string) => {
  return {
    info: 'blue',
    success: 'green',
    warning: 'orange',
    error: 'red'
  }[type] || 'grey';
};

const showCreateDialog = () => {
  isEditing.value = false;
  currentId.value = null;
  form.value = {
    title: '',
    message: '',
    type: 'info'
  };
  isDialogOpen.value = true;
};

const showEditDialog = (notification: INotification) => {
  isEditing.value = true;
  currentId.value = notification._id;
  form.value = {
    title: notification.title,
    message: notification.message,
    type: notification.type
  };
  isDialogOpen.value = true;
};

const closeDialog = () => {
  isDialogOpen.value = false;
  form.value = {
    title: '',
    message: '',
    type: 'info'
  };
};

const handleSubmit = async () => {
  try {
    if (isEditing.value && currentId.value) {
      await store.updateNotification(currentId.value, form.value);
      toastSuccessMessage(t('notificationUpdated'), t('notificationUpdatedSuccess'));
    } else {
      await store.createNotification(form.value);
      toastSuccessMessage(t('notificationCreated'), t('notificationCreatedSuccess'));
    }
    closeDialog();
  } catch (error) {
    console.error('Operation failed:', error);
  }
};

const confirmDelete = (notification: INotification) => {
  toastDeleteMessage(t('deleteNotification'), t('deleteNotificationConfirm'));
  store.deleteNotification(notification._id);
};

const markAsRead = async (id: string) => {
  try {
    await store.markAsRead(id);
    toastSuccessMessage(t('notificationMarkedAsRead'), t('notificationMarkedAsReadSuccess'));
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

onMounted(() => {
  fetchNotifications();
});

watch([page, itemsPerPage], fetchNotifications);
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
