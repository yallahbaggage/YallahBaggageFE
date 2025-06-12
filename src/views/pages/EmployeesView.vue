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
        <InfoCard class="infoCard" :cardTitle="t('totalEmployees')"> 484 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('employeesOnTransfer')"> 2625 </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('availableEmployees')"> 488 </InfoCard>
      </div>
      <hr class="infoHr" />
      <!-- add Drawer -->
      <Drawer
        :isOpen="isEmployeeDrawerOpen"
        :desc="t('newEmployee')"
        :status="t('busy')"
        @close="isEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onAddButtonPressed()" class="form">
            <div>
              <div class="employee-banner">
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
                  @button-pressed="() => (isEmployeeDrawerOpen = false)"
                />
                <ActionButton :buttonText="t('addEmployee')" buttonType="submit" />
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <!-- add Drawer -->
      <!-- delete Drawer -->
      <Drawer
        :isOpen="isDeleteEmployeeDrawerOpen"
        :desc="t('newEmployee')"
        :status="t('busy')"
        @close="isDeleteEmployeeDrawerOpen = false"
      >
        <div style="max-height: 75vh">
          <form @submit.prevent="onDeleteButtonPressed()" class="form">
            <div>
              <div class="employee-banner">
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
                  @button-pressed="() => (isDeleteEmployeeDrawerOpen = false)"
                />
                <ActionButton button-color="error" :buttonText="t('deleteEmployee')" buttonType="submit" />
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
              <div class="employee-banner">
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
                <ActionButton class="action-Btn" :buttonText="t('updateEmployee')" buttonType="submit" />
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
import InfoCard from '@/components/base/infoCard.vue'
import { ref } from 'vue'
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()
const isEmployeeDrawerOpen = ref(false)
const isDeleteEmployeeDrawerOpen = ref(false)
const isUpdateEmployeeDrawerOpen = ref(false)

const onDeleteButtonPressed = () => {
  isDeleteEmployeeDrawerOpen.value = true
}
const onAddButtonPressed = () => {
  isEmployeeDrawerOpen.value = true
}
const onUpdateButtonPressed = () => {
  isUpdateEmployeeDrawerOpen.value = true
}
</script>
<style lang="scss">
.employee-banner {
  background-color: rgb(var(--v-theme-lightGray));

  p {
    font-weight: 600;
    padding: 10px;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 133.333% */
    letter-spacing: 0.48px;
    text-transform: uppercase;
    color: #a3a3a3;
  }
}

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
.action-btns {
  padding-top: 15px;
  border-top: 1px solid rgb(var(--v-theme-lightGray));
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  position: absolute;
  bottom: 0;
  width: 95%;
  margin-bottom: 20px;

  .action-Btn{
    flex: 1;
  }
}
</style>
