import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from 'layouts/DefaultLayout.vue'
import AuthLayout from 'layouts/AuthLayout.vue'
import RegisterView from 'pages/RegisterView.vue'
import LoginView from 'pages/LoginView.vue'
import { useAuthStore } from 'modules/authStore'
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
        meta: { requiresAuth: false, requiresGuest: true },
        alias: '/login',
      },
      {
        path: '/register',
        name: 'Register',
        component: RegisterView,
        meta: { requiresAuth: false, requiresGuest: true },
      },
      {
        path: '/delete-user',
        name: 'Delete User',
        component: () => import('pages/DeleteUserMobile.vue'),
        meta: { requiresAuth: false, requiresGuest: true },
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
        component: () => import('pages/EmployeesView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/customer-support',
        name: 'Customer Support',
        component: () => import('pages/ComplaintsView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/transfers',
        name: 'Transfers',
        component: () => import('pages/TransfersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/banners',
        name: 'Banners',
        component: () => import('pages/BannersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/notifications',
        name: 'Notifications',
        component: () => import('pages/NotificationsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  // {
  //   path: '/',
  //   component: DefaultLayout,
  //   children: [
  //     {
  //       path: '/users',
  //       name: 'Users',
  //       component: UsersView,
  //       meta: { requiresAuth: true },
  //     },
  //   ]
  // },

  // {
  //   path: '/transfers/:id',
  //   name: 'TransferDetails',
  //   component: () => import('@/views/pages/TransferDetailsPage.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/profile',
  //   name: 'Profile',
  //   component: () => import('@/views/pages/ProfilePage.vue'),
  //   meta: { requiresAuth: true }
  // },
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
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

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
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Employees' })
  } else {
    next()
  }
})

// Add role guard to all routes
router.beforeEach(roleGuard)

export default router
