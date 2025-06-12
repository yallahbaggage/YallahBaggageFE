<template>
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
<style lang='scss'></style>
