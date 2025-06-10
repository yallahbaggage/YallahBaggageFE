<template>
  <div class="employees-header">
    <div class="header-title">
      <i class="icon-employees"></i>
      <h1>{{ $t('employees') }}</h1>
      <span>{{ $t('manageAndTrackEmployees') }}</span>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary">
        <i class="icon-plus"></i>
        <span>{{ $t('newEmployee') }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Script setup for component logic
</script>

<style scoped>
.employees-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.header-title {
  display: flex;
  align-items: center;
}

.header-title h1 {
  margin: 0 10px 0 0;
  font-size: 24px;
  color: #333;
}

.header-title span {
  font-size: 14px;
  color: #666;
}

.header-actions .btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

/* Basic styling for icons, replace with actual icon library classes */
.icon-employees::before {
  content: '👤'; /* Placeholder icon */
  font-size: 28px;
  margin-right: 10px;
}

.icon-plus::before {
  content: '+'; /* Placeholder icon */
  font-size: 18px;
}
</style> 