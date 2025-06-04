<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from './stores/modules/authStore'
import { useUserStore } from './stores/modules/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = ref(useAuthStore())
const userStore = ref(useUserStore())
const user = computed(() => userStore.value.user)
const isLogged = computed(() => authStore.value.isAuthenticated)

onMounted(async () => {
  try {
    if (authStore.value.access_token) {
      await authStore.value.restoreAuthState()
    }
  } catch (error) {
    console.error('Failed to restore authentication state:', error)
    // Only redirect to login if we're not already there
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
              hidden:
                !user ||
                !isLogged             
              }"
          >
            <LeftSlider />
          </div>
          <div
            class="content-area"
            :class="{
              'logged-in': isLogged && user,
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
