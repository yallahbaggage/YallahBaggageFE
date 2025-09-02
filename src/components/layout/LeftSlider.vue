<template>
  <div 
    class="sidebar" 
    :class="{ collapsed: isCollapsed }"
    >
    <!-- @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave" -->
    <!-- Toggle Button -->
    <div class="sidebar-header">
      <router-link
        v-if="!isCollapsed"
        role="button"
        to="/"
        class="menu-link header-link"
        active-class="active"
      >
        <div class="header-logo">
          <img class="logo-img" src="@/assets/images/logo.svg" alt="" />
          <div>
            <h1 class="logo-title">Yalla Baggage</h1>
            <h2 class="logo-subtitle">Superadmin Panel</h2>
          </div>
        </div>
      </router-link>
             <button class="toggle-btn" @click="toggleSidebar" :class="{ 'no-border': isCollapsed }">
         <img
           v-if="isCollapsed"
           class="logo-img-collapsed"
           src="@/assets/images/logo.svg"
           alt="Yalla Baggage"
         />
         <v-icon size="20" v-else>mdi-swap-vertical</v-icon>
       </button>
    </div>

    <div v-if="!isCollapsed" class="main-section-title">MAIN</div>

    <v-list dense nav bg-color="white" class="menu">
      <!-- Transfers -->
      <router-link role="button" to="/transfers" class="menu-link" active-class="active">
        <div
          class="menu-item"
          :class="{ active: isActiveLink('/transfers'), 'collapsed-item': isCollapsed }"
        >
          <div class="menu-item-name">
            <v-icon :color="isActiveLink('/transfers') ? 'primary' : ''" class="icon"
              >mdi-swap-horizontal</v-icon
            >
            <span v-if="!isCollapsed">{{ t('transfers') }}</span>
          </div>
          <v-chip
            v-if="!isCollapsed && todaysTransfers !== null && todaysTransfers > 0"
            class="menu-chip"
            size="small"
            color="#FF5B5B"
            text-color="white"
            >{{ todaysTransfers > 9 ? '+9' : todaysTransfers }}</v-chip
          >
        </div>
      </router-link>
      <!-- drivers -->
      <router-link role="button" to="/drivers" class="menu-link" active-class="active">
        <div
          class="menu-item"
          :class="{ active: isActiveLink('/drivers'), 'collapsed-item': isCollapsed }"
        >
          <div class="menu-item-name">
            <img
              src="@/assets/images/users.svg"
              :class="{ 'svg-blue': isActiveLink('/drivers') }"
              style="width: 20px; height: 20px"
            />
            <span v-if="!isCollapsed">{{ t('drivers') }}</span>
          </div>
        </div>
      </router-link>
      <!-- App Management (Accordion when expanded, individual items when collapsed) -->
      <v-list-item v-if="!isCollapsed">
        <button
          role="button"
          class="accordion-header"
          @click="isManagementMenuOpen = !isManagementMenuOpen"
        >
          <div class="settings-container">
            <img
              :class="{ 'svg-blue': isManagementMenuOpen }"
              src="@/assets/images/app-management.svg"
            />
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
                <img
                  src="@/assets/images/banner.svg"
                  :class="{ 'svg-blue': isActiveLink('/banners') }"
                  class="link-icon"
                />
                <span>{{ t('banners') }}</span>
              </div>
            </v-list-item>
          </router-link>
          <router-link role="button" to="/notifications" class="menu-link" active-class="active">
            <v-list-item class="menu-item" :class="{ active: isActiveLink('/notifications') }">
              <div class="menu-item-name">
                <v-icon :color="isActiveLink('/notifications') ? 'primary' : ''" class="icon"
                  >mdi-bell-outline</v-icon
                >
                {{ t('notifications') }}
              </div>
            </v-list-item>
          </router-link>
        </v-list>
      </v-list-item>

      <!-- App Management items when collapsed (individual menu items) -->
      <template v-if="isCollapsed">
        <!-- Banners -->
        <router-link role="button" to="/banners" class="menu-link" active-class="active">
          <div
            class="menu-item"
            :class="{ active: isActiveLink('/banners'), 'collapsed-item': isCollapsed }"
          >
            <div class="menu-item-name">
              <img
                src="@/assets/images/banner.svg"
                :class="{ 'svg-blue': isActiveLink('/banners') }"
                style="width: 20px; height: 20px"
              />
              <span v-if="!isCollapsed">{{ t('banners') }}</span>
            </div>
          </div>
        </router-link>
        <!-- Notifications -->
        <router-link role="button" to="/notifications" class="menu-link" active-class="active">
          <div
            class="menu-item"
            :class="{ active: isActiveLink('/notifications'), 'collapsed-item': isCollapsed }"
          >
            <div class="menu-item-name">
              <v-icon :color="isActiveLink('/notifications') ? 'primary' : ''" class="icon"
                >mdi-bell-outline</v-icon
              >
              <span v-if="!isCollapsed">{{ t('notifications') }}</span>
            </div>
          </div>
        </router-link>
      </template>

      <!-- Customer Support -->
      <router-link role="button" to="/customer-support" class="menu-link" active-class="active">
        <div
          class="menu-item"
          :class="{ active: isActiveLink('/customer-support'), 'collapsed-item': isCollapsed }"
        >
          <div class="menu-item-name">
            <v-icon :color="isActiveLink('/customer-support') ? 'primary' : ''" class="icon"
              >mdi-headphones</v-icon
            >
            <span v-if="!isCollapsed">{{ t('customerSupport') }}</span>
          </div>
          <v-chip
            v-if="!isCollapsed && todaysOpenComplaints !== null && todaysOpenComplaints > 0"
            class="menu-chip"
            size="small"
            color="#FF5B5B"
            text-color="white"
            >{{ todaysOpenComplaints > 9 ? '+9' : todaysOpenComplaints }}</v-chip
          >
        </div>
      </router-link>
    </v-list>

    <hr class="lightgray" />
    <!-- Bottom Section: Theme Toggle & Language Switch -->
    <!-- <div class="bottom-actions"> -->
    <!-- <v-btn class="bottom-btn" color="primary" centered accent @click="toggleTheme()">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn> -->
    <!-- </div> -->

    <!-- User Profile Section -->
    <div class="user-profile" :class="{ collapsed: isCollapsed }">
      <v-icon size="40" class="user-icon">mdi-account-circle</v-icon>
      <div v-if="!isCollapsed">
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
            <v-btn icon v-bind="props" variant="text" density="comfortable">
              <v-icon class="user-profile-arrow">mdi-chevron-right</v-icon>
            </v-btn>
          </template>
          <v-list class="menu-list pa-0 ma-0">
            <v-list-item class="logout-item" @click="authStore.resetAuthState()">
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
import { computed, ref, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue3-i18n'

// import { useThemeStore } from '@/stores/modules/theme'
const { t } = useI18n()

import { useAuthStore } from '@/stores/modules/authStore'
import { useComplaintsStore } from '@/stores/modules/complaints'
import { useTransfersStore } from '@/stores/modules/transfer'

// const themeStore = useThemeStore()
const route = useRoute()
const authStore = useAuthStore()
const complaintsStore = useComplaintsStore()
const transfersStore = useTransfersStore()

const user = computed(() => authStore.user)
const isManagementMenuOpen = ref(false)
const isCollapsed = ref(false)
let statsInterval: NodeJS.Timeout | null = null

// Define emit
const emit = defineEmits<{
  'toggle-sidebar': [collapsed: boolean]
}>()

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  // Close management menu when collapsing
  if (isCollapsed.value) {
    isManagementMenuOpen.value = false
  }
  // Emit the toggle event to parent
  emit('toggle-sidebar', isCollapsed.value)
}

