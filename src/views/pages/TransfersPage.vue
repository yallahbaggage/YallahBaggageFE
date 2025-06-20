<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-swap-horizontal'"
      :title="t('transfers')"
      :desc="t('manageAndTrackYourTransfers')"
    />
    <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('todaysTransfers')">
          <div class="stats-container">
            {{ stats.todaysTransfers }}
            <p class="present-change">
              <span class="present">+{{ stats.todaysTransfersChange }}</span> {{ t('vsYesterday') }}
            </p>
          </div>
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('currentTransfers')">
          <div class="stats-container">
            {{ stats.currentTransfers }}
            <p class="present-change">
              <span class="present">+{{ stats.currentTransfersChange }}</span>
              {{ t('vsYesterday') }}
            </p>
          </div></InfoCard
        >
        <InfoCard class="infoCard" :cardTitle="t('cancelledTransfers')">
          <div class="stats-container">
            {{ stats.cancelledTransfers }}
            <p class="present-change">
              <span class="present">+{{ stats.cancelledTransfersChange }}</span>
              {{ t('vsYesterday') }}
            </p>
          </div></InfoCard
        >
      </div>
      <hr class="infoHr" />
      <ServerTable
        :headers="headers"
        :items="ads"
        :total-items="pagination.total"
        :loading="loading"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
      >
        <template #cell-_id="{ item }">
          {{ item._id.substring(0, 12) }}
        </template>

        <template #cell-customer="{ item }">
          <span>{{ item.userId.name }}</span>
        </template>
        <template #cell-status="{ item }">
          <v-chip :color="statusColor(item.status)" text-color="white" medium>
            <span
              :style="{ backgroundColor: statusColor(item.status) }"
              class="status-circle"
            ></span>
            {{ t(item.status) ?? t('Available') }}
          </v-chip>
        </template>
        <template #cell-pickUpDate="{ item }">
          <span>{{ new Date(item.pickUpDate).toLocaleDateString() }}</span>
        </template>
        <template #cell-deliveryDate="{ item }">
          <span>{{ new Date(item.deliveryDate).toLocaleDateString() }}</span>
        </template>
        <template #cell-actions="{ item }">
          <v-menu location="bottom end" offset="4">
            <template #activator="{ props }">
              <v-btn icon v-bind="props" variant="text" density="comfortable">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="menu-list pa-0 ma-0">
              <v-list-item class="menu-item" @click="viewDetails(item as Transfer)">
                <v-icon class="mr-2">mdi-eye-outline</v-icon>
                {{ t('seeDetails') }}
              </v-list-item>
              <v-list-item class="menu-item" @click="assignEmployee(item as Transfer)">
                <v-icon class="mr-2">mdi-account-outline</v-icon>
                {{ t('assignChangeStaff') }}
              </v-list-item>
              <v-list-item class="menu-item" @click="changeStatus(item)">
                <v-icon class="mr-2">mdi-lightning-bolt-outline</v-icon>
                {{ t('changeStatus') }}
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </ServerTable>

      <!-- delete Drawer -->
      <Drawer
        :isOpen="isAssignEmployeeDrawerOpen"
        :title="t('complaint') + ' ' + '#' + selectedTransfer?._id.substring(0, 12)"
        :desc="t('employee')"
        :status="selectedTransfer?.status ? t(selectedTransfer?.status) : t('Available')"
        @close="isAssignEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form class="form">
            <div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  class="action-Btn"
                  @button-pressed="() => (isAssignEmployeeDrawerOpen = false)"
                />
                <ActionButton
                  button-color="error"
                  :buttonText="t('deleteIssue')"
                  class="action-Btn"
                  @button-pressed="
                    () => {
                      isAssignEmployeeDrawerOpen = false
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
        :isOpen="isDetailsTransfersDrawerOpen"
        :title="t('complaint') + ' ' + '#' + selectedTransfer?._id.substring(0, 12)"
        :desc="t('employee')"
        :status="selectedTransfer?.status ? t(selectedTransfer?.status) : t('Available')"
        @close="isDetailsTransfersDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form class="drawer-form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('information') }}</p>
              </div>
              <v-card>
                <v-tabs v-model="tab" align-tabs="start" color="deep-purple-accent-4">
                  <v-tab value="details">{{ t('details') }}</v-tab>
                  <v-tab value="timeLine">{{ t('timeLine') }}</v-tab>
                </v-tabs>

                <v-tabs-window v-model="tab">
                  <v-tabs-window-item value="details"> </v-tabs-window-item>

                  <v-tabs-window-item value="timeLine">
                    <div class="status-stepper">
                      <v-timeline>
                        <v-timeline-item
                          v-if="selectedTransfer?.createdAt"
                          dot-color="white"
                          icon="mdi-ticket-confirmation-outline"
                        >
                          <div class="timeline-item-content">
                            <p>{{ t('ticketCreatedAt') }}</p>
                            <span>{{ formatDate(selectedTransfer?.createdAt) }}</span>
                          </div>
                        </v-timeline-item>

                        <v-timeline-item
                          v-slot:opposite
                          dot-color="white"
                          icon="mdi-rotate-3d-variant"
                          icon-color="orange"
                          v-if="selectedTransfer?.updatedAt"
                        >
                          <div class="timeline-item-content">
                            <p>{{ t('statusHasChanged') }}</p>
                            <span>{{ formatDate(selectedTransfer?.updatedAt) }}</span>
                          </div>
                          <p class="status-desc">
                            {{
                              t('statusHasChangedTo', {
                                status: t(selectedTransfer?.status ?? 'pending'),
                              })
                            }}
                          </p>
                        </v-timeline-item>

                        <v-timeline-item
                          v-if="selectedTransfer?.completedAt"
                          dot-color="white"
                          icon="mdi-check"
                          icon-color="success"
                        >
                          <div class="timeline-item-content">
                            <p>{{ t('statusHasChanged') }}</p>
                            <span>{{ formatDate(selectedTransfer?.completedAt) }}</span>
                          </div>
                          <p class="status-desc">
                            {{
                              t('statusHasChangedTo', {
                                status: t(selectedTransfer?.status ?? 'completed'),
                              })
                            }}
                          </p>
                        </v-timeline-item>
                      </v-timeline>
                    </div>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- Details Drawer -->
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseHeader from '@/components/base/BaseHeader.vue'
import InfoCard from '@/components/base/InfoCard.vue'
import { useI18n } from 'vue3-i18n'
import { useTransfersStore } from '@/stores/modules/transfer'
import { ref, onMounted, computed, watch } from 'vue'
import { Transfer } from '@/models/transfer'
import ServerTable from '@/components/base/ServerTable.vue'
import { formatDate } from '@/utils/helpers/date-helper'

