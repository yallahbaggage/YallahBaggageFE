import { ref, readonly } from 'vue'

const isCollapsed = ref(false)

export function useSidebar() {
  const setSidebarCollapsed = (collapsed: boolean) => {
    isCollapsed.value = collapsed
  }

  return {
    isCollapsed: readonly(isCollapsed),
    setSidebarCollapsed
  }
}
