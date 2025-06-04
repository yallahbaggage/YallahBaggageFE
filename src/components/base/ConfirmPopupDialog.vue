<template>
  <v-dialog v-model="props.isVisible" class="overlay" max-width="400" persistent>
    <v-card class="popup">
      <v-card-title class="popup-title">{{ title }}</v-card-title>
      <v-card-text>
        <p v-if="message" class="popup-message">{{ message }}</p>
      </v-card-text>
      <v-card-actions>
        <ActionButton buttonColor="white" buttonBgColor="secondary" :onButtonPressed="onCancel" :button-text="cancelText"/>
        <ActionButton buttonColor="white" buttonBgColor="primary" :onButtonPressed="onApply" :button-text="applyText"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import ActionButton from './ActionButton.vue';

//NOTE: Props
const props = defineProps({
  isVisible: Boolean,
  title: {
    type: String,
    default: 'Confirmation',
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  applyText: {
    type: String,
    default: 'Apply',
  },
  isApplyButtonVisible: {
    type: Boolean,
    default: true,
  },
})

//NOTE: Emits
const emit = defineEmits(['cancel', 'apply'])

//NOTE: Methods
const onCancel = () => emit('cancel')
const onApply = () => emit('apply')
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.v-dialog > .v-overlay__content > .v-card,
.v-dialog > .v-overlay__content > form > .v-card {
  background-color:  rgb(var(--v-theme-white)) !important;
}

.popup {
  padding: $xl !important;
  border-radius: $x-small !important;
  width: 100%;
  background-color:  rgb(var(--v-theme-white));
}

.popup-title {
  font-size: $xl !important;
  font-weight: $font-weight-bold;
  text-align: center;
  margin-bottom: $medium !important;
}

.popup-message {
  margin-bottom: $xl !important;
  font-weight: normal;
}

.message-item {
  margin-bottom: $x-small !important;
}

.message-key {
  font-weight: $font-weight-bold;
  display: inline;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: $medium !important;
}

.cancel-button {
  background-color: rgb(var(--v-theme-secondary));
  padding: $x-small $medium !important;
  border-radius: $x-small !important;
  color: rgb(var(--v-theme-white));
  cursor: pointer;
  border: none;
  font-weight: $font-weight-bold;
}

.apply-button {
  padding: $x-small $medium !important;
  border-radius: $x-small !important;
  background-color: rgb(var(--v-theme-primary));
  color:  rgb(var(--v-theme-white));
  cursor: pointer;
  border: none;
  font-weight: $font-weight-bold;

  &:hover {
    background-color: rgb(var(--v-theme-primaryHover));
  }
}
</style>
