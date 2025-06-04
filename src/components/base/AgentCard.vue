<script setup lang="ts">

const props = defineProps({
  cardTitle: {
    type: String,
    default: '0',
  },
  cardDescription: {
    type: String,
    default: '',
  },
  iconName: {
    type: String,
    default: null,
  },
  iconColor: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <div class="card-container">
    <div class="icon-container">
      <v-icon :style="{ color: props.iconColor }" class="icon">
        {{ props.iconName }}
      </v-icon>
    </div>
    <h1>{{ props.cardTitle }}</h1>
    <h4>{{ props.cardDescription }}</h4>
  </div>
</template>
<style lang="scss">
@use 'styles/main' as *;

$bg-color: rgb(var(--v-theme-smokeBlue));
$text-color: rgb(var(--v-theme-midnightBlue));

.card-container {
  background-color: $bg-color;
  padding: $medium !important;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: $x-small !important;
  box-shadow: $shadow;
  color: $text-color;

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .icon {
      font-size: $size-5xl;
    }
  }

  h1 {
    font-size: $size-3xl !important;
    font-weight: $font-weight-bold;
  }

  h4 {
    font-size: $xl !important;
    font-weight: $font-weight-regular;
  }
}
</style>
