<template>
  <div class="assign-employee-card">
    <div class="assign-employee-info">
      <div class="avatar">{{ initials }}</div>
      <div class="details">
        <div class="name">{{ fullName }}</div>
        <v-chip
          class="assign-status"
          v-if="status"
          :color="statusColor(status)"
          text-color="white"
          medium
        >
          <span :style="{ backgroundColor: statusColor(status) }" class="status-circle"></span>
          {{ t(status) ?? 'available' }}
        </v-chip>
      </div>
    </div>
    <button
      v-if="!status || status === 'Available'"
      class="assign-button"
      @click.prevent="onAssign"
    >
      {{ t('assign') }}
    </button>
    <v-chip v-else :color="statusColor('assigned')" text-color="white" medium>
      <v-icon size="12.728px" :style="{ color: statusColor('assigned'), 'margin-right': '6px' }">
        mdi-check
      </v-icon>
      {{ t('assigned') ?? 'available' }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue3-i18n'
import { StaticFunctions } from '@/utils/helpers/static_functions'

const { t } = useI18n()
const props = defineProps<{
  fullName: string
  status: 'Available' | 'Assigned' | 'OnTheWay' | undefined
}>()

const emit = defineEmits<{
  (e: 'assign'): void
}>()

const initials = props.fullName.substring(0, 2).toUpperCase()

const onAssign = () => emit('assign')

function statusColor(status: string): string {
  return StaticFunctions.getStatusColorOnly(status)
}
</script>

<style scoped lang="scss">
.assign-employee-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 16px;
  background: #fff;
  // max-width: 360px;
  width: 100%;
  gap: 16px;
  height: 72px;

  .v-chip.v-chip--size-default {
    height: 28px !important;
  }
}
.assign-employee-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  background: #ffeecc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #5a4217;
  font-size: 14px;
  margin-right: 12px;
}

.details {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 500;
  font-size: 16px;
  color: #222;
}

.assign-button {
  background: #335cff;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px !important;

  &:hover {
    background: #1e4ed8;
  }
}

.assign-status {
  width: fit-content;
}
</style>
