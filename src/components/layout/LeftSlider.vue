<template>
  <div class="sidebar">
    <router-link role="button" to="/" class="menu-link" active-class="active">
      <div class="header-logo">
        <img class="logo-img" src="@/assets/images/logo.svg" alt="" />
        <div>
          <h1 class="logo-title">Yalla Baggage</h1>
          <h2 class="logo-subtitle">Superadmin Panel</h2>
        </div>
      </div>
    </router-link>
    <hr />

    <div class="main-section-title">MAIN</div>

    <v-list dense nav bg-color="black" class="menu">
      <template v-if="links.length > 0">
        <router-link
          role="button"
          :to="link.path"
          class="menu-link"
          active-class="active"
          v-for="link in links"
          :key="link.name"
        >
          <v-list-item class="menu-item" :class="{ active: isActiveLink(link.path) }">
            <v-icon class="icon">
              {{ link.icon }}
            </v-icon>
            {{ link.name }}
            <v-chip
              v-if="link.hasChip"
              class="new-transfer-chip"
              size="small"
              color="#FF5B5B"
              >{{ link.chipCount }}</v-chip
            >
          </v-list-item>
        </router-link>
      </template>
    </v-list>

    <hr/>
    <!-- Bottom Section: Theme Toggle & Language Switch -->
    <div class="bottom-actions">
      <!-- <v-btn class="bottom-btn" color="primary" centered accent @click="toggleTheme()">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn> -->
    </div>

    <!-- User Profile Section -->
    <div class="user-profile">
      <v-icon class="user-icon">mdi-account-circle</v-icon>
      <span class="username">Arthur Taylor</span>
      <v-icon class="username-verified-icon">mdi-check-circle</v-icon>
      <span class="user-email">arthur@yalla.com</span>
      <v-icon class="user-profile-arrow">mdi-chevron-right</v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue3-i18n'
import { useThemeStore } from '@/stores/modules/theme'
const { t } = useI18n()

import { useAuthStore } from '@/stores/modules/authStore'

const themeStore = useThemeStore()
const route = useRoute()
const authStore = useAuthStore()

const links = computed(() => [
  {
    name: t('transfers'),
    path: '/transfers',
    icon: 'mdi-swap-horizontal',
    hasChip: true,
    chipCount: '9+',
  },
  {
    name: t('employees'),
    path: '/employees',
    icon: 'mdi-account-group',
  },
  {
    name: t('appManagement'),
    path: '/app-management',
    icon: 'mdi-file-cog-outline',
  },
  {
    name: t('customerSupport'),
    path: '/complaints',
    icon: 'mdi-headphones',
    hasChip: true,
    chipCount: '2',
  },
]);

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const isActiveLink = (path: string) => route.path === path
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.settings-container {
  gap: 3px !important;
  text-transform: capitalize;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0;
  margin-bottom: 20px;
  .logo-img {
    width: 40px;
    height: 40px;
  }
  .logo-title {
    font-size: 18px;
    font-weight: bold;
    color: rgb(var(--v-theme-white));
  }
  .logo-subtitle {
    font-size: 12px;
    color: #9e9e9e;
  }
}

.main-section-title {
  font-size: 12px;
  color: #9e9e9e;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 16px;
}

.sidebar {
  height: 100%;
  background-color: rgb(var(--v-theme-black));
  padding: 20px;
  border-radius: 0 10px 10px 0;
  color: rgb(var(--v-theme-white));
  display: flex;
  flex-direction: column;
}

li {
  list-style: none;
}

.logo {
  width: auto;
  margin-bottom: 10px;
}

.menu {
  display: flex;
  flex-direction: column;
  height: 100%; /* Adjust to take available space */
  margin: 16px 0;
  flex-grow: 1; /* Allow menu to grow and push user-profile to bottom */
}

.menu-item,
.logout-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  font-size: $normalSize !important;
  gap: $x-small !important;
  cursor: pointer;
  position: relative; /* For chip positioning */

  &:hover {
    background-color: rgb(var(--v-theme-primary)) !important;
    font-weight: $font-weight-bold;
  }
}

.menu-link,
.logout-link {
  font-size: $normalSize !important;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
}

.active {
  font-weight: $font-weight-bold;
  background-color: rgb(var(--v-theme-primary)) !important;
  border-radius: 10px;
}

.icon {
  font-size: $middle !important;
  color: inherit;
}

.new-transfer-chip {
  margin-left: auto;
  font-weight: bold;
  font-size: 10px;
}

.selected-lang {
  font-weight: 700;
  color: #1844e4;
}

.v-list-item-title {
  cursor: pointer;
}

.bottom-separator {
  margin: 16px 0;
  border: none;
  height: 1px;
}

.bottom-actions {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 10px;
  padding: 16px 0 0;
}

.bottom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  text-transform: capitalize;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  color: rgb(var(--v-theme-white));
  flex-wrap: wrap; /* Allow items to wrap on smaller screens */
  position: relative;
  margin-top: auto; /* Push to the bottom */

  .user-icon {
    font-size: 48px;
    color: #bbdefb; /* Light blue color for the icon */
    background-color: #e3f2fd; /* Lighter blue background for the icon */
    border-radius: 50%;
    padding: 5px;
  }

  .username {
    font-size: 16px;
    font-weight: 600;
    color: rgb(var(--v-theme-white));
    margin-left: 10px;
  }

  .username-verified-icon {
    font-size: 16px;
    color: #4caf50; /* Green color for verified icon */
  }

  .user-email {
    font-size: 12px;
    color: #9e9e9e;
    width: 100%; /* Take full width on a new line */
    margin-left: 58px; /* Align with username */
  }

  .user-profile-arrow {
    position: absolute;
    right: 16px;
    color: #9e9e9e;
  }
}
</style>
