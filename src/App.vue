<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/modules/authStore'
import { useRouter } from 'vue-router'
import LeftSlider from '@/components/layout/LeftSlider.vue'
import WaitingView from '@/components/base/WaitingView.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLogged = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  try {
    if (localStorage.getItem('accessToken')) {
      await authStore.restoreAuthState()
    }
  } catch (error) {
    console.error('Failed to restore authentication state:', error)
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  }
})
</script>

<template>
  <Suspense>
    <template #default>
      <div id="app">
        <div class="container">
          <div
            class="sidebar"
            :class="{
              hidden: !isLogged || router.currentRoute.value.path == '/login'
            }"
          >
            <LeftSlider />
          </div>
          <div
            class="content-area"
            :class="{
              'logged-in': isLogged
            }"
          >
            <router-view />
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <WaitingView />
    </template>
  </Suspense>
</template>

<style scoped lang="scss">
@use 'styles/main' as *;
.container {
  display: flex;
  flex-direction: row;
  gap: 16px;

  .sidebar {
    position: fixed;
    height: 100%;
    width: $sidebarWidth;
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    top: 0;
    z-index: 100;

    &.hidden {
      display: none;
    }
  }
}

@media (max-width: 1200px) {
  .sidebar {
    display: none !important;
  }

  .content-area {
    &.logged-in {
      margin-left: 0 !important;
      width: 100% !important;
    }
  }
}

.content-area {
  border-radius: 8px;

  &.logged-in {
    margin-left: $sidebarWidth;
    flex-grow: 1;
    overflow: auto;
    padding: 0px 20px;
  }

  &:not(.logged-in) {
    width: 100%;
  }
}
</style>
