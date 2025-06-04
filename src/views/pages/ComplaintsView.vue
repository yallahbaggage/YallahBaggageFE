<template>
  <div>
    <UserNameAndTime />
    <template v-if="authStore.user?._id">
      <div class="complaint-cards-container">
        <AgentCard
          :cardTitle="complaintDashboard?.pendingComplaints?.toString() ?? '0'"
          :cardDescription="t('pendingComplaints')"
          iconName="mdi-alert-circle-outline"
          :class="'pending-complaint'"
        />
        <AgentCard
          :cardTitle="complaintDashboard?.inProgressComplaints?.toString() ?? '0'"
          :cardDescription="t('inProgressComplaints')"
          iconName="mdi-progress-clock"
          :class="'in-progress-complaint'"
        />
        <AgentCard
          :cardTitle="complaintDashboard?.resolvedComplaints?.toString() ?? '0'"
          :cardDescription="t('resolvedComplaints')"
          iconName="mdi-check-circle-outline"
          :class="'resolved-complaint'"
        />
      </div>
    </template>
  </div>

  <!-- Filter Drawer -->
  <Drawer
    :isOpen="isFilterDrawerOpen"
    :title="t('complaintFilter')"
    @close="isFilterDrawerOpen = false"
  >
    <div style="max-height: 75vh">
      <form @submit.prevent="onFilterButtonPressed()" class="form">
        <input
          v-model="searchText"
          type="text"
          :placeholder="t('searchComplaints')"
          class="input-field"
        />
        <DropdownListMap
          :list="statusOptions"
          :selectedValue="selectedStatus"
          @change="onSelectedStatusChanged"
        />
        <DropdownListMap
          :list="priorityOptions"
          :selectedValue="selectedPriority"
          @change="onSelectedPriorityChanged"
        />
        <div class="action-btns">
          <ActionButton
            :buttonText="t('clear')"
            buttonColor="white"
            :buttonSize="SizeEnum.large"
            @button-pressed="clearFilter"
          />
          <ActionButton
            button-icon="mdi-filter"
            :buttonText="t('filters')"
            :buttonSize="SizeEnum.large"
            buttonType="submit"
          />
        </div>
      </form>
    </div>
  </Drawer>

  <TableHeader
    :title="t('complaints')"
    icon-name="mdi-refresh"
    :buttonText="t('addComplaint')"
    :onIconPressed="renewItems"
    :onButtonPressed="() => { isComplaintFormOpen = true }"
  />

  <!-- Complaint Form Drawer -->
  <Drawer
    :isOpen="isComplaintFormOpen"
    :title="editingComplaint ? t('editComplaint') : t('newComplaint')"
    @close="closeComplaintForm"
  >
    <ComplaintForm
      :complaint="editingComplaint"
      @submit="handleComplaintSubmit"
      @cancel="closeComplaintForm"
    />
  </Drawer>

  <!-- ServerTable -->
  <WaitingView v-if="loading" :message="t('loadingText')" />
  <div v-else-if="!loading && tableData.length > 0" class="complaint-container">
    <ServerTable
      v-if="!loading"
      :items="tableData"
      :headers="headers"
      :totalItems="totalItems"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :page.sync="page"
      :items-per-page.sync="itemsPerPage"
      :loading="loading"
      @update:page="page = $event"
      @update:items-per-page="itemsPerPage = $event"
      :no-data-message="t('noComplaintsFound')"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>
            <div class="flex-status">
              <StatusIcon :status="item.status" />
              <DropdownList
                v-if="isAdmin"
                :list="statusOptions"
                :selectedValue="item.status"
                @change="(newStatus: string) => updateComplaintStatus(item.id, newStatus)"
              />
              <span v-else>{{ t(item.status) }}</span>
            </div>
          </td>
          <td>
            <div class="flex-status">
              <StatusIcon :status="item.priority" />
              {{ t(item.priority) }}
            </div>
          </td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>
            <div class="action-buttons">
              <v-icon
                size="20"
                class="action-icon"
                @click="editComplaint(item)"
                role="button"
                :id="item.id"
                :aria-label="t('editComplaint')"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                v-if="isAdmin"
                size="20"
                class="action-icon"
                @click="deleteComplaint(item.id)"
                role="button"
                :id="item.id"
                :aria-label="t('deleteComplaint')"
              >
                mdi-delete
              </v-icon>
            </div>
          </td>
        </tr>
      </template>
    </ServerTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue3-i18n'
import { useRouter } from 'vue-router'
import { ComplaintService } from '@/utils/services/complaintService'
import { useAuthStore } from '@/stores/modules/authStore'
import { ComplaintStatus, ComplaintPriority, type IComplaint, IComplaintStats, ICreateComplaint, IUpdateComplaint} from '@/models/complaint';
import { SizeEnum } from '@/enums'
import { formatDate } from '@/utils/helpers/date-helper'
import ComplaintForm from '@/components/complaints/ComplaintForm.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const complaintService = new ComplaintService()

const complaintDashboard = ref<IComplaintStats>({
  totalComplaints: 0,
  resolvedComplaints: 0,
  pendingComplaints: 0,
  inProgressComplaints: 0,
  averageResolutionTime: 0,
  complaintsByCategory: {} as Record<string, number>,
  complaintsByPriority: {} as Record<ComplaintPriority, number>,
  complaintsByStatus: {} as Record<ComplaintStatus, number>
})

const headers = computed(() => [
  { key: 'title', title: t('title') },
  { key: 'description', title: t('description') },
  { key: 'status', title: t('status') },
  { key: 'priority', title: t('priority') },
  { key: 'createdAt', title: t('createdAt') },
  { key: 'actions', title: t('actions') },
])

