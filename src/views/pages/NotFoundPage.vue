<template>
  <div class="error-container">
    <h3>{{ message }}</h3>
    <ActionButton v-if="message != t('employeeNotFound')" button-icon="mdi-home" :onButtonPressed="goToHomePage" :button-text="t('backToHomePage')"/>
  </div>
</template>

<style scoped lang="scss">
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25%;
  font-size: 2em;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router'
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()
const router = useRouter()


const previousRoute = router.options.history.state.back != null ? router.options.history.state.back.toString() : ''
const message = computed(() => {
  if (previousRoute.includes('call-close') || previousRoute.includes('customer-dashboard')) {
    return t('employeeNotFound')
  } else {
    return t('pageNotFound')
  }
})

const goToHomePage = () => {
  router.push({ path: '/' })
}
</script>
