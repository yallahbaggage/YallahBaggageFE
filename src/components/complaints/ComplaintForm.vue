<template>
  <div class="complaint-form">
    <h2>{{ isEdit ? t('editComplaint') : t('newComplaint') }}</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="title">{{ t('complaintTitle') }}</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          class="input-field"
        />
      </div>

      <div class="form-group">
        <label for="description">{{ t('complaintDescription') }}</label>
        <textarea
          id="description"
          v-model="formData.description"
          required
          class="input-field"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="priority">{{ t('priority') }}</label>
        <DropdownListMap
          id="priority"
          :list="priorityOptions"
          :selectedValue="formData.priority"
          @change="(value: ComplaintPriority) => formData.priority = value"
        />
      </div>

      <div class="form-group" v-if="isAdmin">
        <label for="status">{{ t('status') }}</label>
        <DropdownListMap
          id="status"
          :list="statusOptions"
          :selectedValue="formData.status"
          @change="(value: ComplaintStatus) => formData.status = value"
        />
      </div>

      <div class="form-group">
        <label for="attachments">{{ t('attachments') }}</label>
        <input
          id="attachments"
          type="file"
          multiple
          @change="handleFileChange"
          class="input-field"
        />
      </div>

      <div class="form-actions">
        <ActionButton
          :buttonText="t('cancel')"
          buttonColor="white"
          @button-pressed="$emit('cancel')"
        />
        <ActionButton
          :buttonText="t('save')"
          buttonType="submit"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue3-i18n'
import { useAuthStore } from '@/stores/modules/authStore'
import {ComplaintPriority, ComplaintStatus, type IComplaint, type ICreateComplaint, type IUpdateComplaint } from '@/models/complaint'
import DropdownListMap from '../base/DropdownListMap.vue'
import ActionButton from '../base/ActionButton.vue'

// Define interface for the form data
interface ComplaintFormData {
  id?: string; // For updates
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus; // Allow status to be in form for admin updates/creation
  attachments?: string[];
}

const props = defineProps<{
  complaint?: IComplaint
}>()

const emit = defineEmits<{
  (e: 'submit', data: Partial<ICreateComplaint | IUpdateComplaint>): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const authStore = useAuthStore()

const isEdit = computed(() => !!props.complaint)
const isAdmin = computed(() => authStore.user?.role === 'admin')

// Use the new ComplaintFormData interface for formData
const formData = ref<ComplaintFormData>({
  title: '',
  description: '',
  priority: ComplaintPriority.MEDIUM,
  status: ComplaintStatus.PENDING,
  attachments: []
})

const selectedFiles = ref<File[]>([])

const statusOptions = [
  { key: t('pending'), value: ComplaintStatus.PENDING },
  { key: t('inProgress'), value: ComplaintStatus.IN_PROGRESS },
  { key: t('resolved'), value: ComplaintStatus.RESOLVED },
  { key: t('closed'), value: ComplaintStatus.CLOSED },
  { key: t('rejected'), value: ComplaintStatus.REJECTED }
]

const priorityOptions = [
  { key: t('low'), value: ComplaintPriority.LOW },
  { key: t('medium'), value: ComplaintPriority.MEDIUM },
  { key: t('high'), value: ComplaintPriority.HIGH },
  { key: t('urgent'), value: ComplaintPriority.URGENT }
]

onMounted(() => {
  if (props.complaint) {
    // Map IComplaint to ComplaintFormData for editing
    formData.value = {
      id: props.complaint._id,
      title: props.complaint.title,
      description: props.complaint.description,
      priority: props.complaint.priority,
      status: props.complaint.status,
      // Attachments are not loaded for editing in this form, users will add new ones
      attachments: []
    }
  }
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
    formData.value.attachments = selectedFiles.value; // Assign selected files to formData
  }
};

const handleSubmit = () => {
  // When submitting, create a new object that matches either ICreateComplaint or IUpdateComplaint structure
  const dataToSubmit: Partial<ICreateComplaint | IUpdateComplaint> = {
    title: formData.value.title,
    description: formData.value.description,
    priority: formData.value.priority,
    // Include status only if it's an update or if needed for creation (depending on backend)
    ...(isEdit.value && { status: formData.value.status }),
    ...(formData.value.attachments && { attachments: formData.value.attachments }),
  };

  // For creation, ensure required fields are present (like category if needed by backend create endpoint)
  // Assuming category is needed for creation based on ICreateComplaint, but not present in form yet.
  // For now, this might require backend adjustment or adding category to the form.
  // Let's assume backend can handle creation with just title, description, priority, attachments for now.
  // If category is strictly required, you'll need to add it to the form.
  if (!isEdit.value) {
    (dataToSubmit as Partial<ICreateComplaint>).category = 'other'; // Placeholder, adjust as needed
  }

  emit('submit', dataToSubmit);
}
</script>

<style lang="scss" scoped>
@use 'styles/main' as *;

.complaint-form {
  padding: $large;
  background: rgb(var(--v-theme-raisenBlack));
  border-radius: $primaryRadius;
  border: solid rgb(var(--v-theme-alternate)) thin;
}

.form {
  display: flex;
  flex-direction: column;
  gap: $large;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $x-small;

  label {
    font-weight: $font-weight-bold;
  }
}

.input-field {
  padding: $small;
  border-radius: $primaryRadius;
  border: 1px solid rgb(var(--v-theme-ashGray));
  background: rgb(var(--v-theme-white));
  color: rgb(var(--v-theme-black));

  &:focus {
    outline: none;
    border-color: rgb(var(--v-theme-primary));
  }
}

.form-actions {
  display: flex;
  gap: $small;
  justify-content: flex-end;
  margin-top: $large;
}
</style> 