<template>
  <div class="orders-page">
    <div class="page-header">
      <h1>{{ $t('orders.title') }}</h1>
      <div class="header-actions">
        <v-btn
          v-if="isAdmin"
          color="primary"
          @click="showCreateDialog = true"
        >
          {{ $t('orders.createOrder') }}
        </v-btn>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="filters-card mb-4">
      <v-card-title>{{ $t('orders.filters.title') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              :label="$t('orders.filters.status')"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.paymentStatus"
              :items="paymentStatusOptions"
              :label="$t('orders.filters.paymentStatus')"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="filters.search"
              :label="$t('orders.filters.search')"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn
              color="error"
              variant="outlined"
              @click="clearFilters"
            >
              {{ $t('orders.filters.clear') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-menu
              v-model="dateMenu.from"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="filters.dateRange.from"
                  :label="$t('orders.filters.from')"
                  readonly
                  v-bind="props"
                />
              </template>
              <v-date-picker
                v-model="filters.dateRange.from"
                @update:model-value="dateMenu.from = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6">
            <v-menu
              v-model="dateMenu.to"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="filters.dateRange.to"
                  :label="$t('orders.filters.to')"
                  readonly
                  v-bind="props"
                />
              </template>
              <v-date-picker
                v-model="filters.dateRange.to"
                @update:model-value="dateMenu.to = false"
              />
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Orders Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="orders"
        :loading="loading"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
          >
            {{ $t(`orders.status.${item.status}`) }}
          </v-chip>
        </template>

        <template v-slot:item.paymentStatus="{ item }">
          <v-chip
            :color="getPaymentStatusColor(item.paymentStatus)"
            size="small"
          >
            {{ $t(`orders.paymentStatus.${item.paymentStatus}`) }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            size="small"
            color="primary"
            @click="viewOrder(item)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            v-if="isAdmin"
            icon
            size="small"
            color="error"
            @click="confirmDelete(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create Order Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card>
        <v-card-title>{{ $t('orders.createOrder') }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-select
              v-model="newOrder.serviceId"
              :items="services"
              item-title="name"
              item-value="_id"
              :label="$t('orders.form.service')"
              required
            />
            <v-select
              v-model="newOrder.workerId"
              :items="workers"
              item-title="name"
              item-value="_id"
              :label="$t('orders.form.worker')"
              required
            />
            <v-text-field
              v-model.number="newOrder.totalAmount"
              :label="$t('orders.form.amount')"
              type="number"
              required
            />
            <v-menu
              v-model="dateMenu.scheduled"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="newOrder.scheduledDate"
                  :label="$t('orders.form.scheduledDate')"
                  readonly
                  v-bind="props"
                />
              </template>
              <v-date-picker
                v-model="newOrder.scheduledDate"
                @update:model-value="dateMenu.scheduled = false"
              />
            </v-menu>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            variant="text"
            @click="showCreateDialog = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            @click="createOrder"
          >
            {{ $t('orders.form.submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title>{{ $t('orders.messages.deleteConfirm') }}</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="showDeleteDialog = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            @click="deleteOrder"
          >
            {{ $t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useOrdersStore } from '@/stores/modules/orders'
import { useAuthStore } from '@/stores/modules/authStore'

import type { Order, Service, Worker } from '@/stores/types'
import { useI18n } from 'vue3-i18n'
import { useServicesStore } from '@/stores/modules/services'
import { useWorkersStore } from '@/stores/modules/workers'

const { t } = useI18n()
const router = useRouter()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()
const servicesStore = useServicesStore()
const workersStore = useWorkersStore()

// State
const loading = ref(false)
const orders = ref<Order[]>([])
const services = ref<Service[]>([])
const workers = ref<Worker[]>([])
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedOrder = ref<Order | null>(null)
const valid = ref(false)

// Filters
const filters = ref({
  status: null,
  paymentStatus: null,
  search: '',
  dateRange: {
    from: null,
    to: null
  }
})

const dateMenu = ref({
  from: false,
  to: false,
  scheduled: false
})

// Computed
const isAdmin = computed(() => authStore.user?.role === 'admin')

const headers = computed(() => [
  { title: t('orders.table.orderId'), key: '_id' },
  { title: t('orders.table.service'), key: 'serviceId.name' },
  { title: t('orders.table.worker'), key: 'workerId.name' },
  { title: t('orders.table.amount'), key: 'totalAmount' },
  { title: t('orders.table.scheduledDate'), key: 'scheduledDate' },
  { title: t('orders.table.status'), key: 'status' },
  { title: t('orders.table.paymentStatus'), key: 'paymentStatus' },
  { title: t('orders.table.actions'), key: 'actions', sortable: false }
])

const statusOptions = computed(() => [
  { title: t('orders.status.pending'), value: 'pending' },
  { title: t('orders.status.in_progress'), value: 'in_progress' },
  { title: t('orders.status.completed'), value: 'completed' },
  { title: t('orders.status.cancelled'), value: 'cancelled' }
])

const paymentStatusOptions = computed(() => [
  { title: t('orders.paymentStatus.pending'), value: 'pending' },
  { title: t('orders.paymentStatus.paid'), value: 'paid' },
  { title: t('orders.paymentStatus.failed'), value: 'failed' },
  { title: t('orders.paymentStatus.refunded'), value: 'refunded' }
])

const newOrder = ref<Partial<Order>>({
  serviceId: undefined,
  workerId: undefined,
  totalAmount: undefined,
  scheduledDate: undefined
})

// Methods
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'error'
  }
  return colors[status] || 'grey'
}

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    paid: 'success',
    failed: 'error',
    refunded: 'info'
  }
  return colors[status] || 'grey'
}

const clearFilters = () => {
  filters.value = {
    status: null,
    paymentStatus: null,
    search: '',
    dateRange: {
      from: null,
      to: null
    }
  }
}

const loadOrders = async () => {
  try {
    loading.value = true
    const response = await ordersStore.getOrders(filters.value)
    orders.value = response.data
  } catch (error: any) {
    ElMessage.error(t('orders.messages.error'))
  } finally {
    loading.value = false
  }
}

const loadServices = async () => {
  try {
    const response = await servicesStore.getServices()
    services.value = response.data
  } catch (error: any) {
    ElMessage.error(t('services.messages.error'))
  }
}

const loadWorkers = async () => {
  try {
    const response = await workersStore.getWorkers()
    workers.value = response.data
  } catch (error: any) {
    ElMessage.error(t('workers.messages.error'))
  }
}

const createOrder = async () => {
  try {
    const orderData: Partial<Order> = {
      serviceId: newOrder.value.serviceId as string,
      workerId: newOrder.value.workerId as string,
      totalAmount: newOrder.value.totalAmount as number,
      scheduledDate: newOrder.value.scheduledDate as string
    }
    await ordersStore.createOrder(orderData)
    ElMessage.success(t('orders.messages.createSuccess'))
    showCreateDialog.value = false
    loadOrders()
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

const confirmDelete = (order: Order) => {
  selectedOrder.value = order
  showDeleteDialog.value = true
}

const deleteOrder = async () => {
  if (!selectedOrder.value) return
  try {
    await ordersStore.deleteOrder(selectedOrder.value._id)
    ElMessage.success(t('orders.messages.deleteSuccess'))
    showDeleteDialog.value = false
    loadOrders()
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

const viewOrder = (order: Order) => {
  router.push(`/orders/${order._id}`)
}

// Lifecycle
onMounted(() => {
  loadOrders()
  loadServices()
  loadWorkers()
})
</script>

<style scoped>
.orders-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters-card {
  margin-bottom: 20px;
}
</style> 