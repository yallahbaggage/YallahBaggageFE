<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-account-group'"
      :title="t('employees')"
      :desc="t('manageAndTrackYourEmployees')"
      :show-button="true"
      :button-text="t('newEmployee')"
      v-on:button-pressed="() => (isEmployeeDrawerOpen = true)"
    />
    <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('totalEmployees')">
          {{ stats.totalWorkers }}
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('employeesOnTransfer')">
          {{ stats.workersWithTransfers }}
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('availableEmployees')">
          {{ stats.availableWorkers }}
        </InfoCard>
      </div>
      <hr class="infoHr" />
      <ServerTable
        :headers="headers"
        :items="workers"
        :total-items="pagination.total"
        :loading="loading"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
      >
        <template #cell-status="{ item }">
          <v-chip :color="statusColor(item.status)" text-color="white" small>
            {{ item.status ?? t('available') }}
          </v-chip>
        </template>
        <template #cell-_id="{ item }">
          {{ item._id.substring(0, 12) }}
        </template>
        <!-- <template #cell-assignee="{ item }">
          <span v-if="item.assignee">{{ item.assignee }}</span>
          <v-btn v-else small outlined @click="assignStaff(item)"> Assign Staff </v-btn>
        </template> -->
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
              <v-list-item class="menu-item" @click="deleteEmpeloyee(item)">
                <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                {{ t('deleteEmployee') }}
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </ServerTable>
      <!-- add Drawer -->
      <Drawer
        :isOpen="isEmployeeDrawerOpen"
        :desc="t('newEmployee')"
        :status="t('busy')"
        @close="isEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onAddButtonPressed()" class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('information') }}</p>
              </div>
              <div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('fullName') }}</p>
                  <p class="employee-value">Zaid Al-Farsi</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('employeeID') }}</p>
                  <p class="employee-value">784-678-9012-3</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('phoneNumber') }}</p>
                  <p class="employee-value">+971 (51) 123-4567</p>
                </div>
              </div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  @button-pressed="() => (isEmployeeDrawerOpen = false)"
                />
                <ActionButton :buttonText="t('addEmployee')" buttonType="submit" />
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- add Drawer -->
      <!-- delete Drawer -->
      <Drawer
        :isOpen="isDeleteEmployeeDrawerOpen"
        :desc="t('newEmployee')"
        :status="t(selectedWorker?.status ? selectedWorker?.status : t('available'))"
        @close="isDeleteEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onDeleteButtonPressed(selectedWorker!._id)" class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('information') }}</p>
              </div>
              <div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('fullName') }}</p>
                  <p class="employee-value">{{ selectedWorker?.name }}</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('employeeID') }}</p>
                  <p class="employee-value">{{ selectedWorker?._id.substring(0, 12) }}</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('phoneNumber') }}</p>
                  <p class="employee-value">{{ selectedWorker?.phone }}</p>
                </div>
              </div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  @button-pressed="() => (isDeleteEmployeeDrawerOpen = false)"
                />
                <ActionButton
                  button-color="error"
                  :buttonText="t('deleteEmployee')"
                  buttonType="submit"
                />
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- delete Drawer -->
      <!-- update Drawer -->
      <Drawer
        :isOpen="isUpdateEmployeeDrawerOpen"
        :desc="t('newEmployee')"
        :status="t('busy')"
        @close="isUpdateEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onUpdateButtonPressed()" class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('information') }}</p>
              </div>
              <div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('fullName') }}</p>
                  <p class="employee-value">Zaid Al-Farsi</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('employeeID') }}</p>
                  <p class="employee-value">784-678-9012-3</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">{{ t('phoneNumber') }}</p>
                  <p class="employee-value">+971 (51) 123-4567</p>
                </div>
              </div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  @button-pressed="() => (isUpdateEmployeeDrawerOpen = false)"
                  class="action-Btn"
                />
                <ActionButton
                  class="action-Btn"
                  :buttonText="t('updateEmployee')"
                  buttonType="submit"
                />
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- update Drawer -->
    </div>
  </div>
