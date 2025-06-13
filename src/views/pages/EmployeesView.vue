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
        <InfoCard class="infoCard" :cardTitle="t('totalEmployees')"> 484 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('employeesOnTransfer')"> 2625 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('availableEmployees')"> 488 </InfoCard>
      </div>
      <hr class="infoHr" />
      <ServerTable
        :headers="headers"
        :items="workers"
        :total-items="workers.length"
        :loading="loading"
        :page="page"
        :items-per-page="itemsPerPage"
        @update:page="page = $event"
        @update:items-per-page="itemsPerPage = $event"
      >
        <template #cell-status="{ item }">
          <v-chip :color="statusColor(item.status)" text-color="white" small>
            {{ item.status || 'New' }}
          </v-chip>
        </template>
        <template #cell-assignee="{ item }">
          <span v-if="item.assignee">{{ item.assignee }}</span>
          <v-btn v-else small outlined @click="assignStaff(item)">
            Assign Staff
          </v-btn>
        </template>
        <template #actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetails(item)">See Details</v-list-item>
              <v-list-item @click="assignStaff(item)">Assign/Change Staff</v-list-item>
              <v-list-item @click="changeStatus(item)">Change Status</v-list-item>
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
        :status="t('busy')"
        @close="isDeleteEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onDeleteButtonPressed()" class="form">
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
                  @button-pressed="() => (isDeleteEmployeeDrawerOpen = false)"
                />
                <ActionButton button-color="error" :buttonText="t('deleteEmployee')" buttonType="submit" />
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
                <ActionButton class="action-Btn" :buttonText="t('updateEmployee')" buttonType="submit" />
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
import InfoCard from '@/components/base/infoCard.vue'
import ServerTable from '@/components/base/ServerTable.vue'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue3-i18n'
import { useWorkersStore } from '@/stores/modules/workers'

const { t } = useI18n()
const isEmployeeDrawerOpen = ref(false)
const isDeleteEmployeeDrawerOpen = ref(false)
const isUpdateEmployeeDrawerOpen = ref(false)

const workersStore = useWorkersStore()
const loading = computed(() => workersStore.isLoading)
const workers = computed(() => workersStore.allWorkers)
const page = ref(1)
const itemsPerPage = ref(8)

const headers = [
  { title: 'ID', key: '_id' },
  { title: 'Full Name', key: 'name' },
  { title: 'Phone', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Status', key: 'status' },
  { title: 'Assignee', key: 'assignee' },
  { title: '', key: 'actions', sortable: false }
]

onMounted(() => {
  workersStore.getWorkers()
})

const onDeleteButtonPressed = () => {
  isDeleteEmployeeDrawerOpen.value = true
}
const onAddButtonPressed = () => {
  isEmployeeDrawerOpen.value = true
}
const onUpdateButtonPressed = () => {
  isUpdateEmployeeDrawerOpen.value = true
}

function statusColor(status: string) {
  return {
    New: 'green',
    Assigned: 'blue',
    'On The Way': 'orange',
    Delivered: 'grey',
    Cancelled: 'red',
    Available: 'green',
    default: 'primary'
  }[status] || 'primary'
}

function viewDetails(item: any) {
  // Implement view details logic
}

function assignStaff(item: any) {
  // Implement assign staff logic
}

function changeStatus(item: any) {
  // Implement change status logic
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

</style>
