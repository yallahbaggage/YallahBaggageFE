<template>
  <v-container fluid class="fill-height pa-0 login-page">
    <v-row no-gutters class="fill-height">
      <!-- Left section: Login Form -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center white-bg px-4 py-8">
        <v-card flat class="login-card">
          <v-card-text class="d-flex flex-column align-center justify-center text-center">
            <v-img
              src="@/assets/logo.svg"
              alt="Yalla Baggage Logo"
              max-width="80"
              class="mb-6"
            />
            <div class="login-avatar mb-4">
              <v-icon size="48">mdi-account-circle-outline</v-icon>
            </div>
            <h2 class="text-h5 font-weight-bold mb-2">Login to your account</h2>
            <p class="text-subtitle-1 text-grey-darken-1 mb-8">Enter your details to login.</p>

            <v-form @submit.prevent="handleSubmit" ref="form" class="w-100">
              <v-text-field
                v-model="email"
                :rules="[rules.required, rules.email]"
                label="Email Address"
                placeholder="hello@yalla.com"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                prepend-inner-icon="mdi-email-outline"
                required
              />
              <v-text-field
                v-model="password"
                :rules="[rules.required, rules.min]"
                label="Password"
                variant="outlined"
                density="comfortable"
                class="mb-6"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                @click:append-inner="showPassword = !showPassword"
                required
              />

              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="keepLoggedIn"
                  label="Keep me logged in"
                  density="compact"
                  color="primary"
                  hide-details
                />
                <router-link to="/forgot-password" class="text-primary text-decoration-none text-caption font-weight-medium">Forgot password?</router-link>
              </div>

              <v-btn
                color="primary"
                size="large"
                block
                :loading="loading"
                @click="handleSubmit"
                class="text-capitalize"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex flex-column align-center justify-center pa-6">
            <span class="text-caption text-grey-darken-1 mb-2">© 2025 Yalla Baggage</span>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="text"
                  color="grey-darken-1"
                  append-icon="mdi-chevron-down"
                  size="small"
                  v-bind="props"
                  class="text-capitalize"
                >
                  <v-icon start>mdi-web</v-icon>
                  ENG
                </v-btn>
              </template>
              <v-list>
                <v-list-item value="eng">
                  <v-list-item-title>English</v-list-item-title>
                </v-list-item>
                <v-list-item value="ar">
                  <v-list-item-title>العربية</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Right section: Blue background -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center blue-gradient-bg">
        <!-- Background patterns can be added here via CSS or SVG if needed -->
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/stores/modules/authStore'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore()
    const form = ref<any>(null)
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const loading = ref(false)
    const keepLoggedIn = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })

    const rules = {
      required: (v: string) => !!v || 'Field is required',
      email: (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
      min: (v: string) => v.length >= 6 || 'Min 6 characters'
    }

    const handleSubmit = async () => {
      const { valid } = await form.value.validate();
      if (!valid) return;

      loading.value = true
      try {
        await authStore.login({ email: email.value, password: password.value })
        // No need to manually redirect as the auth store handles it
      } catch (error: any) {
        snackbar.value = {
          show: true,
          text: error.message || 'Login failed',
          color: 'error'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      email,
      password,
      showPassword,
      loading,
      keepLoggedIn,
      snackbar,
      rules,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.login-page {
  background-color: #f5f7fa; /* Light background for the whole page */
}

.white-bg {
  background-color: #ffffff;
  min-height: 100vh; /* Ensure it takes full height */
}

.blue-gradient-bg {
  background: linear-gradient(135deg, #4a90e2 0%, #2e7ad2 100%); /* Blue gradient */
  position: relative;
  overflow: hidden;
  min-height: 100vh; /* Ensure it takes full height */
}

/* For the circular patterns */
.blue-gradient-bg::before,
.blue-gradient-bg::after {
  content: '';
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 0;
}

.blue-gradient-bg::before {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 20%;
  transform: translate(-50%, -50%);
}

.blue-gradient-bg::after {
  width: 500px;
  height: 500px;
  bottom: 15%;
  right: 10%;
  transform: translate(50%, 50%);
}

.login-card {
  max-width: 400px; /* Adjust as needed for better appearance */
  width: 100%;
}

.login-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e0e0e0; /* Light grey background for the avatar icon */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 