<template>
  <v-container fluid>
    <BaseHeader />

    <v-card class="mt-4">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search employee name, number or ID"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-select
          :items="statusOptions"
          label="All Status"
          single-line
          hide-details
          v-model="selectedStatus"
          clearable
        ></v-select>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredWorkers"
        :search="search"
        :loading="loading"
        class="elevation-1 workers-table"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getWorkerStatusColor(item.status)"
            text-color="white"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props">mdi-dots-vertical</v-icon>
            </template>
            <v-list>
              <v-list-item @click="viewWorkerDetails(item)">
                <v-list-item-title>See Details</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteWorker(item)">
                <v-list-item-title>Delete Employee</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:bottom>
          <div class="pagination-controls">
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
            ></v-pagination>
            <div class="items-per-page">
              <v-select
                :items="itemsPerPageOptions"
                v-model="itemsPerPage"
                label="Items per page"
                hide-details
                density="compact"
              ></v-select>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Worker Details Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Worker Details</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="Name"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.phone"
                  label="Phone Number"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.specialization"
                  label="Specialization"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.status"
                  label="Status"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.address"
                  label="Address"
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="closeDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useWorkersStore } from '@/stores/modules/workers'
import { IWorker } from '@/models/worker'
import BaseHeader from '@/components/base/BaseHeader.vue'

export default defineComponent({
  name: 'EmployeesView',
  components: {
    BaseHeader,
  },
  setup() {
    const workersStore = useWorkersStore()

    const loading = ref(false)
    const search = ref('')
    const workers = ref<IWorker[]>([])
    const dialog = ref(false)
    const editedItem = ref<Partial<IWorker>>({})
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })

    const page = ref(1)
    const itemsPerPage = ref(8)
    const itemsPerPageOptions = [8, 16, 24]
    const selectedStatus = ref<string | null>(null)
    const statusOptions = ['Available', 'Assigned', 'On The Way']

    const headers = [
      { title: 'ID', key: '_id' },
      { title: 'Employee', key: 'name' },
      { title: 'ID Number', key: 'identityNumber' },
      { title: 'Phone Number', key: 'phone' },
      { title: 'Status', key: 'status' },
      { title: 'Actions', key: 'actions', sortable: false }
    ]

    const filteredWorkers = computed(() => {
      let filtered = workers.value

      if (selectedStatus.value) {
        filtered = filtered.filter(worker => worker.status === selectedStatus.value)
      }

      if (search.value) {
        const lowerCaseSearch = search.value.toLowerCase()
        filtered = filtered.filter(
          worker =>
            worker.name?.toLowerCase().includes(lowerCaseSearch) ||
            worker.phone?.toLowerCase().includes(lowerCaseSearch) ||
            worker._id?.toLowerCase().includes(lowerCaseSearch)
        )
      }
      return filtered
    })

    const paginatedWorkers = computed(() => {
      const start = (page.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredWorkers.value.slice(start, end)
    })

    const pageCount = computed(() => {
      return Math.ceil(filteredWorkers.value.length / itemsPerPage.value)
    })

    const getWorkerStatusColor = (status: string | undefined) => {
      switch (status) {
        case 'Available':
          return 'green';
        case 'Assigned':
          return 'blue';
        case 'On The Way':
          return 'orange';
        default:
          return 'grey';
      }
    };

    const fetchWorkers = async () => {
      loading.value = true
      try {
        workers.value = await workersStore.getWorkers()
      } catch (error: any) {
        snackbar.value = {
          show: true,
          text: error.message,
          color: 'error'
        }
      } finally {
        loading.value = false
      }
    }

    const viewWorkerDetails = (item: IWorker) => {
      editedItem.value = { ...item }
      dialog.value = true
    }

    const deleteWorker = (item: IWorker) => {
      // Implement delete logic here
      console.log('Delete worker:', item)
      snackbar.value = {
        show: true,
        text: `Delete functionality for ${item.name} not yet implemented.`,
        color: 'info'
      }
    }

    const closeDialog = () => {
      dialog.value = false
      editedItem.value = {}
    }

    onMounted(() => {
      fetchWorkers()
    })

    return {
      loading,
      search,
      workers,
      headers,
      dialog,
      editedItem,
      snackbar,
      page,
      itemsPerPage,
      itemsPerPageOptions,
      selectedStatus,
      statusOptions,
      filteredWorkers: paginatedWorkers,
      pageCount,
      getWorkerStatusColor,
      viewWorkerDetails,
      deleteWorker,
      closeDialog,
    }
  }
})
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  gap: 20px;
}

.items-per-page {
  max-width: 150px;
}

.workers-table :deep(th) {
  font-weight: bold !important;
  color: #333 !important;
}

.workers-table :deep(td) {
  font-size: 14px;
}
</style> 