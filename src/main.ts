import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

//NOTE: Vuetify importları
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import 'styles/main.scss' //NOTE: Global stiller

import { lightTheme, darkTheme } from './plugins/vuetifyTheme'
import i18n from './utils/i18n/i18n'
import { globalHelpers } from './utils/helpers'
import { kAppTitle } from './utils/constants/const'
import { tr, en } from 'vuetify/locale'
import router from './router'

document.title = kAppTitle

const browserLang = navigator.language.split('-')[0]

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
  locale: {
    locale: browserLang || 'en',
    fallback: browserLang || 'en',
    messages: {en, tr},
  },
})

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

//NOTE: Tüm "base" bileşenlerini otomatik olarak kaydetme
async function registerComponents() {
  const componentsGlob = import.meta.glob('@/components/base/**/*.vue')
  const componentPromises = Object.entries(componentsGlob).map(async ([path, resolver]) => {
    const mod = (await resolver()) as { default: any } 
    const componentName = path
      .split('/')
      .pop()
      ?.replace(/\.\w+$/, '')
    if (componentName) {
      app.component(componentName, mod.default)
    }
  })
  await Promise.all(componentPromises) //NOTE: Tüm bileşenlerin yüklenmesini bekle
}

registerComponents().then(() => {
  app.config.globalProperties.$globalHelpers = globalHelpers
  app.use(pinia)
  app.use(vuetify)
  app.use(i18n)
  app.use(router)
  app.use(ElementPlus)

  app.mount('#app')
})
