<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/modules/authStore'
import { useUserStore } from '@/stores/modules/userStore'


const authStore = useAuthStore()
const userStore = useUserStore()
const route = useRoute()
const user = computed(() => userStore.user)
const isLogged = computed(() => authStore.isAuthenticated)
</script>

<template>
  <Suspense>
    <template #default>
      <div>
        <div class="content"
          :class="{
            expanded: route.path !== '/login' && isLogged && user,
          }"
        >
          <router-view />
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

.sidebar {
  position: fixed;
  height: 100%;
  width: $sidebarWidth;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  &.hidden {
    display: none;
  }
}

.content {
  border-radius: $x-small !important;
  // margin-left: $sidebarWidth;
  transition:
    margin-left 0.3s ease,
    width 0.3s ease;

  &.expanded {
    width: 100%;
    margin-left: 0;
    padding: 0;
  }
}
</style>
