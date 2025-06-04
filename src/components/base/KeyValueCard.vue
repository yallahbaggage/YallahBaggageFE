<template>
  <v-card class="flex-1" :title="props.cardKey" :subtitle="props.cardValue"></v-card>
</template>

<script setup lang="ts">

const props = defineProps({
  cardKey: {
      type: String,
      required: true,
    },
    cardValue: {
      type: String,
      required: true,
    },
})
</script>

<style lang="scss">
@use 'styles/main' as *;

.flex-1{
  flex:1;
}
.v-card-item,.v-card-title{
  padding: 3px 0px !important;
  font-size: $normalSize !important;
  font-weight: $font-weight-bold;
}
.v-card-subtitle{
  white-space: wrap !important;
  font-size: $normalSize !important;
  opacity: 1;
}

.v-card--variant-elevated, .v-card--variant-flat{
  background-color: transparent !important;
}
.v-card--variant-elevated{
  box-shadow: none !important;
}
</style>
