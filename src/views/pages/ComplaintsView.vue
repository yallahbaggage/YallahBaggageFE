<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-headphones'"
      :title="t('customerSupport')"
      :desc="t('manageYourCustomerSupportRequests')"
    />
    <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('totalIssues')">
          {{ stats.totalComplaints }}
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('openIssues')">
          {{ stats.openComplaints }}
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('solvedIssues')">
          {{ stats.solvedComplaints }}
        </InfoCard>
      </div>
      <hr class="infoHr" />
      <ServerSideTable
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="items"
        :total-items="totalItems"
        :loading="loading"
      >
        <template #cell-status="{ item }">
          <v-chip :color="statusColor(item.status)" text-color="white" small>
            <span class="status-circle"> </span>
            {{ t(item.status ?? 'pending') }}
          </v-chip>
        </template>
        <template #cell-_id="{ item }">
          {{ item._id.substring(0, 12) }}
        </template>
        <!-- <template #cell-priority="{ item }">
          <v-chip
            :color="
              item.priority === 'urgent'
                ? 'red'
                : item.priority === 'high'
                  ? 'orange'
                  : item.priority === 'medium'
                    ? 'blue'
                    : 'grey'
            "
            text-color="white"
            small
          >
            {{ item.priority }}
          </v-chip>
        </template> -->
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
              <v-list-item class="menu-item" @click="viewDetails(item)">
                <v-icon class="mr-2">mdi-eye-outline</v-icon>
                {{ t('seeDetails') }}
              </v-list-item>
              <v-list-item class="menu-item" @click="deleteComplaint(item)">
                <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                {{ t('deleteIssue') }}
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </ServerSideTable>
    </div>
    <!-- delete Drawer -->
    <Drawer
      :isOpen="isDeleteComplaintDrawerOpen"
      :title="t('complaint') + ' ' + '#' + selectedComplaint?._id.substring(0, 12)"
      :desc="
        t('employee') +
        ' ' +
        '#' +
        (selectedComplaint?.relatedWorkerId?._id
          ? selectedComplaint.relatedWorkerId._id.substring(0, 12)
          : 'N/A')
      "
      :status="selectedComplaint?.status ? t(selectedComplaint?.status) : t('Available')"
      @close="isDeleteComplaintDrawerOpen = false"
    >
      <div style="max-height: 75vh">
        <form class="form">
          <div>
            <p class="drawer-title">{{ selectedComplaint?.title }}</p>
            <p class="drawer-description">{{ selectedComplaint?.description }}</p>
            <div class="drawer-banner">
              <p>{{ t('information') }}</p>
            </div>
            <div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reportedBy') }}</p>
                <p class="drawer-value">{{ selectedComplaint?.userId?.name ?? 'N/A' }}</p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reporterId') }}</p>
                <p class="drawer-value">
                  {{ selectedComplaint?.userId?._id?.substring(0, 12) ?? 'N/A' }}
                </p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reporterPhoneNumber') }}</p>
                <p class="drawer-value">{{ selectedComplaint?.userId?.phone ?? 'N/A' }}</p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reportedOn') }}</p>
                <p class="drawer-value">
                  {{
                    selectedComplaint?.createdAt
                      ? new Date(selectedComplaint.createdAt).toLocaleString()
                      : 'N/A'
                  }}
                </p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('status') }}</p>
                <p class="drawer-value">{{ t(selectedComplaint?.status ?? 'pending') }}</p>
              </div>
            </div>
            <div class="action-btns">
              <ActionButton
                :buttonText="t('cancel')"
                buttonColor="white"
                class="action-Btn"
                @button-pressed="() => (isDeleteComplaintDrawerOpen = false)"
              />
              <ActionButton
                button-color="error"
                :buttonText="t('deleteIssue')"
                class="action-Btn"
                @button-pressed="
                  () => {
                    isConfirmDeletePopupVisible = true
                    isDeleteComplaintDrawerOpen = false
                  }
                "
              />
            </div>
          </div>
        </form>
      </div>
    </Drawer>
    <!-- delete Drawer -->

    <!-- Details Drawer -->
    <Drawer
      :isOpen="isDetailsComplaintDrawerOpen"
      :title="t('complaint') + ' ' + '#' + selectedComplaint?._id.substring(0, 12)"
      :desc="
        t('employee') +
        ' ' +
        '#' +
        (selectedComplaint?.relatedWorkerId?._id
          ? selectedComplaint.relatedWorkerId._id.substring(0, 12)
          : 'N/A')
      "
      :status="selectedComplaint?.status ? t(selectedComplaint?.status) : t('Available')"
      @close="isDetailsComplaintDrawerOpen = false"
    >
      <div style="max-height: 75vh">
        <form class="drawer-form">
          <div>
            <p class="drawer-title">{{ selectedComplaint?.title }}</p>
            <p class="drawer-description">{{ selectedComplaint?.description }}</p>
            <div class="drawer-banner">
              <p>{{ t('information') }}</p>
            </div>
            <v-card>
              <v-tabs v-model="tab" align-tabs="start" color="deep-purple-accent-4">
                <v-tab value="details">{{ t('details') }}</v-tab>
                <v-tab value="chat">{{ t('chat') }}</v-tab>
              </v-tabs>

              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="details">
                  <div>
                    <div class="drawer-info">
                      <p class="drawer-key">{{ t('reportedBy') }}</p>
                      <p class="drawer-value">{{ selectedComplaint?.userId?.name ?? 'N/A' }}</p>
                    </div>
                    <div class="drawer-info">
                      <p class="drawer-key">{{ t('reporterId') }}</p>
                      <p class="drawer-value">
                        {{ selectedComplaint?.userId?._id?.substring(0, 12) ?? 'N/A' }}
                      </p>
                    </div>
                    <div class="drawer-info">
                      <p class="drawer-key">{{ t('reporterPhoneNumber') }}</p>
                      <p class="drawer-value">{{ selectedComplaint?.userId?.phone ?? 'N/A' }}</p>
                    </div>
                    <div class="drawer-info">
                      <p class="drawer-key">{{ t('reportedOn') }}</p>
                      <p class="drawer-value">
                        {{
                          selectedComplaint?.createdAt
                            ? new Date(selectedComplaint.createdAt).toLocaleString()
                            : 'N/A'
                        }}
                      </p>
                    </div>
                    <div class="drawer-info">
                      <p class="drawer-key">{{ t('status') }}</p>
                      <v-select
                        v-model="editableStatus"
                        :items="statusOptions"
                        item-title="label"
                        class="drawer-value status-select"
                        hide-details
                        dense
                        variant="outlined"
                      >
                        <template #item="{ item, props }">
                          <v-list-item v-bind="props">
                            <v-list-item-title
                              :style="{
                                backgroundColor: statusColor(item?.raw.label),
                                color: 'white',
                                borderRadius: '8px',
                                padding: '4px 12px',
                                margin: '2px 0',
                              }"
                            >
                              {{ item?.raw.label ?? '' }}
                            </v-list-item-title>
                          </v-list-item>
                        </template>

                        <template #selection="{ item }">
                          <div
                            :style="{
                              backgroundColor: statusColor(item.raw.label),
                              color: 'white',
                              borderRadius: '8px',
                              padding: '4px 10px',
                              textAlign: 'center',
                            }"
                          >
                            {{ t(item.raw.label) }}
                          </div>
                        </template>
                      </v-select>
                    </div>
                  </div>
                  <div class="drawer-banner">
                    <p>{{ t('ticketActivity') }}</p>
                  </div>
                  <div class="status-stepper">
                    <v-timeline>
                      <v-timeline-item
                        v-if="selectedComplaint?.createdAt"
                        dot-color="white"
                        icon="mdi-ticket-confirmation-outline"
                      >
                        <div class="timeline-item-content">
                          <p>{{ t('ticketCreatedAt') }}</p>
                          <span>{{ formatDate(selectedComplaint?.createdAt) }}</span>
                        </div>
                      </v-timeline-item>

                      <v-timeline-item
                        v-slot:opposite
                        dot-color="white"
                        icon="mdi-rotate-3d-variant"
                        icon-color="orange"
                        v-if="selectedComplaint?.updatedAt"
                      >
                        <div class="timeline-item-content">
                          <p>{{ t('statusHasChanged') }}</p>
                          <span>{{ formatDate(selectedComplaint?.updatedAt) }}</span>
                        </div>
                        <p class="status-desc">
                          {{
                            t('statusHasChangedTo', {
                              status: t(selectedComplaint?.status ?? 'pending'),
                            })
                          }}
                        </p>
                      </v-timeline-item>

                      <v-timeline-item
                        v-if="selectedComplaint?.closedAt"
                        dot-color="white"
                        icon="mdi-check"
                        icon-color="success"
                      >
                        <div class="timeline-item-content">
                          <p>{{ t('statusHasChanged') }}</p>
                          <span>{{ formatDate(selectedComplaint?.closedAt) }}</span>
                        </div>
                        <p class="status-desc">
                          {{
                            t('statusHasChangedTo', {
                              status: t(selectedComplaint?.status ?? 'completed'),
                            })
                          }}
                        </p>
                      </v-timeline-item>
                    </v-timeline>
                  </div>
                  <div class="action-btns">
                    <ActionButton
                      :buttonText="t('cancel')"
                      buttonColor="white"
                      @button-pressed="() => (isDetailsComplaintDrawerOpen = false)"
                      class="action-Btn"
                    />
                    <ActionButton
                      class="action-Btn"
                      :buttonText="t('saveStatus')"
                      buttonType="submit"
                    />
                  </div>
                </v-tabs-window-item>

                <v-tabs-window-item value="chat"> </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </div>
        </form>
      </div>
    </Drawer>
    <!-- Details Drawer -->
    <ConfirmPopupDialog
      :isVisible="isConfirmDeletePopupVisible"
      :title="t('deleteConfirmBanner')"
      :message="t('deleteConfirmBannerDescription')"
      :icon="'mdi-trash-can-outline'"
      :iconColor="'error'"
      @cancel="closeDeletePopup"
      @apply="onDeleteButtonPressed(selectedComplaint!._id)"
      :cancelText="t('cancel')"
      :applyText="t('deleteConfirmButton')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import ServerSideTable from '@/components/base/ServerTable.vue'
