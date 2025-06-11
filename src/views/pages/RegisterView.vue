<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Register</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="name"
                :rules="[rules.required]"
                label="Name"
                prepend-icon="mdi-account"
                required
              />
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
              <v-text-field
                v-model="phone"
                label="Phone"
                prepend-icon="mdi-phone"
              />
              <v-text-field
                v-model="address"
                label="Address"
                prepend-icon="mdi-map-marker"
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
              Register
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <router-link to="/login">Already have an account? Login here</router-link>
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
import { useUserStore } from '@/stores/modules/userStore'
import { RegisterData } from '@/models/user'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const form = ref<any>(null)
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const phone = ref('')
    const address = ref('')
    const role = ref<'admin' | 'customer'>('customer')
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
        const registerData: RegisterData = {
          name: name.value,
          email: email.value,
          password: password.value,
          phone: phone.value || '',
          address: address.value || undefined,
          role: role.value
        }
        await userStore.register(registerData)
        router.push('/users')
      } catch (error: any) {
        snackbar.value = {
          show: true,
          text: error.message,
          color: 'error'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      name,
      email,
      password,
      phone,
      address,
      role,
      showPassword,
      loading,
      snackbar,
      rules,
      handleSubmit
    }
  }
})
</script> 