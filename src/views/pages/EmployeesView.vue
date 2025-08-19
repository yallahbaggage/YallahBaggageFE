<template>
  <div class="app-management-page">
    <BaseHeader
      :pageImage="UserIcon"
      :title="t('employees')"
      :desc="t('manageAndTrackYourEmployees')"
      :show-button="true"
      :button-text="t('newEmployee')"
      v-on:button-pressed="() => (isEmployeeDrawerOpen = true)"
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
           <!-- Filter Section -->
      <div class="filter-section" style="margin-bottom: 16px; position: relative">
        <v-menu
          v-model="filterMenu"
          :close-on-content-click="false"
          offset-y
          transition="scale-transition"
          max-width="360"
          min-width="280"
        >
          <template #activator="{ props }">
            <v-btn v-bind="props" outline class="text-capitalize" prepend-icon="mdi-filter-variant">
              {{ t('filters') }}
            </v-btn>
          </template>
          <v-card
            style="
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px 6px rgba(0, 0, 0, 0.1);
            "
          >
            <v-card-text
              style="
                padding: 10px;
                font-size: 14px;
                font-weight: 500;
                width: 260px;
                line-height: 20px;
                background-color: #fff;
                border: 1px solid #ebebeb;
                margin-top: 15px;
              "
            >
              <div class="d-flex justify-space-between align-center mb-2">
                <h4 class="text-subtitle-1 font-weight-medium">{{ t('filters') }}</h4>
                <v-btn variant="text" @click="clearFilters" class="text-primary">{{
                  t('clear')
                }}</v-btn>
              </div>
              <div class="drawer-form-group">
                <label class="drawer-label-group">{{ t('fullName') }}</label>
                <input
                  type="text"
                  class="form-input no-focus-border"
                  placeholder="Employee name"
                  v-model="filters.name"
                />
              </div>
              <div class="drawer-form-group">
                <label class="drawer-label-group">{{ t('identityNumber') }}</label>
                <input
                  type="text"
                  class="form-input no-focus-border"
                  placeholder="Identity Number"
                  v-model="filters.identityNumber"
                />
              </div>
              <div class="drawer-form-group">
                <label class="drawer-label-group">{{ t('phoneNumber') }}</label>
                <input
                  type="text"
                  class="form-input no-focus-border"
                  placeholder="Phone Number"
                  v-model="filters.phone"
                />
              </div>
              <div class="drawer-form-group">
                <label class="drawer-label-group">{{ t('status') }}</label>
                <v-select
                  v-model="filters.status"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="no-focus-border"
                />
              </div>
              <div class="drawer-form-group">
                <label class="drawer-label-group">{{ t('available') }}</label>
                <v-select
                  v-model="filters.isAvailable"
                  :items="availabilityItems"
                  item-title="text"
                  item-value="value"
                  :return-object="false"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </div>
              <div class="d-flex justify-space-between mt-4">
                <v-btn variant="outlined" @click="clearFilters">{{ t('clear') }}</v-btn>
                <v-btn color="primary" @click="applyFilters">{{ t('apply') }}</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
      <!-- End Filter Section -->
        <ServerTable
          :headers="headers"
          :items="workers"
          :total-items="pagination.total"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
        >
          <template #cell-name="{ item }">
            <span class="name-bold">{{ item.name }}</span>
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
          <template #cell-_id="{ item }"> #{{ item._id.substring(0, 10) }} </template>
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
                <v-list-item class="menu-item" @click="updateWorker(item)">
                  <v-icon class="mr-2">mdi-pencil-outline</v-icon>
                  {{ t('editEmployee') }}
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
                    type="number"
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
                <ActionButton
                  class="action-Btn"
                  :buttonText="t('addEmployee')"
                  buttonType="submit"
                />
              </div>
            </form>
          </div>
        </Drawer>
        <!-- add Drawer -->
        <!-- delete Drawer -->
        <Drawer
          :isOpen="isDeleteEmployeeDrawerOpen"
          :desc="t('employee') + ' ' + '#' + selectedWorker?._id.substring(0, 10)"
          :title="selectedWorker?.name"
          :drawerStatus="selectedWorker?.status ? selectedWorker?.status : 'available'"
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
                    <p class="drawer-value">{{ selectedWorker?._id.substring(0, 10) }}</p>
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
          :desc="t('employee') + ' ' + '#' + selectedWorker?._id.substring(0, 10)"
          :title="selectedWorker?.name"
          :drawerStatus="selectedWorker?.status ? selectedWorker?.status : 'available'"
          @close="isUpdateEmployeeDrawerOpen = false"
        >
          <div style="max-height: 75vh">
            <form @submit.prevent="onUpdateButtonPressed" class="form">
              <div>
                <div class="drawer-banner">
                  <p>{{ t('information') }}</p>
                </div>
                <div>
                  <div class="drawer-form-group">
                    <label class="drawer-label-group"
                      >{{ t('fullName') }}<span class="required">*</span></label
                    >
                    <input type="text" class="form-input" v-model="selectedWorker!.name" required />
                  </div>
                  <div class="drawer-form-group">
                    <label class="drawer-label-group"
                      >{{ t('identityNumber') }}<span class="required">*</span></label
                    >
                    <input
                      type="text"
                      class="form-input"
                      v-model="selectedWorker!.identityNumber"
                      required
                    />
                  </div>
                  <!-- <div class="drawer-form-group">
                    <label class="drawer-label-group"
                      >{{ t('phoneNumber') }}<span class="required">*</span></label
                    >
                    <input type="text" class="form-input" v-model="selectedWorker!.phone" required />
                  </div> -->
                  <div class="drawer-form-group">
                    <label for="phone" class="drawer-label-group">
                      {{ t('phoneNumber') }}<span class="required">*</span>
                    </label>
                    <div class="phone-input-wrapper">
                      <div class="country-select" @click="toggleCountryDropdown">
                        <img :src="selectedCountry.flag" :alt="selectedCountry.name" class="flag" />
                        <span class="country-code">{{ selectedCountry.dialCode }}</span>
                        <span class="dropdown-arrow" :class="{ rotated: showCountryDropdown }"
                          >▼</span
                        >
                      </div>
                      <input
                        id="phone"
                        type="text"
                        class="form-input phone-input"
                        v-model="phoneWithoutCode"
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
                  <div class="drawer-form-group">
                    <label class="drawer-label-group"
                      >{{ t('email') }}<span class="required">*</span></label
                    >
                    <input
                      type="email"
                      class="form-input"
                      v-model="selectedWorker!.email"
                      required
                    />
                  </div>
                  <hr class="infoHr" />
                  <div class="action-btns">
                    <ActionButton
                      :buttonText="t('cancel')"
                      buttonColor="white"
                      class="action-Btn"
                      @button-pressed="() => (isUpdateEmployeeDrawerOpen = false)"
                    />
                    <ActionButton :buttonText="t('save')" buttonType="submit" class="action-Btn" />
                  </div>
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
  </div>
