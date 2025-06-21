<template>
  <v-dialog
    @click:outside="dialog = false"
    v-model="dialog"
    persistent
    max-width="328px"
    @after-leave="reversePicker"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="fullDateTime"
        v-bind="props"
        readonly
        :title="t('enterDateAndTime')"
      />
    </template>
    <v-card>
      <v-card-text>
        <div v-if="showDatePicker" class="mt-4">
          <v-date-picker
            v-model="selectedDate"
            @update:model-value="onDateChange"
            full-width
            :title="t('enterDate')"
            scrollable
            :min="minDate"
            :max="maxDate"
            max-width="368"
            :allowed-dates="allowedDates"
            :locale="currentLocale"
          />
        </div>
        <div v-if="showTimePicker && showTime" class="mt-4">
          <v-time-picker
            :title="t('enterTime')"
            v-model="selectedTime"
            @update:model-value="onTimeChange"
            full-width
            format="24hr"
            :locale="currentLocale"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Logging } from '@/utils/helpers';
import { computed, onMounted, ref } from 'vue'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { useLocale } from 'vuetify'
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String
  },
  minDate: {
    type: String, //INFO Vuetıfy only accept isoString
    default: () => new Date('1900-01-01').toISOString(),  
  },
  maxDate: {
    type: String,
    default: () => new Date('2100-01-01').toISOString(),
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String,Date, null],
    default: null,  },
  allowedDates: {
    type: Array,
    default: () => [],
  },
})

const dialog = ref(false)
const selectedDate = ref<Date | null>(null)
const selectedTime = ref<string | null>(null)
const fullDateTime = ref<string | null>(null)
const showTimePicker = ref(false)
const showDatePicker = ref(true)
const { current } = useLocale()
const currentLocale = computed(() => current.value)

const emit = defineEmits(['update:modelValue', 'apply', 'cancel'])

function onDateChange(date: Date | null) {
  selectedDate.value = date
  showDatePicker.value = false
  showTimePicker.value = true
  if (!props.showTime) {
    confirmSelection()
    dialog.value = false
  }
}

function onTimeChange(time: string) {
  selectedTime.value = time
  confirmSelection()
}

function confirmSelection() {
  if (selectedDate.value) {
    try {
      const timePart = props.showTime 
        ? (selectedTime.value ?? new Date().toTimeString().slice(0, 5))
        : '00:00';

      const localeDate = new Date(selectedDate.value).toLocaleDateString('en-GB');

      const [day, month, year] = localeDate.split('/')
      const isoDate = `${year}-${month}-${day}`

      const combinedDateTime = `${isoDate}T${timePart}:00`

      const parsedDateTime = new Date(combinedDateTime)
      if (isNaN(parsedDateTime.getTime())) {
        throw new Error('Invalid combined date and time')
      }

      fullDateTime.value = props.showTime ? `${localeDate} ${timePart}` : localeDate;

      emit('update:modelValue', fullDateTime.value)
    } catch (error) {
      if (error instanceof Error) {
        Logging.logError('Error:'+ error.message)
      } else {
        Logging.logError('Unknown error:'+ error)
      }
    }
  } else {
    Logging.logDebug('Missing date or time!')
  }

  dialog.value = false
  reversePicker()
}

function reversePicker() {
  showDatePicker.value = true
  showTimePicker.value = false
}

//INFO: Initialize selectedDate with modelValue when the component is mounted
onMounted(() => {
  const selectedLanguage = ref(localStorage.getItem('lang') ?? current.value)
  current.value = selectedLanguage.value;

  if (props.modelValue) {
    parseModelValue(props.modelValue)
  } else {

    const today = new Date();
    selectedDate.value = today;
    fullDateTime.value = today.toLocaleDateString('en-GB');
    selectedTime.value = today.toTimeString().slice(0, 5);
  }
})

//INFO: Function to parse modelValue and set selectedDate & selectedTime
function parseModelValue(value: string | Date | null) {
  if (value) {
    const dateObj = new Date(value)
    if (!isNaN(dateObj.getTime())) {
      selectedDate.value = dateObj
      fullDateTime.value = dateObj.toLocaleDateString('en-GB')
      selectedTime.value = dateObj.toTimeString().slice(0, 5) //INFO: Extract HH:MM
    }
  }
}
</script>

<style>
.mt-4 {
  margin-top: 16px;
}
.v-time-picker-clock {
  margin: 10px !important;
}
.v-dialog > .v-overlay__content,
.v-dialog > .v-overlay__content > form {
  background-color: var(--white) !important;
}
.v-time-picker.v-picker {
  padding: 0px 16px !important;
}

.v-dialog > .v-overlay__content > .v-card > .v-card-text,
.v-dialog > .v-overlay__content > form > .v-card > .v-card-text {
  padding: 0px !important;
  background-color: rgb(var(--v-theme-white)) !important;
}
.v-picker-title {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
</style>
