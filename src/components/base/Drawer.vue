<template>
  <div v-if="isOpen" class="overlay" ref="overlay">
    <v-card v-show="isOpen" ref="drawer" class="drawer">
      <v-card-title>
        <div class="drawer-header">
          <v-row>
            <v-col>
              <p class="drawer-title-text">{{ title }}</p>
              <p class="drawer-desc-text" v-if="desc">{{ desc }}</p>
            </v-col>

            <div class="drawer-right-content">
              <v-row justify="end">
                <v-col class="drawer-close">
                  <!-- ✅ Custom status slot or fallback -->
                  <template v-if="$slots.drawerStatus">
                    <slot name="drawerStatus" />
                  </template>
                  <v-chip
                    v-else-if="drawerStatus"
                    small
                    :style="{ backgroundColor: statusBg(drawerStatus), color: statusColor(drawerStatus) }"
                  >
                    <span
                      class="status-circle"
                      :style="{ backgroundColor: statusColor(drawerStatus) }"
                    ></span>
                    {{ t(drawerStatus) }}
                  </v-chip>

                  <v-icon id="close-btn" role="button" @click="closeDrawer">
                    mdi-close
                  </v-icon>
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
import { StaticFunctions } from '@/utils/helpers/static_functions'

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
  drawerStatus: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

const overlay: Ref<HTMLElement | null> = ref(null)
const drawer: Ref<HTMLElement | null> = ref(null)

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
  return StaticFunctions.getStatusColorOnly(status)
}

function statusBg(status: string): string {
  return StaticFunctions.getStatusBackgroundColor(status)
}

onMounted(() => {
  toggleBodyScroll(props.isOpen)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  toggleBodyScroll(false)
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => props.isOpen,
  (newVal) => {
    toggleBodyScroll(newVal)
  }
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
  // min-width: 25%;
  width: 100%;
  max-width: 400px;
  background-color: rgb(var(--v-theme-white));
  box-shadow: $shadow;
  z-index: 50;
  transition: transform 0.5s ease-in-out;
  border-radius: 20px;
}

//small screens
@media (max-width: 600px) {
  .drawer {
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 0;
  }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px !important;
  border-bottom: 1px solid rgb(var(--v-theme-lightGrey));
}

.drawer-title-text {
  color: var(--text-strong-950, #171717);
  font-feature-settings: 'ss11' on, 'liga' off, 'calt' off;
    font-family: 'Inter Variable', Inter, system-ui, sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.27px;
}

.drawer-desc-text {
  overflow: hidden;
  color: var(--text-sub-600, #5c5c5c);
  font-feature-settings: 'ss11' on, 'liga' off, 'calt' off;
  text-overflow: ellipsis;
  white-space: nowrap;
    font-family: 'Inter Variable', Inter, system-ui, sans-serif;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.084px;
}

.drawer-close {
  display: flex;
}

.drawer-body {
  overflow-y: auto;
  height: calc(100% - $size-5xl);
  // width: 400px !important;
}

.status-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}
</style>