import { useComplaintsStore } from '@/stores/modules/complaints'
import { useI18n } from 'vue3-i18n'
import { IComplaint } from '@/models/complaint'
import Drawer from '@/components/base/Drawer.vue'
import ActionButton from '@/components/base/ActionButton.vue'
import { toastDeleteMessage } from '@/utils/helpers/notification'
import ConfirmPopupDialog from '@/components/base/ConfirmPopupDialog.vue'
import { formatDate } from '@/utils/helpers/date-helper'

const { t } = useI18n()
const complaintsStore = useComplaintsStore()
const tab = ref(null)

const page = ref(1)
const itemsPerPage = ref(8)
const selectedComplaint = ref<IComplaint | null>(null)
const isDeleteComplaintDrawerOpen = ref(false)
const isDetailsComplaintDrawerOpen = ref(false)
const isConfirmDeletePopupVisible = ref(false)

const closeDeletePopup = () => (isConfirmDeletePopupVisible.value = false)

const onDetailsButtonPressed = () => {
  if (selectedComplaint.value) {
    isDetailsComplaintDrawerOpen.value = true
  }
}



const headers = ref([
  { title: 'ID', key: '_id' },
  { title: 'Title', key: 'title' },
  { title: 'Category', key: 'category' },
  // { title: 'Priority', key: 'priority' },
  { title: 'Status', key: 'status' },
  { title: 'Created At', key: 'createdAt' },
  { title: t('actions'), key: '', sortable: false },
])