</template>
<script setup lang="ts">
import ActionButton from '@/components/base/ActionButton.vue'
import BaseHeader from '@/components/base/BaseHeader.vue'
import Drawer from '@/components/base/Drawer.vue'
import ConfirmPopupDialog from '@/components/base/ConfirmPopupDialog.vue'
import InfoCard from '@/components/base/InfoCard.vue'
import ServerTable from '@/components/base/ServerTable.vue'
import { ref, onMounted, computed, watch, onUnmounted, reactive } from 'vue'
import { useI18n } from 'vue3-i18n'
import { useWorkersStore } from '@/stores/modules/workers'
import { IWorker } from '@/models/worker'
import {
  toastDeleteMessage,
  toastErrorMessage,
  toastSuccessMessage,
} from '@/utils/helpers/notification'
import { Country, countries } from '@/utils/constants/countries'
import UserIcon from '@/assets/images/users.svg'

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

// Initial loading state for first page load
const initialLoading = ref(true)

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
  { title: 'ID', key: '_id', sortable: false },
  { title: t('employee'), key: 'name', sortable: false },
  { title: t('identityNumber'), key: 'identityNumber', sortable: false },
  { title: t('phoneNumber'), key: 'phone', sortable: false },
  { title: t('status'), key: 'status', sortable: false },
  { title: t('actions'), key: '', sortable: false },
]

