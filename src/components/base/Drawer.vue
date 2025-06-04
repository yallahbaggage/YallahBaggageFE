<template>
  <div v-if="isOpen" class="overlay" ref="overlay">
    <v-card v-show="isOpen" ref="drawer" class="drawer">
      <v-card-title>
        <div class="drawer-header">
          <h2 class="drawer-title">{{ title }}</h2>
          <v-icon id="close-btn" role="button" @click="closeDrawer">mdi-close</v-icon>
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

const props = defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

// const overlay = ref<HTMLElement | null>(null)
// const drawer = ref<HTMLElement | { $el: HTMLElement } | null>(null);

const overlay: Ref<HTMLElement | null> = ref(null)
const drawer: Ref<HTMLElement | null> = ref(null);

//NOTE: Handle the scroll lock on body when drawer is open
const toggleBodyScroll = (isOpen: boolean) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
}

const handleClickOutside = (event: Event) => {
  const drawerEl = (drawer.value as any)?.$el || drawer.value;
  const overlayEl = overlay.value;

  if (
    overlayEl &&
    drawerEl &&
    !drawerEl.contains(event.target as Node) &&
    overlayEl.contains(event.target as Node)
  ) {
    closeDrawer();
  }
};

const closeDrawer = () => {
  emit('close')
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
  right: 0;
  top: 0;
  width: fit-content;
  min-width: 25%;
  height: 100%;
  background-color: rgb(var(--v-theme-white));
  box-shadow: $shadow;
  z-index: 50;
  transition: transform 0.5s ease-in-out;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $medium !important;
  border-bottom: 1px solid rgb(var(--v-theme-lightGrey));
}

.drawer-title {
  font-size: $middle !important;
  font-weight: $font-weight-bold;
}

.drawer-close-btn {
  font-size: $xl !important;
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
}

.drawer-body {
  padding: $medium !important;
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