const items = computed(() => complaintsStore.allComplaints)
const totalItems = computed(() => complaintsStore.paginationInfo?.total ?? 0)
const loading = computed(() => complaintsStore.isLoading)

const stats = computed(
  () => complaintsStore.stats ?? { totalComplaints: 0, openComplaints: 0, solvedComplaints: 0 },
)

const fetchComplaints = async () => {
  await complaintsStore.fetchComplaints({
    page: String(page.value),
    limit: String(itemsPerPage.value),
  })
  if (complaintsStore.paginationInfo && complaintsStore.paginationInfo.page !== page.value) {
    page.value = Number(complaintsStore.paginationInfo.page)
  }
  const totalPages = Math.ceil((complaintsStore.paginationInfo?.total ?? 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

function viewDetails(item: any) {
  selectedComplaint.value = item as IComplaint
  isDetailsComplaintDrawerOpen.value = true
}

function deleteComplaint(item: any) {
  selectedComplaint.value = item as IComplaint
  isDeleteComplaintDrawerOpen.value = true
}

const onDeleteButtonPressed = async (selectedComplaintId: string) => {
  if (!selectedComplaintId) {
    console.error('No complaint selected for deletion')
    return
  }
  await complaintsStore.deleteComplaint(selectedComplaintId)
  toastDeleteMessage(t('toastDeleteComplaintTitle'), t('toastDeleteComplaintDescription'))
  isDeleteComplaintDrawerOpen.value = false
  isConfirmDeletePopupVisible.value = false
}

const fetchStats = async () => {
  await complaintsStore.getComplaintsStatsPage()
}

onMounted(() => {
  fetchComplaints()
  fetchStats()
})

watch([page, itemsPerPage], fetchComplaints)

// function statusColor(status: string) {
//   return (
//     {
//       pending: 'orange',
//       in_progress: 'blue',
//       resolved: 'green',
//       rejected: 'red',
//       closed: 'grey',
//     }[status?.toLowerCase()] ?? 'primary'
//   )
// }

function statusColor(status: string): string {
  switch (status) {
    case 'pending':
      return '#f59e0b' // amber
    case 'in_progress':
      return '#3b82f6' // blue
    case 'resolved':
      return '#10b981' // green
    case 'rejected':
      return '#ef4444' // red
    case 'closed':
      return '#6b7280' // gray
    default:
      return '#9ca3af' // fallback gray
  }
}

const statusOptions = [
  { label: 'pending' },
  { label: 'in_progress' },
  { label: 'resolved' },
  { label: 'rejected' },
  { label: 'closed' },
]
const editableStatus = ref(selectedComplaint.value?.status ?? 'pending')
watch(
  () => selectedComplaint.value?.status,
  (newStatus) => {
    editableStatus.value = newStatus ?? 'pending'
  },
)
</script>
<style scoped lang="scss">
.status-select {
  min-width: 120px;
  max-width: 180px;
  margin-left: 8px;
}
.status-select-menu {
  border-radius: 8px;
  overflow: hidden;
}
</style>
