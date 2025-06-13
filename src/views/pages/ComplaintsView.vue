<!-- <template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-headphones'"
      :title="t('customerSupport')"
      :desc="t('manageYourCustomerSupportRequests')"
    />
   <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('totalIssues')"> 3.484 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('openIssues')"> 2625 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('solvedIssues')"> 488 </InfoCard>
      </div>
      <hr class="infoHr"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseHeader from '@/components/base/BaseHeader.vue'
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()
</script>
<style lang='scss'></style> -->
<script setup lang="ts">
import { ref } from 'vue'
import ServerSideTable from '@/components/base/ServerTable.vue'
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Transfer Date', key: 'transferDate' },
  { title: 'Customer', key: 'customer' },
  { title: 'Pickup Date', key: 'pickupDate' },
  { title: 'Delivery Date', key: 'deliveryDate' },
  { title: 'Status', key: 'status' },
  { title: 'Assignee', key: 'assignee' },
  { title: '', key: 'actions', sortable: false }
])

const items = ref([]) // your API results here
const totalItems = ref(items.value.length)
const loading = ref(false)

const page = ref(1)
const itemsPerPage = ref(8)

function statusColor(status: string) {
  return {
    new: 'green',
    assigned: 'blue',
    'on the way': 'orange',
    delivered: 'grey',
    cancelled: 'red'
  }[status.toLowerCase()] ?? 'primary'
}
</script>

<template>
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
        {{ item.status }}
      </v-chip>
    </template>

    <template #actions="{ item }">
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item title="See Details" prepend-icon="mdi-eye" />
          <v-list-item title="Assign/Change Staff" prepend-icon="mdi-account" />
          <v-list-item title="Change Status" prepend-icon="mdi-sync" />
        </v-list>
      </v-menu>
    </template>
  </ServerSideTable>
</template>
