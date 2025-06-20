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

    <div class="main-section-title">MAIN</div>

    <v-list dense nav bg-color="white" class="menu">
      <!-- Transfers -->
      <router-link role="button" to="/transfers" class="menu-link" active-class="active">
        <div class="menu-item" :class="{ active: isActiveLink('/transfers') }">
          <div class="menu-item-name">
            <v-icon class="icon">mdi-swap-horizontal</v-icon>
            {{ t('transfers') }}
          </div>
          <v-chip class="menu-chip" size="small" color="#FF5B5B" text-color="white">9+</v-chip>
        </div>
      </router-link>
      <!-- Employees -->
      <router-link role="button" to="/employees" class="menu-link" active-class="active">
        <div class="menu-item" :class="{ active: isActiveLink('/employees') }">
          <div class="menu-item-name">
            <v-icon class="icon">mdi-account-group</v-icon>
            {{ t('employees') }}
          </div>
        </div>
      </router-link>
      <!-- App Management (Accordion) -->
      <v-list-item>
        <button
          role="button"
          class="accordion-header"
          @click="isManagementMenuOpen = !isManagementMenuOpen"
        >
          <div class="settings-container">
            <v-icon class="icon">mdi-file-cog-outline</v-icon>
            {{ t('appManagement') }}
          </div>
          <v-icon class="accordion-icon">
            {{ isManagementMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </button>
        <v-list dense nav bg-color="white" v-if="isManagementMenuOpen" class="submenu">
          <router-link role="button" to="/banners" class="menu-link" active-class="active">
            <v-list-item class="menu-item" :class="{ active: isActiveLink('/banners') }">
              <div class="menu-item-name">
                <img src="@/assets/images/banner.svg" />
                <span>{{ t('banners') }}</span>
              </div>
            </v-list-item>
          </router-link>
          <router-link role="button" to="/notifications" class="menu-link" active-class="active">
            <v-list-item class="menu-item" :class="{ active: isActiveLink('/notifications') }">
              <div class="menu-item-name">
                <v-icon class="icon">mdi-bell-outline</v-icon>
                {{ t('notifications') }}
              </div>
            </v-list-item>
          </router-link>
        </v-list>
      </v-list-item>

      <!-- Customer Support -->
      <router-link role="button" to="/customer-support" class="menu-link" active-class="active">
        <div class="menu-item" :class="{ active: isActiveLink('/customer-support') }">
          <div class="menu-item-name">
            <v-icon class="icon">mdi-headphones</v-icon>
            {{ t('customerSupport') }}
          </div>
          <v-chip class="menu-chip" size="small" color="#FF5B5B" text-color="white">2</v-chip>
        </div>
      </router-link>
    </v-list>

    <hr color="lightgray" />
    <!-- Bottom Section: Theme Toggle & Language Switch -->
    <!-- <div class="bottom-actions"> -->
    <!-- <v-btn class="bottom-btn" color="primary" centered accent @click="toggleTheme()">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn> -->
    <!-- </div> -->

    <!-- User Profile Section -->
    <div class="user-profile">
      <v-icon class="user-icon">mdi-account-circle</v-icon>
      <div>
        <span class="username">{{ user?.name || 'Loading...' }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          class="username-verified-icon"
        >
          <path
            d="M8.75456 3.81498C7.87858 3.53141 6.92631 3.92585 6.50741 4.74578L6.00379 5.73151C5.94396 5.84864 5.8487 5.9439 5.73158 6.00373L4.74584 6.50735C3.92591 6.92625 3.53147 7.87852 3.81504 8.7545L4.15595 9.80762C4.19646 9.93275 4.19646 10.0675 4.15595 10.1926L3.81504 11.2457C3.53147 12.1217 3.92591 13.074 4.74584 13.4929L5.73158 13.9965C5.8487 14.0564 5.94396 14.1516 6.00379 14.2687L6.50741 15.2545C6.92631 16.0744 7.87858 16.4689 8.75456 16.1853L9.80768 15.8444C9.93281 15.8039 10.0676 15.8039 10.1927 15.8444L11.2458 16.1853C12.1218 16.4689 13.0741 16.0744 13.493 15.2545L13.9966 14.2687C14.0564 14.1516 14.1517 14.0564 14.2688 13.9965L15.2546 13.4929C16.0745 13.074 16.4689 12.1217 16.1854 11.2457L15.8444 10.1926C15.8039 10.0675 15.8039 9.93275 15.8444 9.80762L16.1854 8.7545C16.4689 7.87852 16.0745 6.92625 15.2546 6.50735L14.2688 6.00373C14.1517 5.9439 14.0564 5.84864 13.9966 5.73151L13.493 4.74578C13.0741 3.92585 12.1218 3.53141 11.2458 3.81498L10.1927 4.15589C10.0676 4.19639 9.93281 4.1964 9.80768 4.15589L8.75456 3.81498ZM6.72504 9.84843L7.60893 8.9645L9.37668 10.7323L12.9122 7.19678L13.7961 8.08066L9.37668 12.5001L6.72504 9.84843Z"
            fill="#47C2FF"
          />
        </svg>
        <v-menu location="bottom right" offset="4">
          <template #activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              variant="text"
              density="comfortable"
            >
              <v-icon class="user-profile-arrow">mdi-chevron-right</v-icon>
            </v-btn>
          </template>
          <v-list class="menu-list pa-0 ma-0">
            <v-list-item  class="logout-item" @click="authStore.resetAuthState()">
              <div class="menu-item-name">
                <v-icon class="icon"> mdi-logout</v-icon>
                {{ t('logout') }}
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
        <p class="user-email text-style">{{ user?.email || '' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue3-i18n'

// import { useThemeStore } from '@/stores/modules/theme'
const { t } = useI18n()

import { useAuthStore } from '@/stores/modules/authStore'

// const themeStore = useThemeStore()
const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isManagementMenuOpen = ref(false)

watchEffect(async () => {
  if (!user.value) {
    await authStore.fetchUserData()
  }
})

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
    path: '/customer-support',
    icon: 'mdi-headphones',
    hasChip: true,
    chipCount: '2',
  },
])

// const toggleTheme = () => {
//   themeStore.toggleTheme()
// }

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
    color: rgb(var(--v-theme-black));
  }
  .logo-subtitle {
    font-size: 12px;
    color: #9e9e9e;
  }
}

