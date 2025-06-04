import { StorageHelper } from '@/utils/helpers'
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('light') //INFO Başlangıç temasını tanımlıyoruz
  const gtheme = useTheme()

  const toggleTheme = () => {
    const theme = gtheme.global.name.value === 'dark' ? 'light' : 'dark'
    gtheme.global.name.value = theme
    currentTheme.value = theme
    StorageHelper.write('theme', theme)
  }

  const initTheme = () => {
    const theme = StorageHelper.read('theme') || 'light'
    gtheme.global.name.value = theme
    currentTheme.value = theme
  }

  onMounted(() => {
    initTheme()
  })

  return {
    currentTheme,
    toggleTheme,
    initTheme,
  }
})
