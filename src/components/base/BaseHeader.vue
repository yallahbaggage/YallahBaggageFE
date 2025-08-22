<template>
  <div class="base-header">
    <div class="header-left-content">
      <div class="page-icon-wrapper" v-if="pageIcon">
        <v-icon size="24">{{ pageIcon }}</v-icon>
      </div>
      <div class="page-icon-wrapper" v-if="pageImage">
        <img width="24" height="24" class="logo-img" :src="pageImage"/>
      </div>

      <div class="page-text-content">
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-description">{{ desc }}</p>
      </div>
    </div>
    <div class="header-right-content">
      <!-- <v-icon class="action-icon">mdi-magnify</v-icon> -->
      <router-link
        v-if="!hideIconIfPageRouteNotification"
        role="button"
        to="/notifications"
        class="menu-link"
        active-class="active"
      >
        <v-icon size="20" class="action-icon">mdi-bell-outline</v-icon>
      </router-link>
      <template v-if="props.showButton">
        <ActionButton
          :button-text="props.buttonText"
          button-color="primary"
          icon-color="white"
          button-icon="mdi-plus"
          button-bg-color="primary"
          :onButtonPressed="onButtonPressed"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import ActionButton from './ActionButton.vue'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  pageIcon: {
    type: String,
    default: '',
  },
  showButton: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: '',
  },
  pageImage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['button-pressed', 'icon-pressed'])

const onButtonPressed = () => {
  emit('button-pressed')
}

const route = useRoute()

const hideIconIfPageRouteNotification = computed(() => route.path === '/notifications')
</script>
<style scoped lang="scss">
@use 'styles/main' as *;

.base-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 12px 10px;
  background-color: #ffffff;
  // border-radius: $x-small;
  // margin-bottom: 12px;
  width: 100%;
  height: 88px; /* Adjusted height to match the image */
  border-bottom: 1px solid #EBEBEB;
}

.header-left-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  .v-icon {
    color: #4a4a4a; // Adjust icon color as needed
    font-size: 24px; // Adjust icon size
    
  }
}

.page-title {
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.27px;
}

.page-description {
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.084px;
  color: #5c5c5c;
}

.header-right-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-icon {
  font-size: 24px;
  color: #4a4a4a;
  cursor: pointer;
}

.new-employee-button {
  background-color: #2a4ff6 !important;
  color: #ffffff !important;
  border-radius: 8px; // Rounded corners for button
  text-transform: capitalize; // Ensure text is capitalized as in image
  padding: 0 16px; // Adjust padding to match image
  height: 40px; // Standard height for Vuetify buttons

  font-size: 14px; // Font size for button text
  font-weight: 500; // Font weight for button text
  .v-icon {
    margin-right: 8px; // Space between icon and text
  }
}
</style>
