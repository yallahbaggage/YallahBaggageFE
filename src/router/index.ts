import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from 'layouts/DefaultLayout.vue'
import AuthLayout from 'layouts/AuthLayout.vue'
import UsersView from '@/views/pages/UsersView.vue'
import RegisterView from '@/views/pages/RegisterView.vue'
import LoginView from '@/views/pages/LoginView.vue'
import ComplaintsView from '@/views/pages/ComplaintsView.vue'
import { useAuthStore } from '@/stores/modules/authStore'
import { roleGuard } from './guards/roleGuard'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false },
      },
      {
        path: '/register',
        name: 'Register',
        component: RegisterView,
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
        component: UsersView,
        meta: { requiresAuth: true },
      },
      {
        path: '/complaints',
        name: 'Complaints',
        component: ComplaintsView,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/pages/OrdersPage.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/orders/:id',
  //   name: 'OrderDetails',
  //   component: () => import('@/views/pages/OrderDetailsPage.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/profile',
  //   name: 'Profile',
  //   component: () => import('../views/pages/ProfilePage.vue'),
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/pages/NotFoundPage.vue'),
    alias: '/not-found',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Check if we need to restore auth state
  if (!isAuthenticated && localStorage.getItem('accessToken')) {
    try {
      await authStore.restoreAuthState()
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      next('/login')
      return
    }
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/users')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Employees' })
  } else {
    next()
  }
})

// Add role guard to all routes
router.beforeEach(roleGuard)

export default router