const availabilityItems = [
  { text: t('yes'), value: true },
  { text: t('no'), value: false },
]

const filterMenu = ref(false)
const filters = ref({
  name: '',
  identityNumber: '',
  phone: '',
  isAvailable: null,
  status: null,
})
const statusOptions = ['Available', 'Assigned', 'OnTheWay', 'Delivered']

function clearFilters() {
  filters.value = {
    name: '',
    identityNumber: '',
    phone: '',
    isAvailable: null,
    status: null,
  }
  fetchWorkers()
  filterMenu.value = false
}

function applyFilters() {
  fetchWorkers()
  filterMenu.value = false
}

const fetchWorkers = async () => {
  const params: any = {
    page: page.value,
    limit: itemsPerPage.value,
  }
  if (filters.value.name) params.name = filters.value.name
  if (filters.value.identityNumber) params.identityNumber = filters.value.identityNumber
  if (filters.value.phone) params.phone = filters.value.phone
  if (filters.value.isAvailable !== null) params.isAvailable = filters.value.isAvailable
  if (filters.value.status) params.status = filters.value.status

  const response = await workersStore.getWorkers(params)
  if (response.pagination && response.pagination.page !== page.value) {
    page.value = response.pagination.page
  }
  const totalPages = Math.ceil((response.pagination?.total ?? 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

const phoneWithoutCode = computed({
  get() {
    const phone = selectedWorker.value?.phone || ''
    const dialCode = selectedCountry.value.dialCode || ''
    return phone.startsWith(dialCode + ' ')
      ? phone.replace(dialCode + ' ', '')
      : phone
  },
  set(newValue) {
    if (selectedWorker.value) {
      const dialCode = selectedCountry.value.dialCode || ''
      selectedWorker.value.phone = `${dialCode} ${newValue}`
    }
  }
})


const fetchStats = async () => {
  await workersStore.getWorkersStats()
}

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

function statusColor(status: string) {
  return (
    {
      New: 'green',
      Assigned: 'blue',
      OnTheWay: 'orange',
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

function updateWorker(item: any) {
  selectedWorker.value = item as IWorker
  // editWorker.name = item.name || ''
  // editWorker.identityNumber = item.identityNumber || ''
  // editWorker.phone = item.phone || ''
  // editWorker.email = item.email || ''
  selectCountry(countries.find(country => country.dialCode === item.phone.split(' ')[0]) || countries[0])
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

const editWorker = reactive({
  name: '',
  identityNumber: '',
  phone: '',
  email: '',
})

// // Sync selectedWorker data to editWorker when opening update drawer
// function viewDetails(item: IWorker) {
//   selectedWorker.value = item
//   Object.assign(editWorker, {
//     name: item.name || '',
//     identityNumber: item.identityNumber || '',
//     phone: item.phone || '',
//     email: item.email || '',
//   })
//   isUpdateEmployeeDrawerOpen.value = true
// }

// Update API call or store action to save changes
const onUpdateButtonPressed = async () => {
  try {
    if (!selectedWorker.value) return
    const res = await workersStore.updateSelectedWorker(selectedWorker.value._id, {
      name: selectedWorker.value.name,
      phone: selectedWorker.value.phone,
      identityNumber: selectedWorker.value.identityNumber,
      email: selectedWorker.value.email,
    })
    isUpdateEmployeeDrawerOpen.value = false
    await fetchWorkers()
    toastSuccessMessage(t('toastUpdateEmployeeTitle'), t('toastUpdateEmployeeDescription'))
  } catch (error) {
    toastErrorMessage(
      t('anErrorOccured'),
      typeof error === 'string'
        ? error
        : error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred.',
    )
    console.error('Error updating worker:', error)
  }
}

onMounted(async () => {
  try {
    await Promise.all([fetchWorkers(), fetchStats()])
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    initialLoading.value = false
  }

  // Add click outside handler
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Remove click outside handler
  document.removeEventListener('click', handleClickOutside)
})
</script>
<style lang="scss" scoped>
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
