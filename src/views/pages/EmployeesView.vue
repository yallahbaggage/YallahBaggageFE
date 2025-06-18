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
            <span class="status-circle"></span>
            {{ t(item.status) ?? t('Available') }}
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
        :title="t('newEmployee')"
        :desc="t('fillOutAllTheInformationsToAdd')"
        @close="
          () => {
            isEmployeeDrawerOpen = false
            resetForm()
          }
        "
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onAddButtonPressed()" class="drawer-form">
            <div class="drawer-banner">
              <p>{{ t('information') }}</p>
            </div>
            <div class="drawer-form-group">
              <label for="name" class="drawer-label-group">
                {{ t('fullName') }}<span class="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                class="form-input"
                placeholder="Employee full name here"
                v-model="newWorker.name"
                required
              />
            </div>
            <div class="drawer-form-group">
              <label for="email" class="drawer-label-group">
                {{ t('email') }}<span class="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                class="form-input"
                placeholder="employee@example.com"
                v-model="newWorker.email"
                required
              />
            </div>
            <div class="drawer-form-group">
              <label for="idNumber" class="drawer-label-group">
                {{ t('identityNumber') }}<span class="required">*</span>
              </label>
              <input
                id="idNumber"
                type="text"
                class="form-input"
                placeholder="1234567890"
                v-model="newWorker.identityNumber"
                required
              />
            </div>
            <div class="drawer-form-group">
              <label for="phone" class="drawer-label-group">
                {{ t('phoneNumber') }}<span class="required">*</span>
              </label>
              <div class="phone-input-wrapper">
                <div class="country-select" @click="toggleCountryDropdown">
                  <img :src="selectedCountry.flag" :alt="selectedCountry.name" class="flag" />
                  <span class="country-code">{{ selectedCountry.dialCode }}</span>
                  <span class="dropdown-arrow" :class="{ rotated: showCountryDropdown }">▼</span>
                </div>
                <input
                  id="phone"
                  type="text"
                  class="form-input phone-input"
                  :placeholder="`(${selectedCountry.dialCode})`"
                  v-model="phoneNumber"
                  required
                />
                <!-- Country Dropdown -->
                <div v-if="showCountryDropdown" class="country-dropdown">
                  <div class="dropdown-search">
                    <input
                      type="text"
                      v-model="countrySearch"
                      placeholder="Search countries..."
                      class="search-input"
                    />
                  </div>
                  <div class="dropdown-list">
                    <div
                      v-for="country in filteredCountries"
                      :key="country.iso2"
                      class="dropdown-item"
                      @click="selectCountry(country)"
                    >
                      <img :src="country.flag" :alt="country.name" class="flag" />
                      <span class="country-name">{{ country.name }}</span>
                      <span class="country-dial">{{ country.dialCode }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr class="infoHr" />
            <div class="action-btns">
              <ActionButton
                :buttonText="t('cancel')"
                buttonColor="white"
                class="action-Btn"
                @button-pressed="
                  () => {
                    isEmployeeDrawerOpen = false
                    resetForm()
                  }
                "
              />
              <ActionButton class="action-Btn" :buttonText="t('addEmployee')" buttonType="submit" />
            </div>
          </form>
        </div>
      </Drawer>
      <!-- add Drawer -->
      <!-- delete Drawer -->
      <Drawer
        :isOpen="isDeleteEmployeeDrawerOpen"
        :desc="t('employee') + ' ' + '#' + selectedWorker?._id.substring(0, 12)"
        :title="selectedWorker?.name"
        :status="selectedWorker?.status ? t(selectedWorker?.status) : t('Available')"
        @close="isDeleteEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('information') }}</p>
              </div>
              <div>
                <div class="drawer-info">
                  <p class="drawer-key">{{ t('fullName') }}</p>
                  <p class="drawer-value">{{ selectedWorker?.name }}</p>
                </div>
                <div class="drawer-info">
                  <p class="drawer-key">{{ t('employeeID') }}</p>
                  <p class="drawer-value">{{ selectedWorker?._id.substring(0, 12) }}</p>
                </div>
                <div class="drawer-info">
                  <p class="drawer-key">{{ t('phoneNumber') }}</p>
                  <p class="drawer-value">{{ selectedWorker?.phone }}</p>
                </div>
              </div>
              <hr class="infoHr" />

              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  class="action-Btn"
                  @button-pressed="() => (isDeleteEmployeeDrawerOpen = false)"
                />
                <ActionButton
                  button-color="error"
                  :buttonText="t('deleteEmployee')"
                  class="action-Btn"
                  @button-pressed="
                    () => {
                      isConfirmDeletePopupVisible = true
                      isDeleteEmployeeDrawerOpen = false
                    }
                  "
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
        :desc="t('employee') + ' ' + '#' + selectedWorker?._id.substring(0, 12)"
        :title="selectedWorker?.name"
        :status="t(selectedWorker?.status ? selectedWorker?.status : t('Available'))"
        @close="isUpdateEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onUpdateButtonPressed()" class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('information') }}</p>
              </div>
              <div>
                <div class="drawer-info">
                  <p class="drawer-key">{{ t('fullName') }}</p>
                  <p class="drawer-value">{{ selectedWorker?.name }}</p>
                </div>
                <div class="drawer-info">
                  <p class="drawer-key">{{ t('employeeID') }}</p>
                  <p class="drawer-value">{{ selectedWorker?._id.substring(0, 12) }}</p>
                </div>
                <div class="drawer-info">
                  <p class="drawer-key">{{ t('phoneNumber') }}</p>
                  <p class="drawer-value">{{ selectedWorker?.phone }}</p>
                </div>
              </div>
              <hr class="infoHr" />

              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  class="action-Btn"
                  @button-pressed="() => (isUpdateEmployeeDrawerOpen = false)"
                />
                <!-- <ActionButton
                  button-color="error"
                  :buttonText="t('deleteEmployee')"
                  buttonType="submit"
                  class="action-Btn"
                /> -->
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- update Drawer -->

      <ConfirmPopupDialog
        :isVisible="isConfirmDeletePopupVisible"
        :title="t('deleteEmployeeConfirmTitle')"
        :message="t('deleteEmployeeConfirmDescription')"
        :icon="'mdi-trash-can-outline'"
        :iconColor="'error'"
        @cancel="closeDeletePopup"
        @apply="onDeleteButtonPressed(selectedWorker!._id)"
        :cancelText="t('cancel')"
        :applyText="t('deleteConfirmButton')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import ActionButton from '@/components/base/ActionButton.vue'
