<template>
  <v-dialog v-model="props.isVisible" class="overlay" max-width="400" persistent>
    <v-card class="popup">
      <div class="popup-header">
        <v-icon v-if="icon" :color="iconColor" class="popup-icon">{{ icon }}</v-icon>
        <div class="title-wrapper">
          <v-card-title class="popup-title">{{ title }}</v-card-title>
          <v-card-text>
            <p v-if="message" class="popup-message">{{ message }}</p>
          </v-card-text>
        </div>
      </div>

      <hr class="infoHr" />

      <div class="confirm-action-btns">
        <ActionButton
          buttonColor="white"
          buttonBgColor="white"
          class="action-Btn"
          :onButtonPressed="onCancel"
          :button-text="cancelText"
        />
        <ActionButton
          buttonColor="white"
          class="action-Btn"
          buttonBgColor="primary"
          :onButtonPressed="onApply"
          :button-text="applyText"
        />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import ActionButton from './ActionButton.vue'

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
  icon: {
    type: String,
    default: '',
  },
  iconColor: {
    type: String,
    default: 'primary',
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
  background-color: rgb(var(--v-theme-white)) !important;
}

.popup {
  padding: 25px !important;
  width: 100%;
  background-color: rgb(var(--v-theme-white));
  padding: $large !important;
  border-radius: $x-small !important;
}
.popup-header {
  display: flex;
  align-items: start;
  gap: $medium;
}
.popup-title {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}

.popup-icon {
  font-size: 24px;
  color: var(--v-theme-primary);
  padding: 20px;
  border-radius: 50%;
  background-color: rgba(var(--v-theme-error), 0.1);
}

.popup-message {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: #5c5c5c;
  margin-bottom: $large;
}

.message-item {
  margin-bottom: $x-small !important;
}

.message-key {
  font-weight: $font-weight-bold;
  display: inline;
}

.title-wrapper {
  display: flex;
  gap: $x-small;
  flex-direction: column;
}

.confirm-action-btns{
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: $medium;
  flex-wrap: wrap;

  .action-Btn{
    flex: 1;
  }
}
</style>
