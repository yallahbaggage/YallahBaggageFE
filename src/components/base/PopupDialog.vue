<template>
  <v-dialog
    ref="overlay"
    v-model="props.isVisible"
    class="overlay"
    width="auto"
    @click:outside="onCancel"
  >
    <v-card ref="popup" class="popup">
      <v-card-title class="popup-title">{{ title }}</v-card-title>
      <v-card-text>
        <div v-if="messageItems.length" class="popup-message">
          <div v-for="(item, index) in messageItems" :key="item.key" class="message-item">
            <h3 class="message-key">{{ item.key }}:</h3>
            {{ item.value }}
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="popup-buttons">
        <ActionButton
          custom-class="cancel-button"
          @button-pressed="onCancel"
          :button-text="cancelText"
        />
        <ActionButton
          v-if="isApplyButtonVisible"
          custom-class="apply-button"
          @button-pressed="onApply"
          :button-text="applyText"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

//NOTE: Props
const props = defineProps({
  isVisible: Boolean,
  title: { type: String, default: 'Confirmation' },
  messageItems: { type: Array as () => { key: string; value: string }[], default: () => [] },
  cancelText: { type: String, default: 'Cancel' },
  applyText: { type: String, default: 'Apply' },
  isApplyButtonVisible: { type: Boolean, default: true },
})

//NOTE: Emits
const emit = defineEmits(['cancel', 'apply'])

//NOTE: Refs
const overlay = ref<HTMLElement | null>(null)
const popup = ref<HTMLElement | null>(null)

const onApply = () => {
  emit('apply')
}

const onCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.v-dialog > .v-overlay__content > .v-card,
.v-dialog > .v-overlay__content > form > .v-card {
  background-color: rgb(var(--v-theme-white)) !important;
}

.popup {
  padding: $xl !important;
  border-radius: $x-small !important;
  width: 100%;
  background-color: rgb(var(--v-theme-white));

  .v-card-title{
    font-size: 16px !important;
    font-weight: 500 !important;
  }
}

.popup-title {
  font-size: $xl !important;
  font-weight: $font-weight-bold;
  text-align: center;
  margin-bottom: $medium !important;
}

.popup-message {
  // margin-bottom: $xl !important;
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
  color: rgb(var(--v-theme-white));
  cursor: pointer;
  border: none;
  font-weight: $font-weight-bold;

  &:hover {
    background-color: rgb(var(--v-theme-primaryHover));
  }
}
</style>
