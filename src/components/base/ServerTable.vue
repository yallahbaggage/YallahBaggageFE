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
              {{ item[header.key as string] }}
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
          <v-btn icon variant="text" :disabled="currentPage === totalPages || totalPages === 0" @click="goToPage(totalPages)">
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
import { useI18n } from 'vue3-i18n';

const props = defineProps<{
  headers: DataTableHeader[]
  items: Record<string, any>[]
  totalItems: number
  loading: boolean
  page: number
  itemsPerPage: number
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

const pageSizesFormatted = pageSizes.map(size => ({
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
}
.pagination-size {
  width: fit-content;
  max-width: fit-content;
}

.v-pagination .v-btn.v-btn--density-default{
  min-width: 12px !important;
  min-height: 12px !important;
}
</style>
