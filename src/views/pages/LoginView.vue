<template>
  <v-container fluid class="login-page">
    <v-row no-gutters class="fill-height">
      <!-- Left section: Login Form -->
      <v-col cols="12" md="7" class="white-bg">
        <img
          src="@/assets/images/logo.svg"
          type="image/svg+xml"
          alt="Yalla Baggage Logo"
          class="logo-image"
        />
        <div class="login-content-wrapper">
          <v-card flat class="login-card">
            <v-card-text class="login-card-content">
              <div class="login-avatar avatar-margin-bottom">
                <img
                  src="@/assets/images/user.svg"
                  type="image/svg+xml"
                  alt="Yalla Baggage Logo"
                  class="user-image"
                />
              </div>
              <div>

                <h2 class="login-title">{{ t('loginToYourAccount') }}</h2>
                <p class="login-subtitle">{{ t('enterYourDetailsToLogin') }}</p>
              </div>

              <v-form @submit.prevent="handleSubmit" ref="form" class="form-full-width">
                <div class="input-group-container input-group-margin-bottom-email">
                  <Label class="text-style" for="email">{{ t('emailAddress') }}</Label>
                  <v-text-field
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                    placeholder="hello@yalla.com"
                    variant="solo"
                    density="comfortable"
                    prepend-inner-icon="mdi-email-outline"
                    required
                  />
                </div>
                <div class="input-group-container input-group-margin-bottom-password">
                  <Label class="text-style" for="password">{{ t('password') }}</Label>
                  <v-text-field
                    v-model="password"
                    :rules="[rules.required, rules.min]"
                    density="comfortable"
                    variant="solo"
                    placeholder="**********"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append-inner="showPassword = !showPassword"
                    required
                  />
                </div>

                <div class="form-options-row">
                  <v-checkbox
                    v-model="keepLoggedIn"
                    :label="t('keepMeLoggedIn')"
                    density="compact"
                    color="primary"
                    hide-details
                    class="text-style"
                  />
                  <!-- <router-link to="/forgot-password" class="forgot-password-link text-style">{{
                    t('forgotPassword')
                  }}</router-link> -->
                </div>

                <v-btn
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  @click="handleSubmit"
                  class="login-button"
                >
                  Login
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
        <!-- Footer section moved inside this col -->
        <div class="footer-section">
          <div class="footer-content">
            <span class="copyright-text">© 2025 Yalla Baggage</span>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn color="primary" class="bottom-btn" v-bind="props">
                  <v-icon>mdi-translate</v-icon>
                  {{ selectedLanguage ?? t('languages') }}
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in languages"
                  :key="index"
                  @click="changeLanguage(item.value)"
                  :disabled="selectedLanguage === item.value"
                >
                  <v-list-item-title :class="{ 'selected-lang': selectedLanguage === item.value }">
                    {{ item.label }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </v-col>

      <!-- Right section: Blue background -->
      <v-col cols="12" md="5" class="blue-section-layout blue-gradient-bg">
        <!-- Background patterns can be added here via CSS or SVG if needed -->
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/modules/authStore'
import { useRouter } from 'vue-router'
import { useLocale } from 'vuetify'
import { useI18n } from 'vue3-i18n'

const authStore = useAuthStore()
const router = useRouter()
const form = ref<any>(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const keepLoggedIn = ref(true)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

// i18n & Vuetify locale
const { setLocale, getLocale, t } = useI18n()
const { current } = useLocale()

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Türkçe', value: 'tr' },
]

const selectedLanguage = ref(localStorage.getItem('lang') ?? getLocale())

const changeLanguage = (selectedValue: string) => {
  setLocale(selectedValue)
  selectedLanguage.value = selectedValue
  localStorage.setItem('lang', selectedValue)
  current.value = selectedValue
  window.location.reload()
}

// Form validation rules
const rules = {
  required: (v: string) => !!v || 'Field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
  min: (v: string) => v.length >= 6 || 'Min 6 characters',
}

// Submit logic
const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await authStore.login({ email: email.value, password: password.value }).then(() => {
      if (keepLoggedIn.value) {
        localStorage.setItem('keepLoggedIn', 'true')
      } else {
        localStorage.removeItem('keepLoggedIn')
      }
    })
    return router.push('/employees')
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: error.message || 'Login failed',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.v-container {
  padding: 0 !important; // Remove default padding
}
.login-page {
  position: relative;
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #2a4ff6 0%,
      rgba(42, 79, 246, 0.8) 25%,
      rgba(42, 79, 246, 0.6) 50%,
      rgba(42, 79, 246, 0.4) 75%,
      rgba(42, 79, 246, 0.1) 100%
    ),
    var(--bg-white-0, #fff);
  overflow: hidden;
}

.white-bg {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 20px);
  border-radius: 10px;
  margin: 10px;
  max-width: 8356px;

  @media (max-width: 520px) {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
  }
}

.v-row {
  flex-wrap: nowrap !important;
}

.login-content-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
  padding: 0 auto; // add padding for small screens
}

.logo-image {
  margin-top: 24px;
  margin-bottom: 130px;
  width: 40px;
  height: 40px;
  align-self: center;

  @media (max-width: 520px) {
    margin-top: 16px;
    margin-bottom: 30px;
    width: 32px;
    height: 32px;
  }
}

.login-card {
  max-width: 400px;
  width: 100%;
}

.login-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  max-width: 392px;
  gap: 24px;
  padding: 16px;

  @media (max-width: 520px) {
    padding: 8px;
    gap: 16px;
  }
}

.login-avatar {
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(42, 79, 246, 0.1) 0%, rgba(250, 115, 25, 0) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #ffffff;
  padding: 10px;
  margin: 10px;
  border: 1px solid lightgray;
}

.login-title {
  font-size: 24px;
  font-weight: 500;

  @media (max-width: 520px) {
    font-size: 20px;
  }
}

.login-subtitle {
  color: #757575;
  font-size: 16px;
  line-height: 24px;

  @media (max-width: 520px) {
    font-size: 14px;
  }
}

.form-full-width {
  width: 100%;
}

.input-group-container {
  display: flex;
  flex-direction: column;
  text-align: start;
  font-weight: bold;
}

.input-group-margin-bottom-email {
  margin-bottom: 10px;
}

.form-options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.forgot-password-link {
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: underline;
  color: #757575;
}

.login-button {
  text-transform: capitalize;
}



.footer-section {
  background-color: transparent;
  border-top: none;
  z-index: 100;
  width: 100%;
  padding: 0 20px 10px 20px;
  margin-top: auto;

  @media (max-width: 520px) {
    padding: 0 10px 8px 10px;
  }
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;

  @media (max-width: 520px) {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }
}
.copyright-text {
  color: #7f8c8d;
}

.bottom-btn {
  background-color: transparent !important;
  color: #7f8c8d !important;
  border: none !important;
  // box-shadow: none !important;
}

.selected-lang {
  font-weight: bold;
  color: #0984e3;
}

.v-list-item-title {
  color: #000000;
}
</style>