.menu-item-name {
  display: flex;
  align-items: center;
}

.main-section-title {
  font-size: 12px;
  color: #bdbdbd;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 16px;
  letter-spacing: 1px;
  font-weight: 600;
}

.sidebar {
  height: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 0 10px 10px 0;
  color: rgb(var(--v-theme-black));
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  width: 272px;
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
  // height: 100%;
  margin: 16px 0;
  flex-grow: 1;
  gap: 4px;
}

.menu-item,
.logout-item {
  &:hover {
    background-color: #f6fafd !important;
  }
  margin-bottom: 2px;
}

.menu-link,
.logout-link {
  font-size: $normalSize !important;
  color: inherit;
  text-decoration: none;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: $normalSize !important;
  gap: 24px;
  cursor: pointer;
  justify-content: space-between;
  transition: background 0.15s;
  margin-bottom: 2px;

  img {
    width: 24px;
    height: 24px;
  }
}

.active {
  font-weight: $font-weight-bold;
  background-color: #f6fafd !important;
  border-radius: 10px;
}

.icon {
  font-size: $middle !important;
  color: inherit;
}

.menu-chip {
  background-color: #ff5b5b !important;
  color: white !important;
  font-weight: bold;
  font-size: 10px;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.submenu {
  border-radius: 8px;
  margin-left: 8px;
  margin-top: 4px;
  padding: 0 0 0 8px;
  box-shadow: none;
}

.submenu-link {
  text-decoration: none;
}

.user-profile {
  display: flex;
  align-items: center;
  flex-direction: row;
  color: rgb(var(--v-theme-white));
  margin-top: 15px;

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
    color: rgb(var(--v-theme-black));
    margin-left: 10px;
  }

  .username-verified-icon {
    font-size: 16px;
    margin-left: 5px;
    vertical-align: middle; /* Align with text */
    color: rgb(var(--v-theme-primary)); /* Green color for verified icon */
  }

  .user-email {
    font-size: 12px;
    color: #9e9e9e;
    width: 100%; /* Take full width on a new line */
    margin-left: 10px; /* Align with username */
  }

  .user-profile-arrow {
    position: absolute;
    right: 16px;
    color: #9e9e9e;
    margin-top: 15px;
  }
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: $normalSize !important;
  // font-weight: 600;
  text-transform: uppercase;
  width: 100%;
  cursor: pointer;
  background: none;
  border: none;
  color: inherit;
  padding: 16px;
}
</style>