// const handleMouseEnter = () => {
//   console.log('Mouse enter - isCollapsed:', isCollapsed.value)
//   if (isCollapsed.value) {
//     // Expand sidebar on hover (same as clicking toggle)
//     toggleSidebar()
//   }
// }

// const handleMouseLeave = () => {
//   console.log('Mouse leave - isCollapsed:', isCollapsed.value)
//   if (!isCollapsed.value) {
//     // Collapse sidebar when mouse leaves (same as clicking toggle)
//     toggleSidebar()
//   }
// }

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
  },
  {
    name: t('drivers'),
    path: '/drivers',
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
  },
])

const isActiveLink = (path: string) => route.path === path

const todaysOpenComplaints = computed(() => {
  // Try multiple possible paths for robustness
  let value: number | null | undefined = complaintsStore.stats?.todaysOpenComplaints
  if (typeof value !== 'number') {
    value = complaintsStore.stats?.data?.todaysOpenComplaints
  }

  return typeof value === 'number' ? value : null
})

const todaysTransfers = computed(() => {
  // Try multiple possible paths for robustness
  let value: number | null | undefined = transfersStore.stats?.todaysTransfers
  if (typeof value !== 'number') {
    value = transfersStore.stats?.data?.todaysTransfers
  }

  return typeof value === 'number' ? value : null
})

