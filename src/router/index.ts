import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from 'layouts/DefaultLayout.vue'
import AuthLayout from 'layouts/AuthLayout.vue'
import LoginView from 'pages/LoginView.vue'
import { useAuthStore } from 'modules/authStore'
import { roleGuard } from './guards/roleGuard'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '', // Home - Lunch Page
        name: 'Lunch Page',
        component: () => import('pages/LunchPage.vue'),
        meta: { requiresAuth: false }, // ← Open to all
                // meta: { requiresAuth: false, requiresGuest: true },

      },
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
        meta: { requiresGuest: true }, // ← Only for unauthenticated users
      },
      {
        path: 'delete-user',
        name: 'Delete User',
        component: () => import('pages/DeleteUserMobile.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'privacy-policy',
        name: 'Privacy Policy',
        component: () => import('pages/privarcy.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'terms-of-service',
        name: 'Terms of Service',
        component: () => import('pages/terms.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'employees',
        name: 'Employees',
        component: () => import('pages/EmployeesView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'customer-support',
        name: 'Customer Support',
        component: () => import('pages/ComplaintsView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'transfers',
        name: 'Transfers',
        component: () => import('pages/TransfersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'banners',
        name: 'Banners',
        component: () => import('pages/BannersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('pages/NotificationsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Global auth guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const requiresGuest = to.matched.some((r) => r.meta.requiresGuest)

  // Restore session if token exists
  if (!isAuthenticated && localStorage.getItem('accessToken')) {
    try {
      await authStore.restoreAuthState()
    } catch (error) {
      console.error('Auth restore failed:', error)
      return next('/login')
    }
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  if (requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'Employees' }) // Redirect logged-in users away from guest-only routes
  }

  next()
})

// Role guard (e.g., admin, manager)
router.beforeEach(roleGuard)

export default router
