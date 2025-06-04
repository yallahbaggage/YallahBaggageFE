<template>
  <div class="dropdown-container">
    <select :disabled="isDisabled" :aria-label="selectedValue?.value ?? ''" :value="selectedValue?.value"
        @change="handleChange($event)" class="dropdown-select" :class="props.customClass">
      <option v-for="item in list" :key="item.key" :value="item.value">
        {{ item.key }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { KeyValueItem } from '@/models'

const props = defineProps({
  isDisabled: { type: Boolean, default: false },
  list: { type: Array as () => KeyValueItem[], required: true },
  selectedValue: { type: Object as () => KeyValueItem | undefined, required: true },
  customClass: {type:String, default:''}
})

const emit = defineEmits(['change'])

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newValue = target.value
  emit('change', newValue)
}
</script>

<style scoped lang="scss">
.dropdown-container {
  position: relative;
}

.dropdown-select {
  width: 100%;
  padding: 10px;
  padding-right: 30px;  /*INFO To leave space for the arrow */
  appearance: none;  /*INFO Remove the default dropdown arrow in some browsers */
  border: 1px solid rgb(var(--v-theme-ashGray));
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"%3E%3Cpath d="M7 10l5 5 5-5z" fill="none" stroke="%23333" stroke-width="2" /%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

.dropdown-select:focus {
  outline: none;
  border-color: rgb(var(--v-theme-primary));
}

.dropdown-select option {
  padding: 8px;
  background-color: rgb(var(--v-theme-smokeBlue));
}
</style>
