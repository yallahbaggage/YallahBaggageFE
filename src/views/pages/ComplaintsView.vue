<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-headphones'"
      :title="t('customerSupport')"
      :desc="t('manageYourCustomerSupportRequests')"
    />
    <div class="page-content">
      <div class="cards">
        <InfoCard class="infoCard" :cardTitle="t('totalIssues')">
          {{ stats.totalComplaints }}
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('openIssues')">
          {{ stats.openComplaints }}
        </InfoCard>
        <InfoCard class="infoCard" :cardTitle="t('solvedIssues')">
          {{ stats.solvedComplaints }}
        </InfoCard>
      </div>
      <hr class="infoHr" />
      <ServerSideTable
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="items"
        :total-items="totalItems"
        :loading="loading"
      >
        <template #cell-status="{ item }">
          <v-chip :color="statusColor(item.status)" text-color="white" small>
            <span class="status-circle"> </span>
            {{ t(item.status ?? 'pending') }}
          </v-chip>
        </template>
        <template #cell-_id="{ item }">
          {{ item._id.substring(0, 12) }}
        </template>
        <!-- <template #cell-priority="{ item }">
          <v-chip
            :color="
              item.priority === 'urgent'
                ? 'red'
                : item.priority === 'high'
                  ? 'orange'
                  : item.priority === 'medium'
                    ? 'blue'
                    : 'grey'
            "
            text-color="white"
            small
          >
            {{ item.priority }}
          </v-chip>
        </template> -->
        <template #cell-createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
        </template>
        <template #actions="{ item }">
          <v-menu location="bottom end" offset="4">
            <template #activator="{ props }">
              <v-btn icon v-bind="props" variant="text" density="comfortable">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="menu-list pa-0 ma-0">
              <v-list-item class="menu-item" @click="viewDetails(item)">
                <v-icon class="mr-2">mdi-eye-outline</v-icon>
                {{ t('seeDetails') }}
              </v-list-item>
              <v-list-item class="menu-item" @click="deleteComplaint(item)">
                <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                {{ t('deleteIssue') }}
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </ServerSideTable>
    </div>
    <!-- delete Drawer -->
    <Drawer
      :isOpen="isDeleteComplaintDrawerOpen"
      :title="t('complaint') + ' ' + '#' + selectedComplaint?._id.substring(0, 12)"
      :desc="
        t('employee') +
        ' ' +
        '#' +
        (selectedComplaint?.relatedWorkerId?._id
          ? selectedComplaint.relatedWorkerId._id.substring(0, 12)
          : 'N/A')
      "
      :status="selectedComplaint?.status ? t(selectedComplaint?.status) : t('Available')"
      @close="isDeleteComplaintDrawerOpen = false"
    >
      <div style="max-height: 75vh">
        <form class="form">
          <div>
            <p class="complaint-title">{{ selectedComplaint?.title }}</p>
            <p class="complaint-description">{{ selectedComplaint?.description }}</p>
            <div class="drawer-banner">
              <p>{{ t('information') }}</p>
            </div>
            <div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reportedBy') }}</p>
                <p class="drawer-value">{{ selectedComplaint?.userId?.name ?? 'N/A' }}</p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reporterId') }}</p>
                <p class="drawer-value">
                  {{ selectedComplaint?.userId?._id?.substring(0, 12) ?? 'N/A' }}
                </p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reporterPhoneNumber') }}</p>
                <p class="drawer-value">{{ selectedComplaint?.userId?.phone ?? 'N/A' }}</p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reportedOn') }}</p>
                <p class="drawer-value">
                  {{
                    selectedComplaint?.createdAt
                      ? new Date(selectedComplaint.createdAt).toLocaleString()
                      : 'N/A'
                  }}
                </p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('status') }}</p>
                <p class="drawer-value">{{ t(selectedComplaint?.status ?? 'pending') }}</p>
              </div>
            </div>
            <div class="action-btns">
              <ActionButton
                :buttonText="t('cancel')"
                buttonColor="white"
                class="action-Btn"
                @button-pressed="() => (isDeleteComplaintDrawerOpen = false)"
              />
              <ActionButton
                button-color="error"
                :buttonText="t('deleteIssue')"
                class="action-Btn"
                @button-pressed="
                  () => {
                    isConfirmDeletePopupVisible = true
                    isDeleteComplaintDrawerOpen = false
                  }
                "
              />
            </div>
          </div>
        </form>
      </div>
    </Drawer>
    <!-- delete Drawer -->

    <!-- Details Drawer -->
    <Drawer
      :isOpen="isDetailsComplaintDrawerOpen"
      :title="t('complaint') + ' ' + '#' + selectedComplaint?._id.substring(0, 12)"
      :desc="
        t('employee') +
        ' ' +
        '#' +
        (selectedComplaint?.relatedWorkerId?._id
          ? selectedComplaint.relatedWorkerId._id.substring(0, 12)
          : 'N/A')
      "
      :status="selectedComplaint?.status ? t(selectedComplaint?.status) : t('Available')"
      @close="isDetailsComplaintDrawerOpen = false"
    >
      <div style="max-height: 75vh">
        <form class="form">
          <div>
            <div class="drawer-banner">
              <p>{{ t('information') }}</p>
            </div>
            <div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reportedBy') }}</p>
                <p class="drawer-value">{{ selectedComplaint?.userId?.name ?? 'N/A' }}</p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reporterId') }}</p>
                <p class="drawer-value">
                  {{ selectedComplaint?.userId?._id?.substring(0, 12) ?? 'N/A' }}
                </p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reporterPhoneNumber') }}</p>
                <p class="drawer-value">{{ selectedComplaint?.userId?.phone ?? 'N/A' }}</p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('reportedOn') }}</p>
                <p class="drawer-value">
                  {{
                    selectedComplaint?.createdAt
                      ? new Date(selectedComplaint.createdAt).toLocaleString()
                      : 'N/A'
                  }}
                </p>
              </div>
              <div class="drawer-info">
                <p class="drawer-key">{{ t('status') }}</p>
                <p class="drawer-value">{{ t(selectedComplaint?.status ?? 'pending') }}</p>
              </div>
            </div>
            <div class="drawer-banner">
              <p>{{ t('ticketActivity') }}</p>
            </div>
            <div class="action-btns">
              <ActionButton
                :buttonText="t('cancel')"
                buttonColor="white"
                @button-pressed="() => (isDetailsComplaintDrawerOpen = false)"
                class="action-Btn"
              />
              <ActionButton
                class="action-Btn"
                :buttonText="t('DetailsEmployee')"
                buttonType="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </Drawer>
    <!-- Details Drawer -->
    <ConfirmPopupDialog
      :isVisible="isConfirmDeletePopupVisible"
      :title="t('deleteConfirmBanner')"
      :message="t('deleteConfirmBannerDescription')"
      :icon="'mdi-trash-can-outline'"
      :iconColor="'error'"
      @cancel="closeDeletePopup"
      @apply="onDeleteButtonPressed(selectedComplaint!._id)"
      :cancelText="t('cancel')"
      :applyText="t('deleteConfirmButton')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import ServerSideTable from '@/components/base/ServerTable.vue'