const totalItems = ref(0)
const loading = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref<readonly any[]>([])
const sortDesc = ref<boolean[]>([])
const tableData = ref<IComplaint[]>([])
const isFilterDrawerOpen = ref(false)
const searchText = ref('')
const isAdmin = computed(() => authStore.user?.role === 'admin')

const statusOptions = [
  { key: t('allStatuses'), value: '' },
  { key: t('pending'), value: ComplaintStatus.PENDING },
  { key: t('inProgress'), value: ComplaintStatus.IN_PROGRESS },
  { key: t('resolved'), value: ComplaintStatus.RESOLVED },
  { key: t('closed'), value: ComplaintStatus.CLOSED },
  { key: t('rejected'), value: ComplaintStatus.REJECTED },
]

const priorityOptions = [
  { key: t('allPriorities'), value: '' },
  { key: t('low'), value: ComplaintPriority.LOW },
  { key: t('medium'), value: ComplaintPriority.MEDIUM },
  { key: t('high'), value: ComplaintPriority.HIGH },
  { key: t('urgent'), value: ComplaintPriority.URGENT },
]

const selectedStatus = ref(statusOptions[0])
const selectedPriority = ref(priorityOptions[0])

const fetchComplaints = async (page: number) => {
  try {
    loading.value = true
    const response = await complaintService.fetchComplaints(
      page,
      itemsPerPage.value,
      {
        search: searchText.value,
        status: selectedStatus.value.value as ComplaintStatus,
        priority: selectedPriority.value.value as ComplaintPriority,
      }
    )
    totalItems.value = response.totalCount
    tableData.value = response.data
  } catch (error) {
    console.error('Error fetching complaints:', error)
  } finally {
    loading.value = false
  }
}

const updateComplaintStatus = async (id: string, newStatus: string) => {
  try {
    await complaintService.updateComplaintStatus(id, newStatus)
    await fetchComplaints(page.value)
  } catch (error) {
    console.error('Error updating complaint status:', error)
  }
}

const isComplaintFormOpen = ref(false)
const editingComplaint = ref<IComplaint | undefined>(undefined)

const closeComplaintForm = () => {
  isComplaintFormOpen.value = false
  editingComplaint.value = undefined
}

const handleComplaintSubmit = async (data: Partial<ICreateComplaint | IUpdateComplaint>) => {
  try {
    if (editingComplaint.value) {
      await complaintService.updateComplaint(editingComplaint.value.id, data as Partial<IUpdateComplaint>)
    } else {
      const createData: ICreateComplaint = {
        title: data.title ?? '',
        description: data.description ?? '',
        priority: data.priority ?? ComplaintPriority.MEDIUM,
        category: (data as Partial<ICreateComplaint>).category ?? 'other',
        relatedWorkerId: (data as Partial<ICreateComplaint>).relatedWorkerId,
        attachments: data.attachments
      };
      await complaintService.createComplaint(createData);
    }
    await fetchComplaints(page.value)
    closeComplaintForm()
  } catch (error) {
    console.error('Error saving complaint:', error)
  }
}

const editComplaint = (complaint: IComplaint) => {
  editingComplaint.value = complaint
  isComplaintFormOpen.value = true
}

const deleteComplaint = async (id: string) => {
  if (confirm(t('confirmDeleteComplaint'))) {
    try {
      await complaintService.deleteComplaint(id)
      await fetchComplaints(page.value)
    } catch (error) {
      console.error('Error deleting complaint:', error)
    }
  }
}

const onFilterButtonPressed = () => {
  page.value = 1
  fetchComplaints(page.value)
  isFilterDrawerOpen.value = false
}

const clearFilter = () => {
  searchText.value = ''
  selectedStatus.value = statusOptions[0]
  selectedPriority.value = priorityOptions[0]
  page.value = 1
  fetchComplaints(page.value)
  isFilterDrawerOpen.value = false
}

const renewItems = () => {
  fetchComplaints(page.value)
}

const onSelectedStatusChanged = (newValue: string) => {
  selectedStatus.value = statusOptions.find(option => option.value === newValue) || statusOptions[0]
}

const onSelectedPriorityChanged = (newValue: string) => {
  selectedPriority.value = priorityOptions.find(option => option.value === newValue) || priorityOptions[0]
}

watch([page, itemsPerPage, sortBy, sortDesc], () => {
  fetchComplaints(page.value)
})

onMounted(() => {
  fetchComplaints(page.value)
})
</script>

<style lang="scss">
@use 'styles/main' as *;

.complaint-cards-container {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 3rem;
  padding: $large;
  background: rgb(var(--v-theme-raisenBlack));
  border-radius: 10px;
  margin-top: 4px !important;
  border: solid rgb(var(--v-theme-alternate)) thin;
}

.pending-complaint {
  color: rgb(var(--v-theme-sunsetOrange));
}

.in-progress-complaint {
  color: rgb(var(--v-theme-primary));
}

.resolved-complaint {
  color: rgb(var(--v-theme-mintGreen));
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-field {
  border-radius: 8px;
  padding: 0.8rem;
  border: 1px solid rgb(var(--v-theme-ashGray));
}

.input-field:focus {
  outline: none;
}

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  bottom: 0;
  width: 95%;
  margin-bottom: 20px;
}

.complaint-container {
  .v-table--density-default {
    border-radius: $primaryRadius;
  }

  .v-data-table__tbody {
    overflow-y: scroll;
  }
}

.flex-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-icon {
  cursor: pointer;
  &:hover {
    color: rgb(var(--v-theme-primary));
  }
}

@media (max-width: 768px) {
  .form {
    gap: 12px;
  }

  .input-field {
    padding: 0.6rem;
  }
}
</style> 