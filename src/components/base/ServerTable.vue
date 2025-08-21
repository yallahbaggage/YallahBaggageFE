<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :items-length="totalItems"
    :loading="loading"
    :page="props.page"
    :items-per-page="props.itemsPerPage"
    @update:page="emit('update:page', $event)"
    @update:items-per-page="emit('update:items-per-page', $event)"
    class="server-table"
  >
    <template #item="{ item, index }">
      <tr>
        <td v-for="(header, i) in headers" :key="i">
          <template v-if="header.key === '' && $slots.actions">
            <slot name="actions" :item="item" :index="index" />
          </template>
          <template v-else>
            <slot :name="`cell-${header.key}`" :item="item" :index="index">
              <div 
                class="cell-content" 
                :style="{ maxWidth: props.cellMaxWidth ? `${props.cellMaxWidth}px` : '200px' }"
              >
                {{ item[header.key as string] }}
              </div>
            </slot>
          </template>
        </td>
      </tr>
    </template>

    <template #bottom>
      <div class="pagination-row">
        <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <div class="pagination-controls">
          <v-btn icon variant="text" :disabled="currentPage === 1" @click="goToPage(1)">
            <v-icon>mdi-page-first</v-icon>
          </v-btn>
          <!-- <v-btn icon variant="text" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn> -->
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            class="pagination-pages"
            @update:model-value="onPageChange"
            :total-visible="7"
          />
          <!-- <v-btn icon variant="text" :disabled="currentPage === totalPages || totalPages === 0" @click="goToPage(currentPage + 1)">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn> -->
          <v-btn
            icon
            variant="text"
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="goToPage(totalPages)"
          >
            <v-icon>mdi-page-last</v-icon>
          </v-btn>
        </div>
        <v-select
          class="pagination-size"
          :items="pageSizesFormatted"
          v-model="localItemsPerPage"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="onPageSizeChange"
        />
      </div>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue3-i18n'

const props = defineProps<{
  headers: DataTableHeader[]
  items: Record<string, any>[]
  totalItems: number
  loading: boolean
  page: number
  itemsPerPage: number
  cellMaxWidth?: number // Optional prop to control cell max width
}>()

const { t } = useI18n()

const emit = defineEmits(['update:page', 'update:items-per-page'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const currentPage = ref(props.page)
watch(
  () => props.page,
  (val) => {
    currentPage.value = val
  },
)

function onPageChange(val: number) {
  currentPage.value = val
  emit('update:page', val)
}

function goToPage(val: number) {
  if (val >= 1 && val <= totalPages.value) {
    currentPage.value = val
    emit('update:page', val)
  }
}

const pageSizes = [8, 16, 32, 64]

const pageSizesFormatted = pageSizes.map((size) => ({
  label: `${size} / ${t('page')}`,
  value: size,
}))

const localItemsPerPage = ref(props.itemsPerPage)
watch(
  () => props.itemsPerPage,
  (val) => {
    localItemsPerPage.value = val
  },
)
function onPageSizeChange(val: number) {
  emit('update:items-per-page', val)
}
</script>

<style lang="scss" scoped>
@use 'styles/main' as *;

.server-table {
  ::v-deep(.v-data-table) {
    font-size: 14px;

    td,
    th {
      padding: 12px;
    }

    th {
      font-weight: 600;
    }
  }
  
  :deep(.v-btn--icon.v-btn--density-comfortable) {
    border-radius: 6px !important;
  }
  
  // Cell content truncation
  .cell-content {
    max-width: v-bind('props.cellMaxWidth || 200'); // Use prop or default to 200px
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  // Make table cells have consistent width
  td {
    max-width: v-bind('props.cellMaxWidth || 200'); // Use prop or default to 200px
    overflow: hidden;
  }
  
  // Responsive table behavior
  @media (max-width: 768px) {
    .cell-content {
      max-width: v-bind('Math.min((props.cellMaxWidth || 200) * 0.75, 150)'); // 75% of prop value or max 150px
    }
    
    td {
      max-width: v-bind('Math.min((props.cellMaxWidth || 200) * 0.75, 150)');
    }
  }
  
  @media (max-width: 480px) {
    .cell-content {
      max-width: v-bind('Math.min((props.cellMaxWidth || 200) * 0.5, 100)'); // 50% of prop value or max 100px
    }
    
    td {
      max-width: v-bind('Math.min((props.cellMaxWidth || 200) * 0.5, 100)');
    }
  }

  // :deep(.v-btn--icon.v-btn--density-comfortable:focus),
  // :deep(.v-btn--icon.v-btn--density-comfortable:focus-visible),
  // :deep(.v-btn--icon.v-btn--density-comfortable.v-btn--active),
  // :deep(.v-btn--icon.v-btn--density-comfortable.v-btn--active:focus),
  // :deep(.v-btn--icon.v-btn--density-comfortable.v-btn--active:focus-visible),
  // :deep(.v-btn--icon.v-btn--density-comfortable:hover),
  // :deep(.v-btn--icon.v-btn--density-comfortable:active),
  // :deep(.v-btn--icon.v-btn--density-comfortable:focus-within),
  // :deep(.v-btn--icon.v-btn--density-comfortable.v-btn--focused) {
  //   // background-color: black !important;
  //   // color: white !important;
  //   border-radius: 6px !important;
  // }

  // :deep(.v-btn--icon.v-btn--density-comfortable:focus .v-btn__overlay),
  // :deep(.v-btn--icon.v-btn--density-comfortable:focus-visible .v-btn__overlay),
  // :deep(.v-btn--icon.v-btn--density-comfortable.v-btn--active .v-btn__overlay),
  // :deep(.v-btn--icon.v-btn--density-comfortable:hover .v-btn__overlay),
  // :deep(.v-btn--icon.v-btn--density-comfortable:active .v-btn__overlay),
  // :deep(.v-btn--icon.v-btn--density-comfortable.v-btn--focused .v-btn__overlay) {
  //   // background-color: black !important;
  //   opacity: 0 !important;
  // }
}

.pagination-row {
  margin-left: $sidebarWidth;
  position: absolute;
  bottom: 15px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-info {
  color: #888;
  font-size: 15px;
  min-width: 110px;
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
.pagination-pages {
  margin: 0 8px;
  color: #5c5c5c;
}
.pagination-size {
  width: fit-content;
  max-width: fit-content;
  height: 32px !important;
  text-align: center !important;

  :deep(.v-field) {
    height: 32px !important;
    text-align: center !important;
  }

  :deep(.v-select) {
    height: 32px !important;
    text-align: center !important;
  }

  :deep(.v-input) {
    height: 32px !important;
    text-align: center !important;
  }

  :deep(.v-field__input) {
    height: 32px !important;
    text-align: center !important;
    padding-top: 0px !important;
  }

  :deep(.mdi:before, .mdi-set) {
    padding-bottom: 10px !important;
  }
}

.v-pagination .v-btn.v-btn--density-default {
  min-width: 12px !important;
  min-height: 12px !important;
}
</style>
