<template>
  <div v-if="isOpen" class="overlay" ref="overlay">
    <v-card v-show="isOpen" ref="drawer" class="drawer">
      <v-card-title>
        <div class="drawer-header">
          <v-row class="">
            <v-col>
              <p class="drawer-title-text">{{ title }}</p>
              <p class="drawer-desc-text" v-if="desc">{{ desc }}</p>
            </v-col>
            <div class="drawer-right-content">
              <v-row justify="end">
                <v-col class="drawer-close">
                  <v-chip :style="{ backgroundColor: statusBg(status) , color: statusColor(status) }" v-if="status" small>
                    <span
                      :style="{ backgroundColor: statusBg(status) , color: statusColor(status) }"
                      class="status-circle"
                    ></span>
                    {{ t(status) }}
                  </v-chip>
                  <v-icon id="close-btn" role="button" @click="closeDrawer">mdi-close</v-icon>
                </v-col>
              </v-row>
            </div>
          </v-row>
        </div>
      </v-card-title>
      <v-card-text class="drawer-body">
        <slot name="default"></slot>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import { useI18n } from 'vue3-i18n'


const { t } = useI18n()

const props = defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

// const overlay = ref<HTMLElement | null>(null)
// const drawer = ref<HTMLElement | { $el: HTMLElement } | null>(null);

const overlay: Ref<HTMLElement | null> = ref(null)
const drawer: Ref<HTMLElement | null> = ref(null)

//NOTE: Handle the scroll lock on body when drawer is open
const toggleBodyScroll = (isOpen: boolean) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
}

const handleClickOutside = (event: Event) => {
  const drawerEl = (drawer.value as any)?.$el || drawer.value
  const overlayEl = overlay.value

  if (
    overlayEl &&
    drawerEl &&
    !drawerEl.contains(event.target as Node) &&
    overlayEl.contains(event.target as Node)
  ) {
    closeDrawer()
  }
}

const closeDrawer = () => {
  emit('close')
}

function statusColor(status: string): string {
  switch (status) {
    case 'pending':
      return '#f59e0b' // amber
    case 'in_progress':
      return '#3b82f6' // blue
    case 'resolved':
      return '#10b981' // green
    case 'rejected':
      return '#ef4444' // red
    case 'closed':
      return '#6b7280' // gray
    default:
      return '#9ca3af' // fallback gray
  }
}

const statusBg = (status: string) => {
  switch (status) {
    case 'pending':
      return '#eff6ff'
    case 'in_progress':
      return '#dbf4ff' // light blue
    case 'resolved':
      return '#ecfdf5'
    case 'rejected':
      return '#fee2e2' // red
    case 'closed':
      return '#f3f4f6' // gray
    default:
      return '#f3f4f6'
  }
}



//NOTE: Add event listeners on mount, remove them on unmount
onMounted(() => {
  toggleBodyScroll(props.isOpen)
  document.addEventListener('click', handleClickOutside)
})

//NOTE: Remove body overflow when drawer is closed
onUnmounted(() => {
  toggleBodyScroll(false)
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => props.isOpen,
  (newVal) => {
    toggleBodyScroll(newVal)
  },
)
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
}
.v-card--variant-elevated,
.v-card--variant-flat {
  background-color: rgb(var(--v-theme-white)) !important;
}
.drawer {
  position: fixed;
  right: 10px;
  top: 10px;
  bottom: 10px;
  min-width: 25%;
  // height: 100%;
  width: 400px;
  background-color: rgb(var(--v-theme-white));
  box-shadow: $shadow;
  z-index: 50;
  transition: transform 0.5s ease-in-out;
  border-radius: 20px;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $medium !important;
  border-bottom: 1px solid rgb(var(--v-theme-lightGrey));
}

.drawer-title-text {
  color: var(--text-strong-950, #171717);
  font-feature-settings:
    'ss11' on,
    'liga' off,
    'calt' off;
  /* Label/Large */
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.27px;
}

.drawer-desc-text {
  overflow: hidden;
  color: var(--text-sub-600, #5c5c5c);
  font-feature-settings:
    'ss11' on,
    'liga' off,
    'calt' off;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.084px;
}

.drawer-status-text {
  display: flex;
  padding: 4px 8px 4px 4px;
  background-color: rgb(var(--v-theme-lightGreen));
  align-items: center;
  gap: 8px;
  color: #1fc16b;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  border-radius: 4px;
}

.drawer-close {
  display: flex;
}

.drawer-close-btn {
  font-size: $xl !important;
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
}

.drawer-body {
  overflow-y: auto;
  height: calc(100% - $size-5xl);
}

.translate-x-full {
  transform: translateX(100%);
}

.translate-x-0 {
  transform: translateX(0);
}
</style>
