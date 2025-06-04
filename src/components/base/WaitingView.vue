<template>
  <div class="container">
    <div>
      <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
    </div>
    <div class="message">{{ props?.message ?? t("loadingText") }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue3-i18n';

const {t} = useI18n();

const props = defineProps({
  message: {
    type: String,
    default: null,
  },
});
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.message {
  margin-top: $large !important;
  font-size: $xl !important;
  color: rgb(var(--v-theme-primary));
}
</style>
