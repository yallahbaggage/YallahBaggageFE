<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-image-area'"
      :title="t('banners')"
      :desc="t('manageYourAppsBanners')"
      :show-button="true"
      :button-text="t('newBanner')"
      v-on:button-pressed="() => (isEmployeeDrawerOpen = true)"
    />
    <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('totalBanners')">
          {{ stats.totalAds }}
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('activeBanners')">
          {{ stats.activeAds }}
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('deactiveBanners')">
          {{ stats.deactiveAds }}
        </InfoCard>
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
        <template #cell-image="{ item }">
          <img :src="item.image" style="max-width: 80px; max-height: 40px; object-fit: contain;" />
        </template>
        <template #cell-url="{ item }">
          <span>{{ item.url }}</span>
        </template>
        <template #cell-expireDate="{ item }">
          <span>{{ new Date(item.expireDate).toLocaleDateString() }}</span>
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
              <v-list-item class="menu-item" @click="deleteAd(item)">
                <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                {{ t('deleteBanner') }}
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </ServerTable>
      <!-- add Drawer -->
      <Drawer
        :isOpen="isEmployeeDrawerOpen"
        :desc="t('newBanner')"
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
                  <p class="employee-key">URL</p>
                  <p class="employee-value">https://example.com</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">Expire Date</p>
                  <p class="employee-value">2024-12-31</p>
                </div>
              </div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  @button-pressed="() => (isEmployeeDrawerOpen = false)"
                />
                <ActionButton :buttonText="t('addBanner')" buttonType="submit" />
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- add Drawer -->
      <!-- delete Drawer -->
      <Drawer
        :isOpen="isDeleteEmployeeDrawerOpen"
        :desc="t('deleteBanner')"
        :status="t('busy')"
        @close="isDeleteEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onDeleteButtonPressed(selectedAd!._id)" class="form">
            <div>
              <div class="drawer-banner">
                <p>{{ t('information') }}</p>
              </div>
              <div>
                <div class="employee-info">
                  <p class="employee-key">URL</p>
                  <p class="employee-value">{{ selectedAd?.url }}</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">Expire Date</p>
                  <p class="employee-value">{{ selectedAd ? new Date(selectedAd.expireDate).toLocaleDateString() : '' }}</p>
                </div>
                <div class="employee-info">
                  <p class="employee-key">ID</p>
                  <p class="employee-value">{{ selectedAd?._id.substring(0, 12) }}</p>
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
                  :buttonText="t('deleteBanner')"
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
import { useAdsStore } from '@/stores/modules/adsStore'
import { IAd } from '@/models/ad'
import { infoMessage } from '@/utils/helpers'
import { toastDeleteMessage, toastSuccessMessage } from '@/utils/helpers/notification'

const { t } = useI18n()
const isEmployeeDrawerOpen = ref(false)
const isDeleteEmployeeDrawerOpen = ref(false)
const isUpdateEmployeeDrawerOpen = ref(false)

const adsStore = useAdsStore()
const loading = computed(() => adsStore.isLoading)
const ads = computed(() => adsStore.allAds)
const pagination = computed(
  () => adsStore.paginationInfo || { total: 0, page: 1, limit: 8, pageCount: 1 },
)
const stats = computed(
  () =>
    adsStore.adsStats || { totalAds: 0, activeAds: 0, deactiveAds: 0 },
)
const page = ref(1)
const selectedAd = ref<IAd | null>(null)
const itemsPerPage = ref(8)

const headers = [
  { title: 'ID', key: '_id' },
  { title: t('bannerImage'), key: 'image' },
  { title: t('bannerTitle'), key: 'url' },
  { title: t('startEndDate'), key: 'expireDate' },
  { title: t('actions'), key: '', sortable: false },
]

const fetchAds = async () => {
  const response = await adsStore.getAds({ page: page.value, limit: itemsPerPage.value })
  if (response.pagination && response.pagination.page !== page.value) {
    page.value = response.pagination.page
  }
  const totalPages = Math.ceil((response.pagination?.total || 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

const fetchStats = async () => {
  await adsStore.getAdsStats()
}

onMounted(() => {
  fetchAds()
  fetchStats()
})

watch([page, itemsPerPage], fetchAds)

const onDeleteButtonPressed = async (selectedAdId: string) => {
  toastDeleteMessage(t('toastDeleteBannerTitle'), t('toastDeleteBannerDescription'))
  if (!selectedAdId) {
    console.error('No ad selected for deletion')
    return
  }
  // await adsStore.deleteAd(selectedAdId)
  isDeleteEmployeeDrawerOpen.value = false
}
const onAddButtonPressed = () => {
  isEmployeeDrawerOpen.value = false
  toastSuccessMessage(t('toastAddBannerTitle'), t('toastAddBannerDescription'))
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
  selectedAd.value = item as IAd
  isUpdateEmployeeDrawerOpen.value = true
}

function deleteAd(item: any) {
  selectedAd.value = item as IAd
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
