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
import InfoCard from '@/components/base/infoCard.vue'
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()
</script>
<style lang="scss">

</style>
