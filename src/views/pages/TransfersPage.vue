<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-swap-horizontal'"
      :title="t('transfers')"
      :desc="t('manageAndTrackYourTransfers')"
    />
    <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('todaysTransfers')"> {{stats.todaysTransfers}} <span>{{stats.todaysTransfersChange}}</span> {{t('vsYesterday')}}</InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('currentTransfers')"> {{stats.currentTransfers}} <span>{{stats.currentTransfersChange}}</span> {{t('vsYesterday')}}</InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('cancelledTransfers')"> {{stats.cancelledTransfers}} <span>{{stats.cancelledTransfersChange}}</span> {{t('vsYesterday')}}</InfoCard>
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
         <template #cell-pickUpDate="{ item }">
          <span>{{ new Date(item.pickUpDate).toLocaleDateString() }}</span>
        </template>
         <template #cell-deliveryDate="{ item }">
          <span>{{ new Date(item.deliveryDate).toLocaleDateString() }}</span>
        </template>
        <template #actions="{ item }">
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
              <v-list-item class="menu-item" @click="deleteAd(item)">
                <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                {{ t('deleteBanner') }}
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </ServerTable>
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

const { t } = useI18n()

const tranfersStore = useTransfersStore()
const loading = computed(() => tranfersStore.isLoading)
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
const selectedTransfer = ref<Transfer | null>(null)
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

function viewDetails(item: Transfer) {
  selectedTransfer.value = item as Transfer
  // isUpdateEmployeeDrawerOpen.value = true
}

function deleteAd(item: any) {
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

const fetchStats = async () => {
  await tranfersStore.getTransfersStats()
}

onMounted(() => {
  fetchAllTranfers()
  fetchStats()
})

watch([page, itemsPerPage], fetchAllTranfers)
</script>
<style lang="scss"></style>
