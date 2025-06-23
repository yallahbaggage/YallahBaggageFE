<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-swap-horizontal'"
      :title="t('transfers')"
      :desc="t('manageAndTrackYourTransfers')"
    />
    <div class="page-content">
      <!-- Loading state for initial page load -->
      <div v-if="initialLoading" class="loading-state">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <p>{{ t('loading') }}</p>
      </div>

      <!-- Content when loaded -->
      <div v-else>
        <div class="cards">
          <InfoCard class="infoCard" :cardTitle="t('todaysTransfers')">
            <div class="stats-container">
              {{ stats.todaysTransfers }}
              <p class="present-change">
                <span class="present">+{{ stats.todaysTransfersChange }}</span>
                {{ t('vsYesterday') }}
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
                <span class="cancel-present">+{{ stats.cancelledTransfersChange }}</span>
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
          <template #cell-_id="{ item }"> #{{ item._id.substring(0, 10) }} </template>
          <template #cell-workerId="{ item }">
            <span v-if="item?.workerId?.name">{{ item.workerId.name }}</span>
            <v-btn outline v-else @click="() => assignEmployee(item as Transfer)">
              <v-icon>mdi-plus-circle-outline</v-icon>
              {{ t('assign') }}
            </v-btn>
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
              {{ t(item.status) ?? t('pending') }}
            </v-chip>
          </template>
          <template #cell-pickUpDate="{ item }">
            <span>{{ formatDate(item.pickUpDate) }}</span>
          </template>
          <template #cell-deliveryDate="{ item }">
            <span>{{ formatDate(item.deliveryDate) }}</span>
          </template>
          <template #cell-createdAt="{ item }">
            <span>{{ formatDate(item.createdAt) }}</span>
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

        <!-- assign empeloyee Drawer -->
        <Drawer
          :isOpen="isAssignEmployeeDrawerOpen"
          :title="!selectedTransfer?.workerId ? t('assignEmployee') : t('changeEmployee')"
          :desc="
            !selectedTransfer?.workerId
              ? t('assignEmployeeToTransfer', {
                  transferId: selectedTransfer?._id?.substring(0, 10),
                })
              : t('changeEmployeeForTransfer', {
                  transferId: selectedTransfer?._id?.substring(0, 10),
                })
          "
          @close="isAssignEmployeeDrawerOpen = false"
        >
          <div class="drawer-content">
            <form class="form">
              <div>
                <div class="drawer-banner">
                  <p>{{ t('selectAnEmployee') }}</p>
                </div>
                <div v-if="workersLoading" class="loading-state">
                  <p>{{ t('loading') }}...</p>
                </div>
                <div v-else-if="workers.length === 0" class="no-workers">
                  <p>{{ t('noWorkersAvailable') }}</p>
                </div>
                <div v-else>
                  <div class="workers-list">
                    <AssignEmployeeCard
                      v-for="(employee, index) in workers"
                      :key="`employee-${employee._id}-${index}`"
                      :fullName="employee.name"
                      :status="employee.status"
                      @assign="assignEmployeeProcess(employee, selectedTransfer as Transfer)"
                    />
                  </div>
                </div>

                <div class="action-btns">
                  <ActionButton
                    :buttonText="t('cancel')"
                    buttonColor="white"
                    class="action-Btn"
                    @button-pressed="() => (isAssignEmployeeDrawerOpen = false)"
                  />
                  <ActionButton
                    :buttonText="t('save')"
                    class="action-Btn"
                    @button-pressed="saveAssignment"
                  />
                </div>
              </div>
            </form>
          </div>
        </Drawer>
        <!-- assign empeloyee Drawer -->

        <!-- Details Drawer -->
        <Drawer
          :isOpen="isDetailsTransfersDrawerOpen"
          :title="'Transfer' + ' ' + '#' + selectedTransfer?._id.substring(0, 10)"
          :desc="
            (selectedTransfer?.createdAt ? formatDateWithoutTime(selectedTransfer.createdAt) : '') +
            ' - ' +
            (selectedTransfer?.totalAmount ?? 0) +
            '$'
          "
          :status="selectedTransfer?.status ? t(selectedTransfer?.status) : t('available')"
          @close="isDetailsTransfersDrawerOpen = false"
        >
          <div style="max-height: 75vh">
            <form class="drawer-form">
              <div>
                <v-card>
                  <v-tabs v-model="tab" align-tabs="start" color="deep-purple-accent-4">
                    <v-tab value="details">{{ t('details') }}</v-tab>
                    <v-tab value="timeLine">{{ t('timeLine') }}</v-tab>
                  </v-tabs>

                  <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="details">
                   <v-expansion-panels v-if="selectedTransfer" v-model="panel" multiple>
    
    <!-- Panel 1: Customer Contacts -->
    <v-expansion-panel elevation="0" :title="t('customerContacts')" :value="'customerContacts'">
      <template #default>
        <div class="employee-card" v-if="panel.includes('customerContacts')">
          <div class="employee-info">
            <div class="avatar">
              {{ selectedTransfer?.userId?.name?.substring(0, 2).toUpperCase() }}
            </div>
            <div class="details">
              <div class="name">{{ selectedTransfer?.userId?.name }}</div>
              <div class="phone">
                {{ selectedTransfer?.userId?.email ?? '' }} -
                {{ selectedTransfer?.userId?.phone ?? '' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </v-expansion-panel>

    <!-- Panel 2: Contact Person -->
    <v-expansion-panel elevation="0" :title="t('contactPerson')" :value="'contactPerson'">
      <template #default>
        <div v-if="panel.includes('contactPerson')">
          <div class="drawer-info">
            <p class="drawer-key">{{ t('fullName') }}</p>
            <p class="drawer-value">{{ selectedTransfer?.userId?.name ?? 'N/A' }}</p>
          </div>

          <div class="drawer-info">
            <p class="drawer-key">{{ t('contactPreference') }}</p>
            <p class="drawer-value">
              <template
                v-if="selectedTransfer?.userId?.informationPreference?.[0] === 'whatsapp'"
              >
                <v-icon color="success">mdi-whatsapp</v-icon>
                {{ selectedTransfer?.userId?.informationPreference?.[0] ?? 'N/A' }}
              </template>
              <template
                v-else-if="selectedTransfer?.userId?.informationPreference?.[0] === 'email'"
              >
                <v-icon color="primary">mdi-email</v-icon>
                {{ selectedTransfer?.userId?.informationPreference?.[0] ?? 'N/A' }}
              </template>
              <template
                v-else-if="selectedTransfer?.userId?.informationPreference?.[0] === 'call'"
              >
                <v-icon color="error">mdi-phone</v-icon>
                {{ selectedTransfer?.userId?.informationPreference?.[0] ?? 'N/A' }}
              </template>
              <template
                v-else-if="selectedTransfer?.userId?.informationPreference?.[0] === 'sms'"
              >
                <v-icon color="info">mdi-sms</v-icon>
                {{ selectedTransfer?.userId?.informationPreference?.[0] ?? 'N/A' }}
              </template>
            </p>
          </div>

          <div class="drawer-info">
            <p class="drawer-key">{{ t('phoneNumber') }}</p>
            <p class="drawer-value">
              {{ selectedTransfer?.userId?.phone ?? 'N/A' }}
            </p>
          </div>
        </div>
      </template>
    </v-expansion-panel>

    <!-- Panel 3: Transfer Summary (empty for now) -->
    <v-expansion-panel elevation="0" :title="t('transferSummary')" :value="'transferSummary'">
      <template #default>
        <div v-if="panel.includes('transferSummary')">
          <p></p>
        </div>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>

                    </v-tabs-window-item>

                    <v-tabs-window-item value="timeLine">
                      <div class="drawer-banner">
                        <p>{{ t('timeLine') }}</p>
                      </div>
                      <div class="status-stepper">
                        <v-timeline>
                          <v-timeline-item
                            dot-color="white"
                            icon="mdi-shopping-outline"
                            icon-color="gray"
                            v-if="selectedTransfer?.acceptedAt"
                          >
                            <div class="timeline-item-content">
                              <p>{{ t('orderConfirmed') }}</p>
                              <span>{{ formatDate(selectedTransfer?.acceptedAt) }}</span>
                            </div>
                            <p class="status-desc">
                              {{ t('orderPlacedAndConfirmed') }}
                            </p>
                          </v-timeline-item>

                          <v-timeline-item
                            v-slot:opposite
                            dot-color="white"
                            icon="mdi-account-outline"
                            icon-color="gray"
                            v-if="selectedTransfer?.assigneedAt"
                          >
                            <div class="timeline-item-content">
                              <p>{{ t('staffAssigned') }}</p>
                              <span>{{ formatDate(selectedTransfer?.assigneedAt) }}</span>
                            </div>
                            <p class="status-desc">
                              <span class="stepper-worker-name">{{
                                selectedTransfer.workerId.name
                              }}</span>
                              {{ t('assignedToTransfer') }}
                            </p>
                          </v-timeline-item>

                          <v-timeline-item
                            v-if="selectedTransfer?.onTheWayAt"
                            dot-color="white"
                            icon="mdi-car-estate"
                            icon-color="orange"
                          >
                            <div class="timeline-item-content">
                              <p>{{ t('courierIsOnTheWay') }}</p>
                              <span>{{ formatDate(selectedTransfer?.onTheWayAt) }}</span>
                            </div>
                            <p class="status-desc">
                              {{ t('ourCourierIsOnTheWayToPickUp') }}
                            </p>
                          </v-timeline-item>
                          <v-timeline-item
                            v-slot:opposite
                            v-if="selectedTransfer?.inTransitAt"
                            dot-color="white"
                            icon="mdi-clock-time-three-outline"
                            icon-color="blue"
                          >
                            <div class="timeline-item-content">
                              <p>{{ t('weReceivedYourLuggages') }}</p>
                              <span>{{ formatDate(selectedTransfer?.inTransitAt) }}</span>
                            </div>
                            <p class="status-desc">
                              {{ t('packageInTransit') }}
                            </p>
                          </v-timeline-item>
                          <v-timeline-item
                            v-if="selectedTransfer?.completedAt"
                            dot-color="white"
                            icon="mdi-check"
                            icon-color="success"
                          >
                            <div class="timeline-item-content">
                              <p>{{ t('baggageDelivered') }}</p>
                              <span>{{ formatDate(selectedTransfer?.completedAt) }}</span>
                            </div>
                            <p class="status-desc">
                              {{
                                t('baggageHasBeenDeliveredTo', {
                                  placeName: selectedTransfer?.to ? t(selectedTransfer?.to) : 'N/A',
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
import { formatDate, formatDateWithoutTime } from '@/utils/helpers/date-helper'
import AssignEmployeeCard from '@/components/base/AssignEmployeeCard.vue'
import { useWorkersStore } from '@/stores/modules/workers'
import { IWorker } from '@/models/worker'
import { toastErrorMessage } from '@/utils/helpers/notification'

const { t } = useI18n()

const tranfersStore = useTransfersStore()
const workersStore = useWorkersStore()
const loading = computed(() => tranfersStore.isLoading)

// Initial loading state for first page load
const initialLoading = ref(true)

const isDetailsTransfersDrawerOpen = ref(false)
const workers = ref<IWorker[]>([])
const workersLoading = ref(false)
// const statusOptions = [
//   { label: 'pending' },
//   { label: 'in_progress' },
//   { label: 'resolved' },
//   { label: 'rejected' },
//   { label: 'closed' },
// ]

const panel = ref(['customerContacts', 'contactPerson', 'transferSummary'])

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
  { title: 'ID', key: '_id', sortable: false },
  { title: t('transferDate'), key: 'createdAt', sortable: false },
  { title: t('customer'), key: 'customer', sortable: false },
  { title: t('pickUpDate'), key: 'pickUpDate', sortable: false },
  { title: t('deliveryDate'), key: 'deliveryDate', sortable: false },
  { title: t('status'), key: 'status', sortable: false },
  { title: t('assignChangeStaff'), key: 'workerId', sortable: false },
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

  // Reset the current transfer's assigned worker ID for the new transfer
  currentTransferAssignedWorkerId.value = null

  // If workers are not loaded, try to load them again
  if (workers.value.length === 0) {
    try {
      workersLoading.value = true
      await workersStore.getWorkers()
      workers.value = workersStore.allWorkers
      console.log('Workers reloaded:', workers.value.length)
    } catch (error) {
      console.error('Error reloading workers:', error)
    } finally {
      workersLoading.value = false
    }
  }
}

const fetchStats = async () => {
  await tranfersStore.getTransfersStats()
}

const selectedEmployee = ref<IWorker | null>(null)
// Track the currently assigned worker for the current transfer (for local UI state)
const currentTransferAssignedWorkerId = ref<string | null>(null)

const assignEmployeeProcess = async (employee: IWorker, selectedTransfer: Transfer) => {
  console.log('Assigning employee:', employee.name)
  if (employee.status !== 'Available') {
    toastErrorMessage(
      'Plese select another empoloyee',
      'Employee is not available:' + employee.name,
    )
    return
  }

  // If there's a previously assigned worker for this transfer in the current session, make them available
  if (currentTransferAssignedWorkerId.value) {
    const previousWorkerIndex = workers.value.findIndex(
      (w) => w._id === currentTransferAssignedWorkerId.value,
    )
    if (previousWorkerIndex !== -1) {
      workers.value[previousWorkerIndex].status = 'Available'
      workers.value[previousWorkerIndex].isAvailable = true
      console.log(
        'Previous session worker status updated to Available:',
        workers.value[previousWorkerIndex].name,
      )
    }
  }

  // If the transfer already has a worker assigned from the database, update the status of that worker to Available
  if (selectedTransfer.workerId) {
    // Handle both string and object cases for workerId
    const previousWorkerId =
      typeof selectedTransfer.workerId === 'string'
        ? selectedTransfer.workerId
        : selectedTransfer.workerId._id

    // Only update if it's different from the current session assigned worker
    if (previousWorkerId !== currentTransferAssignedWorkerId.value) {
      const previousWorkerIndex = workers.value.findIndex((w) => w._id === previousWorkerId)
      if (previousWorkerIndex !== -1) {
        workers.value[previousWorkerIndex].status = 'Available'
        workers.value[previousWorkerIndex].isAvailable = true
        console.log(
          'Previous database worker status updated to Available:',
          workers.value[previousWorkerIndex].name,
        )
      }
    }
  }

  // Update the selected employee's status to Assigned
  const workerIndex = workers.value.findIndex((w) => w._id === employee._id)
  if (workerIndex !== -1) {
    workers.value[workerIndex].status = 'Assigned'
    workers.value[workerIndex].isAvailable = false
  }

  // Update the current transfer's assigned worker ID
  currentTransferAssignedWorkerId.value = employee._id

  // Store the selected employee for later use when saving
  selectedEmployee.value = employee

  console.log('Worker status updated locally to Assigned:', employee.name)
}

const saveAssignment = async () => {
  if (!selectedEmployee.value || !selectedTransfer.value) {
    console.error('No employee or transfer selected')
    return
  }

  try {
    await tranfersStore.updateTransfer({
      transferId: selectedTransfer.value._id ?? '',
      transferData: {
        workerId: selectedEmployee.value._id ?? '',
        items: selectedTransfer.value?.items ?? [],
      },
      emitSocket: false,
    })

    // Refresh the transfers list and workers list
    await fetchAllTranfers()
    await fetchAllWorkers()
    isAssignEmployeeDrawerOpen.value = false
    selectedEmployee.value = null // Reset selected employee
    currentTransferAssignedWorkerId.value = null // Reset current transfer assigned worker
  } catch (error) {
    console.error('Error saving assignment:', error)
  }
}

const fetchAllWorkers = async () => {
  try {
    workersLoading.value = true
    await workersStore.getWorkers()
    workers.value = workersStore.allWorkers
    console.log('Workers fetched:', workers.value.length)
  } catch (error) {
    console.error('Error fetching workers:', error)
  } finally {
    workersLoading.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([fetchAllTranfers(), fetchStats(), fetchAllWorkers()])
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    initialLoading.value = false
  }
})

// Watch for changes in the workers store
watch(
  () => workersStore.allWorkers,
  (newWorkers) => {
    workers.value = newWorkers
    console.log('Workers updated from store:', newWorkers.length)
  },
  { immediate: true },
)

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
.cancel-present {
  color: #da4122;
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

.loading-state,
.no-workers {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #6b7280;
  font-size: 14px;
}

.form {
  overflow-y: auto;
  max-height: 75vh;
}

.drawer-content {
  max-height: 75vh;
  overflow: hidden;
}

.drawer-banner {
  margin-bottom: 16px;
}

.drawer-banner p {
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.action-btns {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.workers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 10px;
}
.stepper-worker-name {
  // underline
  text-decoration: underline;
  color: rgb(var(--v-theme-primary));
}

.employee-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 12px 16px;
  background: #fff;
  max-width: 400px;
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #ffeecc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #5a4217;
  font-size: 14px;
}

.details {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 500;
  font-size: 16px;
  color: #222;
}

.phone {
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  color: #5c5c5c;
}
</style>
