<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :items-length="totalItems"
    :loading="loading"
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    class="server-table"
  >
    <template #item="{ item, index }">
      <tr>
        <td v-for="(header, i) in headers" :key="i">
          <slot :name="`cell-${header.key}`" :item="item" :index="index">
            {{ item[header.key as string] }}
          </slot>
        </td>
        <td v-if="$slots.actions">
          <slot name="actions" :item="item" :index="index" />
        </td>
      </tr>
    </template>

    <template #bottom>
      <v-pagination
        v-model="page"
        :length="totalPages"
        rounded
        class="mt-4"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'
import { computed, ref,watch } from 'vue'

const props = defineProps<{
  headers: DataTableHeader[]
  items: Record<string, any>[]
  totalItems: number
  loading: boolean
}>()

const page = ref(1)
const itemsPerPage = ref(8)

const emit = defineEmits(['update:page', 'update:items-per-page'])

watch(page, value => emit('update:page', value))
watch(itemsPerPage, value => emit('update:items-per-page', value))

const totalPages = computed(() =>
  Math.ceil(props.totalItems / itemsPerPage.value)
)
</script>

<style lang="scss" scoped>
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
</style>
