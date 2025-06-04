<template>
  <div>
    <button @click="toggleTheme()">Toggle Theme</button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from 'modules/theme'
const themeStore = useThemeStore()

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

button {
  margin: 0 $x-small !important;
  padding: $x-small $medium !important;
  border: 1px solid rgb(var(--v-theme-ashGray));
  border-radius: $x-small !important;
  background-color: rgb(var(--v-theme-white));
  color: rgb(var(--v-theme-smokyBlack));
  cursor: pointer;
}
</style>