// Fetch stats on component mount
const fetchStats = async () => {
  try {
    await Promise.all([
      //  complaintsStore.getComplaintsStatsPage(),
      //  transfersStore.getTransfersStats(),
    ])
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

onMounted(async () => {
  // Initial fetch
  await fetchStats()

  // Set up periodic refresh every 5 minutes
  statsInterval = setInterval(fetchStats, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (statsInterval) {
    clearInterval(statsInterval)
    statsInterval = null
  }
})
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.settings-container {
  display: flex;
  gap: 10px !important;
  text-transform: capitalize;
  color: #5c5c5c;
}

.lightgray {
  color: #ebebeb;
  border-color: #ebebeb;
  background-color: #ebebeb;
  height: 1px;
  border: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  .toggle-btn {
    background: none;
    border: 1px solid #ebebeb;
    cursor: pointer;
    padding: 4px;
    border-radius: 8px;
    color: #5c5c5c;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f7f7f7;
      color: rgb(var(--v-theme-primary));
    }

    .v-icon {
      font-size: 24px;
    }

    .logo-img-collapsed {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }

    /* Conditional border styling */
    &.no-border {
      border: none;
    }
  }

  .header-link {
    flex: 1;
  }
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;

  .logo-img {
    width: 40px;
    height: 40px;
  }
  .logo-title {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
    letter-spacing: -0.084px;
    font-family: 'Inter Variable', Inter, system-ui, sans-serif;
    color: rgb(var(--v-theme-black));
  }
  .logo-subtitle {
    font-size: 12px;
    color: #5c5c5c;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
  }
}

.menu-item-name {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px !important;
}

.main-section-title {
  font-size: 12px;
  color: #a3a3a3;
  margin-top: 48px;

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
  border-right: 1px solid #ebebeb;
  max-width: 272px;
  width: 100%;
  transition: all 0.3s ease;
  overflow: hidden;

  // RTL Support
  [dir='rtl'] & {
    border-radius: 10px 0 0 10px;
    border-right: none;
    border-left: 1px solid #e0e0e0;
  }

  &.collapsed {
    max-width: 80px;
    width: 80px;
    padding: 20px 10px;

    .main-section-title {
      display: none;
    }

    .menu {
      align-items: center;

      .menu-link {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }

  .v-list-item--density-default.v-list-item--one-line {
    min-height: 36px !important;
  }
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

  margin: 16px 0;
  flex-grow: 1;
  gap: 4px;
}

.menu-item,
.logout-item {
  &:hover {
    background-color: #f7f7f7 !important;
  }
  margin-bottom: 2px;
  transition: all 0.2s ease;
  height: 36px !important;
}

.menu-link,
.logout-link {
  font-size: $normalSize !important;
  text-decoration: none;
  color: #5c5c5c;
}

.menu-item {
  display: flex;
  align-items: center;

  padding: 8px 12px;
  border-radius: 8px;
  font-size: $normalSize !important;
  gap: 8px;
  cursor: pointer;
  justify-content: space-between;
  transition: background 0.15s;
  margin-bottom: 2px;
  height: 36px;

  img {
    width: 24px;
    height: 24px;
  }
}

.active {
  background-color: #f7f7f7 !important;
  border-radius: 10px;
  color: black;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.084px;
}

.icon {
  font-size: $large !important;
  color: inherit;
}

.menu-chip {
  background-color: #ff5b5b !important;
  color: white !important;
  font-size: 10px !important;
  border-radius: 50% !important;
  width: 19px !important;
  height: 19px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-style: normal;
  font-weight: 500;
  line-height: 12px; /* 109.091% */
  letter-spacing: 0.22px;
  text-transform: uppercase;
}

.submenu {
  border-radius: 8px;
  margin-left: 8px;
  margin-top: 4px;
  padding: 0 0 0 8px;
  box-shadow: none;

  // RTL Support
  [dir='rtl'] & {
    margin-left: 0;
    margin-right: 8px;
    padding: 0 8px 0 0;
  }
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
  height: 50px;

  .user-icon {
    height: 40px;
    width: 40px;
    color: #bbdefb; /* Light blue color for the icon */
    background-color: #e3f2fd; /* Lighter blue background for the icon */
    border-radius: 50%;
    padding: 5px;
    margin-top: auto;
  }

  .username {
    color: rgb(var(--v-theme-black));
    margin-left: 10px;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
    letter-spacing: -0.084px;
    // RTL Support
    [dir='rtl'] & {
      margin-left: 0;
      margin-right: 10px;
    }
  }

  .username-verified-icon {
    font-size: 12px;
    margin-left: 5px;
    vertical-align: middle; /* Align with text */
    color: rgb(var(--v-theme-primary)); /* Green color for verified icon */

    // RTL Support
    [dir='rtl'] & {
      margin-left: 0;
      margin-right: 5px;
    }
  }

  .user-email {
    color: #5c5c5c;
    width: 100%; /* Take full width on a new line */
    margin-left: 10px; /* Align with username */
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    // RTL Support
    [dir='rtl'] & {
      margin-left: 0;
      margin-right: 10px;
    }
  }

  .user-profile-arrow {
    position: absolute;
    right: -36px;
    color: #9e9e9e;
    margin-top: 25px;

    // RTL Support
    [dir='rtl'] & {
      right: auto;
      left: -36px;
    }
  }
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: $normalSize !important;
  text-transform: uppercase;
  width: 100%;
  cursor: pointer;
  background: none;
  border: none;
  color: inherit;
  padding: 16px;
  height: 36px;
}

.link-logo {
  width: 20px;
  height: 20px;
}

.svg-blue {
  filter: brightness(0) saturate(100%) invert(36%) sepia(100%) saturate(2480%) hue-rotate(225deg)
    brightness(101%) contrast(103%);
}

/* Collapsed menu item styles */
.menu-item.collapsed-item {
  justify-content: center;
  padding: 8px;

  .menu-item-name {
    justify-content: center;
    width: 100%;
    gap: 0;

    span {
      display: none;
    }

    .icon,
    img {
      margin: 0;
      width: 24px;
      height: 24px;
    }
  }
}

/* Collapsed user profile styles */
.user-profile.collapsed {
  justify-content: center;
  padding: 0;

  .user-icon {
    margin: 0;
  }

  div {
    display: none;
  }
}
</style>
