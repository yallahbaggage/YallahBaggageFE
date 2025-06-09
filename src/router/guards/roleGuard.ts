import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/modules/authStore'

export function roleGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  const requiredRoles = to.meta.roles as string[] | undefined

  // If no roles are required, allow access
  if (!requiredRoles) {
    return next()
  }

  // If user is not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Check if user has required role
  if (authStore.hasRole(requiredRoles)) {
    return next()
  }

  // If user doesn't have required role, redirect to home
  return next({ name: 'employees' })
} 