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
    //redirect: '/home',
    children: [
      {
        path: '',
        name: 'Lunch Page',
        component: () => import('@/views/pages/LunchPage.vue'),
        meta: { requiresAuth: false }, // ✅ Open to everyone
      },
      {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false, requiresGuest: true },
        alias: '/login',
      },
      // {
      //   path: '/register',
      //   name: 'Register',
      //   component: RegisterView,
      //   meta: { requiresAuth: false, requiresGuest: true },
      // },
      {
        path: '/delete-user',
        name: 'Delete User',
        component: () => import('@/views/pages/DeleteUserMobile.vue'),
        meta: { requiresAuth: false, requiresGuest: true },
      },
      {
        path: '/privacy-policy',
        name: 'Privacy Policy',
        component: () => import('@/views/pages/privarcy.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/terms-of-service',
        name: 'Terms of Service',
        component: () => import('@/views/pages/terms.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '/employees',
        name: 'Employees',
        component: () => import('@/views/pages/EmployeesView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/customer-support',
        name: 'Customer Support',
        component: () => import('@/views/pages/ComplaintsView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/transfers',
        name: 'Transfers',
        component: () => import('@/views/pages/TransfersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/banners',
        name: 'Banners',
        component: () => import('@/views/pages/BannersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/notifications',
        name: 'Notifications',
        component: () => import('@/views/pages/NotificationsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/pages/NotFoundPage.vue'),
    alias: '/not-found',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Always try to restore auth state from localStorage token
  if (!isAuthenticated && localStorage.getItem('accessToken')) {
    try {
      await authStore.restoreAuthState()
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      localStorage.removeItem('accessToken') // optional cleanup
    }
  }

  if (requiresAuth && !authStore.isAuthenticated && to.path !== '/login') {
    return next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'Employees' })
  } else {
    return next()
  }
})

router.onError((error, to) => {
  if (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed')
  ) {
    if (!to?.fullPath) {
      window.location.reload()
    } else {
      window.location.href = to.fullPath
    }
  }
})

// Role-based access control
router.beforeEach(roleGuard)

export default router
