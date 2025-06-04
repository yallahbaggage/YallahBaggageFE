<template>
  <div>
    <WaitingView v-if="loading" />
    <v-container v-if="!loading && items">
      <v-data-table-server
        :items="items"
        :headers="headers"
        :items-length="totalItems"
        :page.sync="page"
        :items-per-page.sync="itemsPerPage"
        :loading="loading"
        @update:page="$emit('update:page', $event)"
        @update:items-per-page="$emit('update:items-per-page', $event)"
        :loading-text="t('loadingText')"
        hide-no-data
        disable-sort
        :page-text="t('paginationText', { start: '{0}', end: '{1}', total: '{2}' })"
        >
        <template #item="{ item }">
          <slot name="item" :item="item" />
        </template>
        <template #no-data>
          <v-alert type="info">{{ props?.noDataMessage ?? t('noDataAvailable') }}</v-alert>
        </template>
      </v-data-table-server>
    </v-container>
    <div v-if="!loading && items && items.length == 0" class="center-no-data-available">
      {{ props?.noDataMessage ?? t('noDataAvailable') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useI18n } from 'vue3-i18n'
import { ref } from 'vue'

interface Header {
  key: string
  title: string
  divider?: boolean
}
const { t } = useI18n()

const props = defineProps({
  items: {
    type: Array as () => any[],
    default: () => [],
    required: true,
  },
  headers: {
    type: Array as PropType<Header[]>,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  noDataMessage: { type: String },
})

const emit = defineEmits(['update:page', 'update:items-per-page'])
const page = ref(props.page)
</script>

<style scoped>
</style>