</template>
<script setup lang="ts">
import ActionButton from '@/components/base/ActionButton.vue'
import BaseHeader from '@/components/base/BaseHeader.vue'
import Drawer from '@/components/base/Drawer.vue'
import InfoCard from '@/components/base/InfoCard.vue'
import ServerTable from '@/components/base/ServerTable.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue3-i18n'
import { useWorkersStore } from '@/stores/modules/workers'
import { IWorker } from '@/models/worker'
import { infoMessage } from '@/utils/helpers'
import { toastDeleteMessage, toastSuccessMessage } from '@/utils/helpers/notification'

const { t } = useI18n()
const isEmployeeDrawerOpen = ref(false)
const isDeleteEmployeeDrawerOpen = ref(false)
const isUpdateEmployeeDrawerOpen = ref(false)

const workersStore = useWorkersStore()
const loading = computed(() => workersStore.isLoading)
const workers = computed(() => workersStore.allWorkers)
const pagination = computed(
  () => workersStore.paginationInfo || { total: 0, page: 1, limit: 8, pageCount: 1 },
)
const stats = computed(
  () =>
    workersStore.workersStats || { totalWorkers: 0, workersWithTransfers: 0, availableWorkers: 0 },
)
const page = ref(1)
const selectedWorker = ref<IWorker | null>(null)
const itemsPerPage = ref(8)

const headers = [
  { title: 'ID', key: '_id' },
  { title: t('employee'), key: 'name' },
  { title: t('identityNumber'), key: 'identityNumber' },
  { title: t('phoneNumber'), key: 'phone' },
  { title: t('status'), key: 'status' },
  { title: t('actions'), key: '', sortable: false },
]

const fetchWorkers = async () => {
  const response = await workersStore.getWorkers({ page: page.value, limit: itemsPerPage.value })
  // Sync local page with backend page (in case backend adjusts it)
  if (response.pagination && response.pagination.page !== page.value) {
    page.value = response.pagination.page
  }
}

const fetchStats = async () => {
  await workersStore.getWorkersStats()
}

onMounted(() => {
  fetchWorkers()
  fetchStats()
})

watch([page, itemsPerPage], fetchWorkers)

const onDeleteButtonPressed = async (selectedWorkerId: string) => {
  toastDeleteMessage(t('toastDeleteEmployeeTitle'), t('toastDeleteEmployeeDescription'))
  if (!selectedWorkerId) {
    console.error('No worker selected for deletion')
    return
  }
  // await workersStore.deleteSelectedWorker(selectedWorkerId)
  isDeleteEmployeeDrawerOpen.value = false
}
const onAddButtonPressed = () => {
  isEmployeeDrawerOpen.value = false
  toastSuccessMessage(t('toastAddEmployeeTitle'), t('toastAddEmployeeDescription'))
}
const onUpdateButtonPressed = () => {
  isUpdateEmployeeDrawerOpen.value = false
}

function statusColor(status: string) {
  return (
    {
      New: 'green',
      Assigned: 'blue',
      'On The Way': 'orange',
      Delivered: 'grey',
      Cancelled: 'red',
      Available: 'green',
      default: 'primary',
    }[status] ?? 'primary'
  )
}

function viewDetails(item: any) {
  selectedWorker.value = item as IWorker
  isUpdateEmployeeDrawerOpen.value = true
}

function deleteEmpeloyee(item: any) {
  selectedWorker.value = item as IWorker
  isDeleteEmployeeDrawerOpen.value = true
}
</script>
<style lang="scss">
.employee-info {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.employee-key {
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.084px;
  color: #5c5c5c;
}
.employee-value {
  color: #171717;
  font-feature-settings:
    'ss11' on,
    'liga' off,
    'calt' off;
  /* Label/Small */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.084px;
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
</style>
