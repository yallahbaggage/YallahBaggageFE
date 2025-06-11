<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-headphones'"
      :title="t('customerSupport')"
      :desc="t('manageYourCustomerSupportRequests')"
    />
    <div class="content">
      <!-- Content for the App Management Page goes here -->
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseHeader from '@/components/base/BaseHeader.vue'
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()
</script>
<style lang='scss'></style>
