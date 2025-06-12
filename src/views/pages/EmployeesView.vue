<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-account-group'"
      :title="t('employees')"
      :desc="t('manageAndTrackYourEmployees')"
      :show-button="true"
      :button-text="t('newEmployee')"
      v-on:button-pressed=" () => isEmployeeDrawerOpen = true"
    />
    <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('totalEmployees')"> 484 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('employeesOnTransfer')"> 2625 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('availableEmployees')"> 488 </InfoCard>
      </div>
      <hr class="infoHr" />
      <!-- Drawer -->
      <Drawer
        :isOpen="isEmployeeDrawerOpen"
        :desc="t('newEmployee')"
        :status="t('busy')"
        @close="isEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onAddButtonPressed()" class="form">
            <div>

            </div>
          </form>
        </div>
      </Drawer>
      <!-- Drawer -->
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseHeader from '@/components/base/BaseHeader.vue'
import Drawer from '@/components/base/Drawer.vue'
import InfoCard from '@/components/base/infoCard.vue'
import { ref } from 'vue'
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()
const isEmployeeDrawerOpen = ref(false)

const onAddButtonPressed = () => {
  isEmployeeDrawerOpen.value = true
}

</script>
<style lang="scss"></style>
