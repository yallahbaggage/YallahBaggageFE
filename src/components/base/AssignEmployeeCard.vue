<template>
  <div class="employee-card">
    <div class="employee-info">
      <div class="avatar">{{ initials }}</div>
      <div class="details">
        <div class="name">{{ fullName }}</div>
        <v-chip v-if="status" :color="statusColor(status)" text-color="white" medium>
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
    <v-chip v-else :color="statusColor(status)" text-color="white" medium>
      <span :style="{ backgroundColor: statusColor(status) }" class="status-circle"></span>
      {{ t(status) ?? 'available' }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()
const props = defineProps<{
  fullName: string
  status: 'Available' | 'Assigned' | 'OnTheWay' | undefined
}>()

const emit = defineEmits<{
  (e: 'assign'): void
}>()

const initials = props.fullName
  .substring(0, 2)
  .toUpperCase()

const onAssign = () => emit('assign')

function statusColor(status: string): string {
  switch (status) {
    case 'OnTheWay':
      return '#f59e0b' // amber
    case 'Assigned':
      return '#3b82f6' // blue
    case 'Available':
      return '#10b981' // green
    case 'OnLeave':
      return '#ef4444' // red
    default:
      return '#9ca3af' // fallback gray
  }
}
</script>

<style scoped lang="scss">
.employee-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 16px;
  background: #fff;
  max-width: 400px;
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #ffeecc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #5a4217;
  font-size: 14px;
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
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #1e4ed8;
  }
}
</style>