import { useComplaintsStore } from '@/stores/modules/complaints'
import { useI18n } from 'vue3-i18n'
import { IComplaint } from '@/models/complaint'
import Drawer from '@/components/base/Drawer.vue'
import ActionButton from '@/components/base/ActionButton.vue'
import { toastDeleteMessage } from '@/utils/helpers/notification'
import ConfirmPopupDialog from '@/components/base/ConfirmPopupDialog.vue'

const { t } = useI18n()
const complaintsStore = useComplaintsStore()

const page = ref(1)
const itemsPerPage = ref(8)
const selectedComplaint = ref<IComplaint | null>(null)
const isDeleteComplaintDrawerOpen = ref(false)
const isDetailsComplaintDrawerOpen = ref(false)
const isConfirmDeletePopupVisible = ref(false)

const closeDeletePopup = () => (isConfirmDeletePopupVisible.value = false)

const onDetailsButtonPressed = () => {
  if (selectedComplaint.value) {
    isDetailsComplaintDrawerOpen.value = true
  }
}

const headers = ref([
  { title: 'ID', key: '_id' },
  { title: 'Title', key: 'title' },
  { title: 'Category', key: 'category' },
  // { title: 'Priority', key: 'priority' },
  { title: 'Status', key: 'status' },
  { title: 'Created At', key: 'createdAt' },
  { title: t('actions'), key: '', sortable: false },
])

const items = computed(() => complaintsStore.allComplaints)
const totalItems = computed(() => complaintsStore.paginationInfo?.total ?? 0)
const loading = computed(() => complaintsStore.isLoading)

const stats = computed(
  () => complaintsStore.stats ?? { totalComplaints: 0, openComplaints: 0, solvedComplaints: 0 },
)

const fetchComplaints = async () => {
  await complaintsStore.fetchComplaints({
    page: String(page.value),
    limit: String(itemsPerPage.value),
  })
  if (complaintsStore.paginationInfo && complaintsStore.paginationInfo.page !== page.value) {
    page.value = Number(complaintsStore.paginationInfo.page)
  }
  const totalPages = Math.ceil((complaintsStore.paginationInfo?.total ?? 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

function viewDetails(item: any) {
  selectedComplaint.value = item as IComplaint
  isDetailsComplaintDrawerOpen.value = true
}

function deleteComplaint(item: any) {
  selectedComplaint.value = item as IComplaint
  isDeleteComplaintDrawerOpen.value = true
}

const onDeleteButtonPressed = async (selectedComplaintId: string) => {
  if (!selectedComplaintId) {
    console.error('No complaint selected for deletion')
    return
  }
  await complaintsStore.deleteComplaint(selectedComplaintId)
  toastDeleteMessage(t('toastDeleteComplaintTitle'), t('toastDeleteComplaintDescription'))
  isDeleteComplaintDrawerOpen.value = false
  isConfirmDeletePopupVisible.value = false
}

const fetchStats = async () => {
  await complaintsStore.getComplaintsStatsPage()
}

onMounted(() => {
  fetchComplaints()
  fetchStats()
})

watch([page, itemsPerPage], fetchComplaints)

function statusColor(status: string) {
  return (
    {
      pending: 'orange',
      in_progress: 'blue',
      resolved: 'green',
      rejected: 'red',
      closed: 'grey',
    }[status?.toLowerCase()] ?? 'primary'
  )
}
</script>
<style scoped lang="scss">
.complaint-title {
  font-size: 18px;
  font-style: bold;
  font-weight: 500;
  line-height: 24px; /* 133.333% */
  letter-spacing: -0.27px;
}
.complaint-description {
  margin: 16px 0;
  max-width: 400px;
  color: #5c5c5c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.084px;
}
</style>
