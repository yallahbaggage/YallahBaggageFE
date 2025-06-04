<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="email"
                :rules="[rules.required, rules.email]"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                :rules="[rules.required, rules.min]"
                label="Password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="loading"
              @click="handleSubmit"
            >
              Login
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <router-link to="/register">Don't have an account? Register here</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/authStore'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const form = ref<any>(null)
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const loading = ref(false)
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
      if (!form.value?.validate()) return

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
      snackbar,
      rules,
      handleSubmit
    }
  }
})
</script> 