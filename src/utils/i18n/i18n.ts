import { createI18n } from 'vue3-i18n'
import en from '@/assets/i18n/en.json'
import tr from '@/assets/i18n/tr.json'

const languages = {
  en: en,
  tr: tr,
}

const supportedLanguages = Object.keys(languages)

//INFO Get the browser's language
const browserLang = navigator.language.split('-')[0]

//INFO Check if the browser language is supported; if not, fallback to "en"
const selectedLang = supportedLanguages.includes(browserLang) ? browserLang : 'en'

const currentLang = localStorage.getItem('lang') || selectedLang

const i18n = createI18n({
  locale: currentLang,
  messages: languages,
})

export default i18n
