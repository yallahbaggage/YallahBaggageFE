<template>
    <v-icon
      :style="{ color: computedIcon.color, fontSize: '25px', width: '30px', height: '30px' }"
      class="status-icon"
    >
      {{ computedIcon.icon }}
    </v-icon>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  //NOTE: Props
  const props = defineProps({
    status: {
      type: String,
      required: true,
    },
  });
  
  //NOTE: Icon mapping logic
  const statusIconMap: Record<string, { icon: string; color: string }> = {
    NEW_ENTITY: { icon: 'mdi-new-box', color: 'orange' },
    PENDING: { icon: 'mdi-clock-outline', color: 'yellow' },
    PROCESSING: { icon: 'mdi-phone-in-talk', color: 'blue' },
    SUCCESS: { icon: 'mdi-check-circle', color: 'green' },
    FAILED: { icon: 'mdi-cancel', color: 'red' },
    PROMISE: { icon: 'mdi-handshake', color: 'green' },
    RESTRUCTURE: { icon: 'mdi-account-tree', color: 'green' },
    SCHEDULE: { icon: 'mdi-calendar-clock', color: 'blue' },
    EXCEPTIONAL: { icon: 'mdi-alert-circle', color: 'purple' },
    CONTROL: { icon: 'mdi-checkbox-marked-circle-outline', color: 'green' },
    NO_INTERVIEW: { icon: 'mdi-phone-off', color: 'red' },
    YES_INTERVIEW: { icon: 'mdi-phone', color: 'green' },
    ESCALATION: { icon: 'mdi-arrow-up-bold', color: 'orange' },
    CALL_SUCCESS: { icon: 'mdi-phone-outline', color: 'green' },
    CALL_FAILED: { icon: 'mdi-alert-outline', color: 'red' },
  };
  
  const defaultIcon = { icon: 'mdi-help-circle-outline', color: 'grey' };
  
  //INFO Compute the icon and color based on the status prop
  const computedIcon = computed(() => {
    return statusIconMap[props.status] || defaultIcon;
  });
  </script>
  
  <style scoped>
  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
  }
  </style>
  