<script setup lang="ts">
import { SizeEnum } from '@/models/SizeEnum'
import { PropType } from 'vue'

const props = defineProps({
  buttonText: {
    type: String,
    default: null,
  },
  buttonIcon: {
    type: String,
    default: null,
  },
  buttonColor: {
    type: String,
    default: 'primary',
  },
  buttonBgColor: {
    type: String,
    default: null,
  },
  iconColor: {
    type: String,
    default: null,
  },
  iconSize: {
    type: Number,
    default: 20,
  },
  customClass: {
    type: String,
    default: '',
  },
  buttonType: {
    type: String,
    default: 'button',
  },
  buttonSize: {
    type: String as PropType<SizeEnum>,
    default: SizeEnum.medium,
  },
})

const emit = defineEmits(['button-pressed'])

const onButtonPressed = () => {
  emit('button-pressed')
}
</script>

<template>
  <div>
    <!-- #INFO Button with only text -->
    <v-btn
      v-if="buttonText && !buttonIcon"
      :type="buttonType"
      @click="onButtonPressed"
      :color="buttonBgColor || buttonColor"
      variant="flat"
      :class="customClass"
      class="action-text-button"
      block
      :size="buttonSize"
      :id="props.buttonText"
      :aria-label="props.buttonText"
      role="button"
    >
      {{ buttonText }}
    </v-btn>

    <!-- #INFO Button with only icon -->
    <v-btn
      v-else-if="buttonIcon && !buttonText"
      :type="buttonType"
      @click="onButtonPressed"
      :color="buttonBgColor || buttonColor"
      class="action-icon-button"
      icon
      block
      variant="flat"
      :class="customClass"
      :size="buttonSize"
      :id="props.buttonIcon"
      :aria-label="props.buttonIcon"
      role="button"
    >
      <v-icon
        :style="{ fontSize: `${iconSize}px`, color: iconColor || 'inherit' }"
        :size="props.iconSize"
        >{{ props.buttonIcon }}</v-icon
      >
    </v-btn>

    <!-- #INFO Button with both icon and text -->
    <v-btn
      v-else-if="buttonIcon && buttonText"
      :type="buttonType"
      @click="onButtonPressed"
      :color="buttonBgColor || buttonColor"
      class="action-icon-text-button"
      variant="flat"
      block
      :class="customClass"
      :size="buttonSize"
      :id="props.buttonText"
      :aria-label="props.buttonText"
      role="button"
    >
      <v-icon
        :style="{ fontSize: `${iconSize}px`, color: iconColor || 'inherit' }"
        :size="props.iconSize"
        >{{ props.buttonIcon }}</v-icon
      >
      {{ buttonText }}
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
@use 'styles/main' as *;

.action-text-button {
  border: 1px solid var(--alternate);
  box-shadow: $shadow;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}

.action-icon-button {
  padding: 15px;
  box-shadow: $shadow;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}

.action-icon-text-button {
  display: flex;
  align-items: center;
  // border: 1px solid var(--alternate);
  box-shadow: $shadow;
  font-size: 14px !important;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;

  .v-icon {
    margin-right: 5px;
  }
}

.v-btn {
  padding: 10px 12px !important;
}
</style>