const { t } = useI18n()

const tranfersStore = useTransfersStore()
const loading = computed(() => tranfersStore.isLoading)
const isDetailsTransfersDrawerOpen = ref(false)
const statusOptions = [
  { label: 'pending' },
  { label: 'in_progress' },
  { label: 'resolved' },
  { label: 'rejected' },
  { label: 'closed' },
]
const selectedTransfer = ref<Transfer | null>(null)
const tab = ref(null)
const isAssignEmployeeDrawerOpen = ref(false)
const editableStatus = ref(selectedTransfer.value?.status ?? 'pending')
const ads = computed(() => tranfersStore.allTransfers || [])
const pagination = computed(
  () => tranfersStore.paginationInfo || { total: 0, page: 1, limit: 8, pageCount: 1 },
)

const stats = computed(
  () =>
    tranfersStore.stats || {
      todaysTransfers: 0,
      todaysTransfersChange: 0,
      currentTransfers: 0,
      currentTransfersChange: 0,
      cancelledTransfers: 0,
      cancelledTransfersChange: 0,
    },
)
const page = ref(1)
const itemsPerPage = ref(8)

const headers = [
  { title: 'ID', key: '_id' },
  { title: t('transferDate'), key: 'createdAt' },
  { title: t('customer'), key: 'customer' },
  { title: t('pickUpDate'), key: 'pickUpDate' },
  { title: t('deliveryDate'), key: 'deliveryDate' },
  { title: t('status'), key: 'status' },
  { title: t('assignChangeStaff'), key: 'assignChangeStaff' },
  { title: t('assigne'), key: 're' },
  { title: t('actions'), key: 'actions', sortable: false },
]

function statusColor(status: string): string {
  switch (status) {
    case 'pending':
      return '#f59e0b' // amber
    case 'in_progress':
      return '#3b82f6' // blue
    case 'resolved':
    case 'completed':
      return '#10b981' // green
    case 'rejected':
      return '#ef4444' // red
    case 'closed':
      return '#6b7280' // gray
    default:
      return '#9ca3af' // fallback gray
  }
}

function viewDetails(item: Transfer) {
  selectedTransfer.value = item as Transfer
  isDetailsTransfersDrawerOpen.value = true
}

function changeStatus(item: any) {
  selectedTransfer.value = item as Transfer
  // isDeleteEmployeeDrawerOpen.value = true
}

const fetchAllTranfers = async () => {
  const response = await tranfersStore.getTransfers({ page: page.value, limit: itemsPerPage.value })
  if (response.pagination && response.pagination.page !== page.value) {
    page.value = response.pagination.page
  }
  const totalPages = Math.ceil((response.pagination?.total ?? 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

const assignEmployee = async (item: Transfer) => {
  selectedTransfer.value = item as Transfer
  isAssignEmployeeDrawerOpen.value = true
}

const fetchStats = async () => {
  await tranfersStore.getTransfersStats()
}

onMounted(() => {
  fetchAllTranfers()
  fetchStats()
})

watch([page, itemsPerPage], fetchAllTranfers)
</script>
<style lang="scss">
.stats-container {
  display: flex;
  gap: 10px;
  align-items: center;
}
.present-change {
  color: #6b7280;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}
.present {
  color: #1fc16b;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}
</style>
