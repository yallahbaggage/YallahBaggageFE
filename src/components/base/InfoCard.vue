<script setup lang="ts">

const props = defineProps({
  cardTitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="card-container">
    <p class="cardTitle">{{ props.cardTitle }}</p>
    <slot class="cardValue"></slot>
  </div>
</template>
<style lang="scss">
@use 'styles/main' as *;

// $bg-color: rgb(var(--v-theme-smokeBlue));
// $text-color: rgb(var(--v-theme-midnightBlue));

.cardTitle {
  color: var(--text-sub-600, #5C5C5C);
  font-feature-settings: 'ss11' on, 'liga' off, 'calt' off;
  /* Label/X Small */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}

.cardValue{
  color: var(--text-strong-950, #171717);
  font-feature-settings: 'ss11' on, 'liga' off, 'calt' off;
  font-family: "Inter Display";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; 
}
</style>
