<template>
  <div class="table-header-container">
    <div class="title-icon-wraper">
      <h2 class="table-header-title">{{ props.title }}</h2>
      <template v-if="props.iconName">
        <ActionButton
          icon-color="white"
          :button-icon="props.iconName"
          button-bg-color="primary"
          :buttonSize="SizeEnum.xsmall"
          :icon-size="props.iconSize"
          :onButtonPressed="onIconPressed"
        />
      </template>
    </div>
    <template v-if="props.buttonText">
      <ActionButton
        :button-text="props.buttonText"
        button-color="primary"
        icon-color="white"
        button-icon="mdi-filter"
        button-bg-color="primary"
        :buttonSize="SizeEnum.medium"
        :icon-size="props.iconSize"
        :onButtonPressed="onButtonPressed"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import ActionButton from './ActionButton.vue'
import { SizeEnum } from '@/models/SizeEnum'

const props = defineProps({
  title: {
    type: String,
    default: '',
    required: true,
  },
  iconName: {
    type: String,
    default: 'mdi-filter',
    required: true,
  },
  iconSize: {
    type: Number,
    default: 17,
  },
  buttonText: {
    type: String,
    default: '',
  },
})

//NOTE: Emit events
const emit = defineEmits(['button-pressed', 'icon-pressed'])

//NOTE: Methods
const onButtonPressed = () => {
  emit('button-pressed')
}

const onIconPressed = () => {
  emit('icon-pressed')
}
</script>
<style scoped lang="scss">
@use 'styles/main' as *;

.table-header-container {
  width: 100%;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  flex-wrap: wrap;
  padding: 0px 5px;
  // color: rgb(var(--v-theme-black));
  background: rgb(var(--v-theme-smokeBlue));
  margin: 10px 0px;
  border-radius: $primaryRadius;
  padding: $small;

  .title-icon-wraper {
    display: flex;
    align-items: center;
    gap: $medium !important;
    margin-left: 10px;
  }

  .table-header-title{
    font-size: $medium;
    padding-left: 10px;
  }
}
</style>
