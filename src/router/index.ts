import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from 'layouts/DefaultLayout.vue'
import AuthLayout from 'layouts/AuthLayout.vue'
import { Logging } from '@/utils/helpers'
import UsersView from '@/views/pages/UsersView.vue'
import RegisterView from '@/views/pages/RegisterView.vue'
import LoginView from '@/views/pages/LoginView.vue'
import { useAuthStore } from '@/stores/modules/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
          path: '/users',
          name: 'Users',
          component: UsersView,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('pages/NotFoundPage.vue'),
      alias: '/not-found',
    },
  ],
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
  } else {
    next()
  }
})

export default router
