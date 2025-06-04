<template>
  <div class="dropdown-container">
    <select :aria-label="selectedValue?.toString ?? ''" v-model="selectedValue" @change="handleChange($event)" class="dropdown-select" :class="props.customClass">
      <option v-for="item in list" :key="item" :value="item">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { watch, toRefs } from 'vue'

const props = defineProps({
  list: { type: Array as () => string[], required: true},
  selectedValue: { type: [Object as () => String | '', String], required: true },
  customClass: { type:String, default:'' }
})

const emit = defineEmits(['change'])

const { selectedValue } = toRefs(props)
watch(selectedValue, (newValue) => {
    selectedValue.value = newValue
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newValue = target.value
  emit('change', newValue)
}
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.dropdown-container {
  position: relative;
}

.dropdown-select {
  appearance: none;  /*INFO Remove the default dropdown arrow in some browsers */
  border: 1px solid rgb(var(--v-theme-ashGray));
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"%3E%3Cpath d="M7 10l5 5 5-5z" fill="none" stroke="%23333" stroke-width="2" /%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding: 8px 30px 8px 12px; 
}

.dropdown-select:focus {
  outline: none;
  border-color: rgb(var(--v-theme-primary));
}
</style>
