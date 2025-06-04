<template>
  <div class="sidebar">
    <router-link role="button" to="/" class="menu-link" active-class="active">
      <v-img :src="ica_logo_100" class="logo" alt="Logo" contain />
    </router-link>
    <hr />

    <v-list dense nav bg-color="black" class="menu">
      <template v-if="links.length > 0">
        <router-link role="button" :to="links[0].path" class="menu-link" active-class="active">
          <v-list-item class="menu-item" :class="{ active: isActiveLink(links[0].path) }">
            <v-icon class="icon">
              {{ links[0].icon }}
            </v-icon>
            {{ links[0].name }}
          </v-list-item>
        </router-link>

        <!-- Management Section -->
        <v-list-item>
          <button role="button" class="accordion-header" @click="toggleManagement">
            <div class="settings-container">
              <v-icon class="icon"> mdi-cog </v-icon>
              {{ t('management') }}
            </div>
            <v-icon class="accordion-icon">
              {{ isManagementOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </button>
          <v-list
            dense
            nav
            bg-color="black"
            v-if="isManagementOpen"
            class="submenu"
            v-for="(link, index) in links.slice(1)"
            :key="link.name"
          >
            <router-link role="button" :aria-lable="link.path" :to="link.path" class="submenu-link" active-class="active">
              <v-list-item class="submenu-item" :class="{ active: isActiveLink(link.path) }">
                <v-icon class="icon"> {{ link.icon }} </v-icon>
                {{ link.name }}
              </v-list-item>
            </router-link>
          </v-list>
        </v-list-item>

        <!-- Reports Section -->
        <v-list-item>
          <button role="button" class="accordion-header" @click="toggleReportsMenu">
            <div class="settings-container">
              <v-icon class="icon"> mdi-chart-bar </v-icon>
              {{ t('reports') }}
            </div>
            <v-icon class="accordion-icon">
              {{ isReportsMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </button>
          <v-list
            dense
            nav
            bg-color="black"
            v-if="isReportsMenuOpen"
            class="submenu"
          >
            <router-link role="button" aria-lable="/report1'" to="/report1'" class="submenu-link" active-class="active"> 
              <v-list-item class="submenu-item" :class="{ active: isActiveLink('/report1') }">
                <v-icon class="icon"> mdi-chart-bar </v-icon>
                {{ t('reports') }}
              </v-list-item>
            </router-link>
          </v-list>
        </v-list-item>
      
        <router-link role="button" to="/login" class="logout-link" @click="authStore.logout()">
          <v-list-item class="logout-item" v-if="links.length > 0">
            <v-icon class="icon"> mdi-logout</v-icon>
            {{ t('logout') }}
          </v-list-item>
        </router-link>
      </template>
    </v-list>

    <hr/>
    <!-- Bottom Section: Theme Toggle & Language Switch -->
    <div class="bottom-actions">
      <v-btn class="bottom-btn" color="primary" centered accent @click="toggleTheme()">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="primary" class="bottom-btn" v-bind="props">
            <v-icon>mdi-translate</v-icon>
            {{ selectedLanguage ?? t('languages') }}
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in languages" :key="index" @click="changeLanguage(item.value)" :disabled="selectedLanguage === item.value">
            <v-list-item-title  :class="{ 'selected-lang': selectedLanguage === item.value }">
              {{ item.label }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue3-i18n'
import ica_logo_100 from '@/assets/images/ica_logo_100.png'
import { useThemeStore } from '@/stores/modules/theme'
import { useLocale } from 'vuetify'
import { useAuthStore } from '@/stores/modules/authStore'

const { setLocale, getLocale, t } = useI18n()
const selectedLanguage = ref(localStorage.getItem('lang') || getLocale())
const languages = [
  { label: 'English', value: 'en' },
  { label: 'Türkçe', value: 'tr' },
]
const { current } = useLocale()
const changeLanguage = (selectedValue: string) => {
  setLocale(selectedValue)
  const selectedLang = languages.find((lang) => lang.value === selectedValue)

  selectedLanguage.value = selectedLang?.value ?? 'en'
  localStorage.setItem('lang', selectedValue)
  current.value = selectedValue
  window.location.reload()
}
const themeStore = useThemeStore()
const route = useRoute()
const authStore = useAuthStore()

const links = computed(() => [

  {
    name: t('users'),
    path: '/users',
    icon: 'mdi-account-multiple',
  },

])

const isManagementOpen = ref(false)

const toggleManagement = () => {
  isManagementOpen.value = !isManagementOpen.value
}

const isReportsMenuOpen = ref(false)

const toggleReportsMenu = () => {
  isReportsMenuOpen.value = !isReportsMenuOpen.value
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const isActiveLink = (path: string) => route.path === path

onMounted(() => {
  const settingsLinks = links.value.slice(1)
  if (settingsLinks.some((link) => isActiveLink(link.path))) {
    isManagementOpen.value = true
  }
})
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.settings-container {
  gap: 3px !important;
  text-transform: capitalize;
}

.sidebar {
  height: 100%;
  background-color: rgb(var(--v-theme-black));
  padding: 20px;
  border-radius: 0 10px 10px 0;
  color: rgb(var(--v-theme-white));
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
  height: 100%;
  margin: 16px 0;
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

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: $normalSize !important;
  font-weight: 600;
  text-transform: uppercase;
  width: 100%;
  cursor: pointer;
  background: none;
  border: none;
  color: inherit;
  padding: 16px;
}

.icon {
  font-size: $middle !important;
  color: inherit;
}

.accordion-icon {
  font-size: $middle !important;
}

.submenu {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  gap: $x-small !important;
  cursor: pointer;
  font-size: $normalSize !important;

  &:hover {
    background-color: rgb(var(--v-theme-primary)) !important;
    font-weight: $font-weight-bold;
  }
}

.submenu-link {
  margin-left: 12px;
  font-size: $normalSize !important;
  color: inherit;
  text-decoration: none;
}

@media (max-width: 768px) {
  .sidebar {
    padding: 10px;
    font-size: $medium !important;
  }

  .logo {
    width: 80%;
    margin: 10px auto;
  }

  .menu-item,
  .logout-item {
    padding: 8px;
    font-size: $medium !important;
  }

  .icon {
    font-size: $middle !important;
  }

  .accordion-header {
    padding: 8px;
    font-size: $medium !important;
  }

  .submenu-item {
    padding: 6px 12px;
    font-size: $small !important;
  }

  .accordion-icon {
    font-size: $medium !important;
  }
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
</style>