import BaseHeader from '@/components/base/BaseHeader.vue'
import Drawer from '@/components/base/Drawer.vue'
import ConfirmPopupDialog from '@/components/base/ConfirmPopupDialog.vue'
import InfoCard from '@/components/base/InfoCard.vue'
import ServerTable from '@/components/base/ServerTable.vue'
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue3-i18n'
import { useWorkersStore } from '@/stores/modules/workers'
import { IWorker } from '@/models/worker'
import { toastDeleteMessage, toastSuccessMessage } from '@/utils/helpers/notification'
import { Country, countries } from '@/utils/constants/countries'
const { t } = useI18n()
const isEmployeeDrawerOpen = ref(false)
const isDeleteEmployeeDrawerOpen = ref(false)
const isUpdateEmployeeDrawerOpen = ref(false)
const isConfirmDeletePopupVisible = ref(false)
const closeDeletePopup = () => (isConfirmDeletePopupVisible.value = false)

const selectedCountry = ref<Country>(countries[0])
const phoneNumber = ref('')
const showCountryDropdown = ref(false)
const countrySearch = ref('')
const newWorker = ref({
  name: '',
  identityNumber: '',
  phone: '',
  email: '',
})
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
  if (response.pagination && response.pagination.page !== page.value) {
    page.value = response.pagination.page
  }
  const totalPages = Math.ceil((response.pagination?.total ?? 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

const fetchStats = async () => {
  await workersStore.getWorkersStats()
}

onMounted(() => {
  fetchWorkers()
  fetchStats()

  // Add click outside handler
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Remove click outside handler
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.phone-input-wrapper')) {
    showCountryDropdown.value = false
  }
}

watch([page, itemsPerPage], fetchWorkers)

// Watch for changes in phone number or selected country
watch([phoneNumber, selectedCountry], () => {
  if (phoneNumber.value) {
    newWorker.value.phone = `${selectedCountry.value.dialCode} ${phoneNumber.value}`
  } else {
    newWorker.value.phone = ''
  }
})

const onDeleteButtonPressed = async (selectedWorkerId: string) => {
  if (!selectedWorkerId) {
    console.error('No worker selected for deletion')
    return
  }
  await workersStore.deleteSelectedWorker(selectedWorkerId)
  toastDeleteMessage(t('toastDeleteEmployeeTitle'), t('toastDeleteEmployeeDescription'))
  isDeleteEmployeeDrawerOpen.value = false
  isConfirmDeletePopupVisible.value = false
}

const resetForm = () => {
  newWorker.value = {
    name: '',
    identityNumber: '',
    phone: '',
    email: '',
  }
  phoneNumber.value = ''
  selectedCountry.value = countries[0]
  showCountryDropdown.value = false
  countrySearch.value = ''
}

const onAddButtonPressed = async () => {
  try {
    // Combine country code with phone number
    const fullPhoneNumber = `${selectedCountry.value.dialCode} ${phoneNumber.value}`

    const workerData = {
      name: newWorker.value.name,
      identityNumber: newWorker.value.identityNumber,
      phone: fullPhoneNumber,
      email: newWorker.value.email,
      role: 'worker' as const,
      isAvailable: true,
      status: 'Available' as const,
      timeFormat: '24' as const,
      password: '123456', // Default password, consider changing this
      experience: 0, // Default experience
    }

    await workersStore.createWorker(workerData as unknown as IWorker)

    // Reset form
    resetForm()

    // Close drawer and show success message
    isEmployeeDrawerOpen.value = false
    toastSuccessMessage(t('toastAddEmployeeTitle'), t('toastAddEmployeeDescription'))

    // Refresh the workers list
    await fetchWorkers()
  } catch (error) {
    console.error('Error creating worker:', error)
    // You might want to show an error toast here
  }
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

const toggleCountryDropdown = () => {
  showCountryDropdown.value = !showCountryDropdown.value
}

const selectCountry = (country: Country) => {
  selectedCountry.value = country
  showCountryDropdown.value = false
}

const filteredCountries = computed(() => {
  return countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.value.toLowerCase()),
  )
})
</script>
<style lang="scss">

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


.required {
  color: #2563eb; /* blue-600 */
  margin-left: 2px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: #f9fafb;
  color: #888;
  outline: none;
  transition: border 0.2s;
}

.form-input:disabled {
  background: #f3f4f6;
  color: #bbb;
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.country-select {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 8px 0 0 8px;
  background: #f9fafb;
  cursor: pointer;
  min-width: 120px;
}

.country-select:hover {
  background: #f3f4f6;
}

.flag {
  width: 24px;
  height: 16px;
  margin-right: 6px;
  border-radius: 2px;
}

.country-code {
  font-size: 1rem;
  color: #222;
  margin-right: 4px;
}

.dropdown-arrow {
  font-size: 0.8rem;
  color: #888;
  transition: transform 0.2s;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.phone-input {
  border-left: none;
  border-radius: 0 8px 8px 0;
}

.country-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 300px;
  z-index: 1000;
  margin-top: 4px;
}

.dropdown-search {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #2563eb;
}

.dropdown-list {
  max-height: 250px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item .flag {
  width: 20px;
  height: 14px;
  margin-right: 8px;
  flex-shrink: 0;
}

.country-name {
  flex: 1;
  font-size: 14px;
  color: #222;
  margin-right: 8px;
}

.country-dial {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}
</style>
