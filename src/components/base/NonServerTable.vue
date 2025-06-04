<template>
  <div class="table-container" :class="customClass">
    <!-- Table Header -->
    <template v-if="showHeader">
      <div class="header">
        <div class="header-left">
          <h1>{{ headerTitle }}</h1>
          <div class="badge">
            {{ filteredData ? filteredData.length : 0 }}
          </div>
        </div>

        <template v-if="showButton">
          <slot name="button" />
        </template>

        <template v-if="showSearch">
          <input v-model="searchQuery" type="text" :placeholder="t('searchButton')" class="search-input" />
        </template>
      </div>
    </template>

    <table>
      <thead>
        <tr>
          <th v-if="isCheckbox" class="checkbox-column">
            <input type="checkbox" :checked="allVisibleSelected" @change="toggleSelectAll" />
          </th>
          <th v-for="header in headers" :key="header" class="header-column">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.id">
          <td v-if="isCheckbox" class="checkbox-column">
            <input type="checkbox" :value="item.id" :checked="selectedItems.has(item.id)"
              @change="toggleSelection(item)" />
          </td>
          <td v-for="key in keys" :key="key" :class="['styled-text', applyStyleText(item)]">
            <template v-if="$slots[key]">
              <slot :name="key" :item="item" />
            </template>
            <template v-else>
              {{ item[key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!showAllItems && totalPages !== 0" class="pagination">
      <div class="page-info">
        {{ t('paginationText', { start: `${(currentPage - 1) * itemsPerPage + 1}`, end: `${ Math.min(currentPage * itemsPerPage, filteredData.length) }`, total: `${filteredData.length}` })}}
      </div>

      <v-btn role="button" id="mdi-page-first" aria-label="mdi-page-first" icon="mdi-page-first" variant="plain" density="comfortable" type="button" :disabled="currentPage === 1"
        @click="changePage(1)"></v-btn>
      <v-btn role="button" id="mdi-chevron-left" aria-label="mdi-chevron-left" icon="mdi-chevron-left" variant="plain" density="comfortable" type="button" :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"></v-btn>
      <v-btn role="button" id="mdi-chevron-right" aria-label="mdi-chevron-right" icon="mdi-chevron-right" variant="plain" density="comfortable" type="button"
        :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"></v-btn>
      <v-btn role="button" id="mdi-page-last" aria-label="mdi-page-last" icon="mdi-page-last" variant="plain" density="comfortable" type="button"
        :disabled="currentPage === totalPages" @click="changePage(totalPages)"></v-btn>
    </div>
    <template v-if="paginatedData && paginatedData.length == 0">
      <div class='center-no-data-available'>{{ props?.noDataMessage ?? t('noDataAvailable') }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue'
import { useI18n } from 'vue3-i18n'

const { t } = useI18n()
const props = defineProps({
  data: { type: Array as () => any[], default: () => [] },
  headers: { type: Array as () => string[], required: true },
  keys: { type: Array as () => string[], required: true },
  itemsPerPage: { type: Number, default: 15 },
  isCheckbox: { type: Boolean, default: false },
  showSearch: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: false },
  headerTitle: { type: String, default: '' },
  showButton: { type: Boolean, default: true },
  selectedItems: { type: Array as () => any[], default: () => [] },
  showAllItems: { type: Boolean, default: false }, //INFO if add this prop will hide pagination and show all items
  styleText: {
    type: [String, Function] as PropType<string | ((item: any) => string)>,
    default: '',
  },
  customClass: { type: String, default: '' },
  noDataMessage: { type: String },
})

const currentPage = ref(1)
const selectedItems = ref(new Set([...props.selectedItems]))
const searchQuery = ref('')
const emit = defineEmits(['update:selectedItems'])

//INFO Ensure filteredData is computed only if data is not undefined
const filteredData = computed(() => {
  const searchLower = searchQuery.value.toLowerCase()
  return props.data.filter((item: any) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(searchLower)),
  )
})

//INFO Update paginatedData to show all items if showAllItems is true
const paginatedData = computed(() => {
  if (props.showAllItems) {
    return filteredData.value
  }
  const start = (currentPage.value - 1) * props.itemsPerPage
  return filteredData.value.slice(start, start + props.itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / props.itemsPerPage))

const allVisibleSelected = computed(() =>
  paginatedData.value.every((item) => selectedItems.value.has(item.id)),
)

const toggleSelection = (item: any) => {
  if (selectedItems.value.has(item.id)) {
    selectedItems.value.delete(item.id)
  } else {
    selectedItems.value.add(item.id)
  }
  emit('update:selectedItems', Array.from(selectedItems.value))
}

const toggleSelectAll = () => {
  const allSelected = allVisibleSelected.value
  props.data.forEach((item: any) => {
    if (allSelected) {
      selectedItems.value.delete(item.id)
    } else {
      selectedItems.value.add(item.id)
    }
  })
  emit('update:selectedItems', Array.from(selectedItems.value))
}

const changePage = (page: number, event?: Event) => {
  event?.preventDefault(); 
  event?.stopPropagation();

  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

//INFO Helper method to determine the style class for each row
const applyStyleText = (item: any) => {
  return typeof props.styleText === 'function' ? props.styleText(item) : props.styleText
}

watch([() => props.data, searchQuery], () => {
  currentPage.value = 1
})

watch(
  () => props.selectedItems,
  (newVal) => {
    selectedItems.value = new Set(newVal)
  },
)
</script>
<style scoped lang="scss">
@use 'styles/main' as *;

$alternate-color: rgb(var(--v-theme-smokeWhite));
$hover-color: rgb(var(--v-theme-slate));

.table-container {
  padding: 15px;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: $medium !important;
    gap: $small !important;
    flex-wrap: wrap;

    .header-left {
      display: flex;
      gap: $small !important;
      align-items: center;

      h1 {
        font-size: $medium !important;
        font-weight: $font-weight-regular;
      }

      .badge {
        background-color: rgb(var(--v-theme-alternate));
        border-radius: $x-small !important;
        padding: 0.5rem $small !important;
      }
    }

    .search-input {
      border: 1px solid rgb(var(--v-theme-lavenderGray));
      padding: $x-small $medium !important;
      border-radius: $x-small !important;
    }
  }

  table {
    width: 100%;
    background-color: rgb(var(--v-theme-white));
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    table-layout: auto;
    border-collapse: collapse;

    thead {
      background-color: rgb(var(--v-theme-smokeBlack));
      color: white;
      font-size: $normalSize !important;
      // font-weight: $font-weight-light;

      th {
        padding: $small !important;
        text-align: left;
        // font-size: $large !important;
        // font-weight: $font-weight-regular;

        &.checkbox-column {
          width: $medium !important;
          margin-top: 3px;
          border: none;
        }

        input[type='checkbox'] {
          width: $medium !important;
          height: $medium !important;
        }
      }
    }

    tbody {
      tr {
        font-size: $normalSize !important;
        font-weight: $font-weight-light;
        background-color: rgb(var(--v-theme-raisenBlack));

        &:hover {
          background-color: $hover-color;
          color: rgb(var(--v-theme-primary));
        }

        td {
          padding: $x-small !important;
          height: 47px;
          border-bottom: 1px solid rgb(var(--v-theme-lavenderGray));

          &.checkbox-column {
            width: $medium !important;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: auto;
            margin-top: 2px;
            border: none;
          }
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: right;
    gap: 10px;
    align-items: center;
    margin-top: $x-small !important;

    button {
      font-weight: $font-weight-bold;
      padding: 0 0 !important;
      transition: background-color 0.2s ease;
      border: none !important;

      &:hover {
        color: rgb(var(--v-theme-smokeBlack));
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.2;
      }
    }

    .page-info {
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>
