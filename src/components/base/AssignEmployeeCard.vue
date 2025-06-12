<template>
  <div class="employee-card">
    <div class="employee-info">
      <div class="avatar">{{ initials }}</div>
      <div class="details">
        <div class="name">{{ fullName }}</div>
        <div class="status">
          <span class="dot" />
          <span class="text">Available</span>
        </div>
      </div>
    </div>
    <button class="assign-button" @click="onAssign">Assign</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  fullName: string
}>()

const emit = defineEmits<{
  (e: 'assign'): void
}>()

const initials = props.fullName
  .split(' ')
  .map((name) => name[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

const onAssign = () => emit('assign')
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

.status {
  display: flex;
  align-items: center;
  margin-top: 4px;
  background: #e8fdf2;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 13px;
  color: #28a745;
}

.status .dot {
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  margin-right: 6px;
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
