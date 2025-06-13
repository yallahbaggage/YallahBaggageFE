<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-swap-horizontal'"
      :title="t('transfers')"
      :desc="t('manageAndTrackYourTransfers')"
    />
    <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('todaysTransfers')"> 3.484 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('currentTransfers')"> 2625 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('cancelledTransfers')"> 488 </InfoCard>
      </div>
      <hr class="infoHr"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseHeader from '@/components/base/BaseHeader.vue'
import InfoCard from '@/components/base/InfoCard.vue';
import { useI18n } from 'vue3-i18n';

const { t } = useI18n()


const headers = [
  { title: 'ID', key: '_id' },
  { title: t('transferDate'), key: 'transferDate' },
  { title: t('customer'), key: 'customer' },
  { title: t('pickUpDate'), key: 'pickUpDate' },
  { title: t('deliveryDate'), key: 'deliveryDate' },
  { title: t('status'), key: 'status' },
  { title: t('assignChangeStaff'), key: 'assignChangeStaff' },
  { title: t('changeStatus'), key: 'changeStatus' },
  { title: t('actions'), key: 'actions', sortable: false }
]
</script>
<style lang="scss">

</style>
