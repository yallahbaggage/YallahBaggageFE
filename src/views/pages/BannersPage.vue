<template>
  <div class="app-management-page">
    <BaseHeader
      :pageImage="BannerIcon"
      :title="t('banners')"
      :desc="t('manageYourAppsBanners')"
      :show-button="true"
      :button-text="t('newBanner')"
      v-on:button-pressed="() => (isAddDrawerOpen = true)"
    />
    <div class="page-content">
      <!-- Loading state for initial page load -->
      <div v-if="initialLoading" class="loading-state">
        <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        <p>{{ t('loading') }}</p>
      </div>
      
      <!-- Content when loaded -->
      <div v-else>
        <div class="cards">
          <InfoCard class="infoCard" :cardTitle="t('totalBanners')">
            {{ stats.totalAds }}
          </InfoCard>
          <InfoCard class="infoCard" :cardTitle="t('activeBanners')">
            {{ stats.activeAds }}
          </InfoCard>
          <InfoCard class="infoCard" :cardTitle="t('deactiveBanners')">
            {{ stats.deactiveAds }}
          </InfoCard>
        </div>
        <hr class="infoHr" />
        <ServerTable
          :headers="headers"
          :items="ads"
          :total-items="pagination.total"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
        >
          <template #cell-_id="{ item }"> #{{ item._id.substring(0, 10) }} </template>
          <template #cell-image="{ item }">
            <img
              :src="item.image"
              style="max-width: 78px;align-self: center;margin-top:5px;border-radius: 2px; width: 78px; max-height: 40px; object-fit: cover"
            />
          </template>
          <template #cell-title="{ item }">
            <span class="name-bold">{{ item.title }}</span>
          </template>
          <template #cell-status="{ item }">
            <v-chip :color="getColorAccordingToExpireDate(item?.expireDate)" text-color="white" small>
              <span
                :style="{ backgroundColor: statusColorAccordingToExpireDate(item.expireDate) }"
                class="status-circle"
              ></span>
              {{ getStatusAccordingToExpireDate(item.expireDate) }}
            </v-chip>
          </template>
          <template #cell-expireDate="{ item }">
            <span>
              {{ formatDateWithoutTime(item?.startAt ?? item.createdAt) }} -
              {{ formatDateWithoutTime(item.expireDate) }}</span
            >
          </template>
          <template #actions="{ item }">
            <v-menu location="bottom end" offset="4">
              <template #activator="{ props }">
                <v-btn icon v-bind="props" variant="text" density="comfortable">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list class="menu-list-style">
                <v-list-item class="menu-item" @click="viewDetails(item)">
                  <v-icon class="mr-2">mdi-eye-outline</v-icon>
                  {{ t('seeDetails') }}
                </v-list-item>
                <v-list-item class="menu-item" @click="editBanner(item)">
                  <v-icon class="mr-2">mdi-pencil-outline</v-icon>
                  {{ t('editBanner') }}
                </v-list-item>
                <v-list-item class="menu-item" @click="deleteAd(item)">
                  <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                  {{ t('deleteBanner') }}
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </ServerTable>
        <!-- add Drawer -->
        <Drawer
          :isOpen="isAddDrawerOpen"
          :title="t('addNewBanner')"
          :desc="t('fillOutAllTheInformationsToAdd')"
          @close="
            () => {
              isAddDrawerOpen = false
              resetForm()
            }
          "
        >
          <div style="max-height: 75vh">
            <form @submit.prevent="onAddButtonPressed()" class="form">
              <div>
                <div class="drawer-banner">
                  <p>{{ t('generalInformation') }}</p>
                </div>
                <div>
                  <div class="drawer-form-group">
                    <label for="name" class="drawer-label-group">
                      {{ t('bannerName') }}<span class="required">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      class="form-input no-focus-border"
                      placeholder="Banner title here"
                      v-model="newBanner.title"
                      required
                    />
                  </div>
                  <div class="drawer-info">
                    <p class="banner-key">
                      {{ t('startAt') }}
                      <v-text-field
                        v-model="newBanner.startAt"
                        type="date"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="no-focus-border"
                      />
                    </p>
                    <p class="banner-value">
                      {{ t('expireAt') }}
                      <v-text-field
                        v-model="newBanner.expireDate"
                        type="date"
                        variant="outlined"
                        density="compact"
                        hide-details
                        required
                        class="no-focus-border"
                      />
                    </p>
                  </div>

                  <div class="drawer-form-group">
                    <label for="banner-url-add" class="drawer-label-group">
                      {{ t('bannerwillRedirectTo') }}</label
                    >
                    <v-text-field
                      id="banner-url-add"
                      v-model="newBanner.url"
                      placeholder="www.example.com"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="no-focus-border"
                    >
                      <template v-slot:prepend-inner>
                        <span class="url-prefix">://app</span>
                      </template>
                    </v-text-field>
                  </div>

                  <div class="drawer-form-group">
                    <label for="file-upload-add" class="drawer-label-group">Image</label>
                    <div
                      class="image-upload-area"
                      :class="{ 'drag-over': isDragOver }"
                      @drop.prevent="handleDrop"
                      @dragover.prevent="isDragOver = true"
                      @dragleave.prevent="isDragOver = false"
                    >
                      <div
                        v-if="!imageUrl && !imageUploadProgress"
                        class="upload-placeholder"
                        @click="triggerFileInput"
                      >
                        <v-icon size="36" color="grey">mdi-cloud-upload-outline</v-icon>
                        <p>{{ t('chooseFileOrDragDrop') }}</p>
                        <p class="subtext">JPEG, PNG, and WebP formats, up to 3 MB.</p>
                        <v-btn variant="outlined" color="primary" class="browse-btn"
                          >Browse File</v-btn
                        >
                        <v-file-input
                          ref="fileInput"
                          id="file-upload-add"
                          @change="uploadImage"
                          accept="image/*"
                          style="display: none"
                        />
                      </div>

                      <div v-if="imageUrl" class="uploaded-preview">
                        <img :src="imageUrl" class="preview-img" />
                        <div class="file-info">
                          <span class="file-name">{{ uploadedFileName }}</span>
                          <span class="file-size">{{ uploadedFileSize }}</span>
                        </div>
                        <v-btn icon @click.stop="removeImage" variant="text" size="small">
                          <v-icon color="red">mdi-close</v-icon>
                        </v-btn>
                      </div>

                      <div v-if="imageUploadProgress > 0" class="upload-progress-container">
                        <img src="@/assets/images/logo.svg" alt="file" class="file-icon" />
                        <div class="progress-details">
                          <div class="file-name">{{ uploadedFileName }}</div>
                          <div class="progress-text">
                            {{ uploadedFileSize }} of {{ totalFileSize }} - Uploading...
                          </div>
                          <v-progress-linear
                            :model-value="imageUploadProgress"
                            height="6"
                            color="primary"
                            rounded
                          />
                        </div>
                        <v-btn icon @click.stop="removeImage" variant="text" size="small">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                  <div class="drawer-form-group">
                    <label for="name" class="drawer-label-group">
                      {{ t('bannerStatus') }}
                    </label>
                    <v-select
                      v-model="newBanner.status"
                      :items="['active', 'deactive']"
                      variant="outlined"
                      density="compact"
                      required
                      hide-details
                      class="no-focus-border"
                    />
                  </div>
                </div>
                <div class="action-btns">
                  <ActionButton
                    :buttonText="t('cancel')"
                    buttonColor="white"
                    @button-pressed="
                      () => {
                        isAddDrawerOpen = false
                        resetForm()
                      }
                    "
                    class="action-Btn"
                  />
                  <ActionButton :buttonText="t('save')" buttonType="submit" class="action-Btn" />
                </div>
              </div>
            </form>
          </div>
        </Drawer>
        <!-- add Drawer -->
        <!-- update Drawer -->
        <Drawer
          :isOpen="isUpdateDrawerOpen"
          :title="t('updateBanner')"
          :desc="t('updateTheBannerInformation')"
          @close="
            () => {
              isUpdateDrawerOpen = false
              resetForm()
            }
          "
        >
          <div style="max-height: 75vh">
            <form @submit.prevent="onUpdateButtonPressed()" class="form" v-if="editingBanner">
              <div>
                <div class="drawer-banner">
                  <p>{{ t('generalInformation') }}</p>
                </div>
                <div>
                  <div class="drawer-form-group">
                    <label for="name" class="drawer-label-group">
                      {{ t('bannerName') }}<span class="required">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      class="form-input no-focus-border"
                      placeholder="Banner title here"
                      v-model="editingBanner.title"
                      required
                    />
                  </div>
                  <div class="drawer-info">
                    <p class="banner-key">
                      {{ t('startAt') }}
                      <v-text-field
                        v-model="editingBanner.startAt"
                        type="date"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="no-focus-border"
                      />
                    </p>
                    <p class="banner-value">
                      {{ t('expireAt') }}
                      <v-text-field
                        v-model="editingBanner.expireDate"
                        type="date"
                        variant="outlined"
                        density="compact"
                        hide-details
                        required
                        class="no-focus-border"
                      />
                    </p>
                  </div>

                  <div class="drawer-form-group">
                    <label for="banner-url-update" class="drawer-label-group">
                      {{ t('bannerwillRedirectTo') }}</label
                    >
                    <v-text-field
                      id="banner-url-update"
                      v-model="editingBanner.url"
                      placeholder="www.example.com"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="no-focus-border"
                    >
                      <template v-slot:prepend-inner>
                        <span class="url-prefix">://app</span>
                      </template>
                    </v-text-field>
                  </div>

                  <div class="drawer-form-group">
                    <label for="file-upload-update" class="drawer-label-group">Image</label>
                    <div
                      class="image-upload-area"
                      :class="{ 'drag-over': isDragOver }"
                      @drop.prevent="handleDrop"
                      @dragover.prevent="isDragOver = true"
                      @dragleave.prevent="isDragOver = false"
                    >
                      <div
                        v-if="!imageUrl && !imageUploadProgress"
                        class="upload-placeholder"
                        @click="triggerFileInput"
                      >
                        <v-icon size="36" color="grey">mdi-cloud-upload-outline</v-icon>
                        <p>{{ t('chooseFileOrDragDrop') }}</p>
                        <p class="subtext">JPEG, PNG, and WebP formats, up to 3 MB.</p>
                        <v-btn variant="outlined" color="primary" class="browse-btn"
                          >Browse File</v-btn
                        >
                        <v-file-input
                          ref="fileInput"
                          id="file-upload-update"
                          @change="uploadImage"
                          accept="image/*"
                          style="display: none"
                        />
                      </div>
                      <div v-if="imageUrl && !imageUploadProgress" class="uploaded-preview">
                        <img :src="imageUrl" class="preview-img" />
                        <div class="file-info">
                          <span class="file-name">{{ uploadedFileName }}</span>
                          <span class="file-size">{{ uploadedFileSize }}</span>
                        </div>
                        <v-btn icon @click.stop="removeImage" variant="text" size="small">
                          <v-icon color="red">mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </div>

                      <div v-if="imageUploadProgress > 0" class="upload-progress-container">
                        <img src="@/assets/images/logo.svg" alt="file" class="file-icon" />
                        <div class="progress-details">
                          <div class="file-name">{{ uploadedFileName }}</div>
                          <div class="progress-text">
                            {{ uploadedFileSize }} of {{ totalFileSize }} - Uploading...
                          </div>
                          <v-progress-linear
                            :model-value="imageUploadProgress"
                            height="6"
                            color="primary"
                            rounded
                          />
                        </div>
                        <v-btn icon @click.stop="removeImage" variant="text" size="small">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                  <div class="drawer-form-group">
                    <label for="name" class="drawer-label-group">
                      {{ t('bannerStatus') }}
                    </label>
                    <v-select
                      v-model="editingBanner.status"
                      :items="['active', 'deactive']"
                      variant="outlined"
                      density="compact"
                      required
                      hide-details
                      class="no-focus-border"
                    />
                  </div>
                </div>
                <div class="action-btns">
                  <ActionButton
                    :buttonText="t('cancel')"
                    buttonColor="white"
                    @button-pressed="
                      () => {
                        isUpdateDrawerOpen = false
                        resetForm()
                      }
                    "
                    class="action-Btn"
                  />
                  <ActionButton :buttonText="t('save')" buttonType="submit" class="action-Btn" />
                </div>
              </div>
            </form>
          </div>
        </Drawer>
        <!-- update Drawer -->
        <!-- see details Drawer and delete-->
        <Drawer
          :isOpen="isDetailsDrawerOpen || isDeleteDrawerOpen"
          :desc="t('id') + ' #' + selectedAd?._id.substring(0, 10)"
          :title="selectedAd?.title"
          @close="
            () => {
              isDetailsDrawerOpen = false
              isDeleteDrawerOpen = false
            }
          "
        >
          <div style="max-height: 75vh">
            <form class="form">
              <div>
                <div class="drawer-banner">
                  <p>{{ t('information') }}</p>
                </div>
                <div>
                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('bannerName') }}</p>
                    <p class="drawer-value">{{ selectedAd?.title ?? 'N/A' }}</p>
                  </div>
                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('id') }}</p>
                    <p class="drawer-value">#{{ selectedAd?._id.substring(0, 10) }}</p>
                  </div>
                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('url') }}</p>
                    <p class="drawer-value">{{ selectedAd?.url ?? 'N/A' }}</p>
                  </div>
                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('startAt') }}</p>
                    <p class="drawer-value">
                      {{
                        formatDateWithoutTime(selectedAd?.startAt ?? selectedAd?.createdAt ?? '') ??
                        'N/A'
                      }}
                    </p>
                  </div>
                  <div class="drawer-info">
                    <p class="drawer-key">{{ t('expireAt') }}</p>
                    <p class="drawer-value">
                      {{ formatDateWithoutTime(selectedAd?.expireDate ?? '') ?? 'N/A' }}
                    </p>
                  </div>
                </div>
                <hr v-if="isDeleteDrawerOpen" class="infoHr" />

                <div v-if="isDeleteDrawerOpen" class="action-btns">
                  <ActionButton
                    :buttonText="t('cancel')"
                    buttonColor="white"
                    class="action-Btn"
                    @button-pressed="() => (isDetailsDrawerOpen = false)"
                  />
                  <ActionButton
                    button-color="error"
                    :buttonText="t('deleteBanner')"
                    class="action-Btn"
                    @button-pressed="
                      () => {
                        isConfirmDeletePopupVisible = true
                        isDetailsDrawerOpen = false
                        isDeleteDrawerOpen = false
                      }
                    "
                  />
                </div>
              </div>
            </form>
          </div>
        </Drawer>
        <!-- see details-->

        <ConfirmPopupDialog
          :isVisible="isConfirmDeletePopupVisible"
          :title="t('deleteConfirmBanner')"
          :message="t('deleteConfirmBannerDescription')"
          :icon="'mdi-trash-can-outline'"
          :iconColor="'error'"
          @cancel="closeDeletePopup"
          @apply="onDeleteButtonPressed(selectedAd!._id)"
          :cancelText="t('cancel')"
          :applyText="t('deleteConfirmButton')"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ActionButton from '@/components/base/ActionButton.vue'
import BaseHeader from '@/components/base/BaseHeader.vue'
import Drawer from '@/components/base/Drawer.vue'
import InfoCard from '@/components/base/InfoCard.vue'
import ServerTable from '@/components/base/ServerTable.vue'
import ConfirmPopupDialog from '@/components/base/ConfirmPopupDialog.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue3-i18n'
import { useAdsStore } from '@/stores/modules/adsStore'
import { IAd } from '@/models/ad'
import {
  toastDeleteMessage,
  toastErrorMessage,
  toastSuccessMessage,
} from '@/utils/helpers/notification'
import { formatDateWithoutTime } from '@/utils/helpers/date-helper'
import BannerIcon from '@/assets/images/banner.svg'
import { StaticFunctions } from '@/utils/helpers/static_functions'

const { t } = useI18n()
const isDetailsDrawerOpen = ref(false)
const isDeleteDrawerOpen = ref(false)
const isUpdateDrawerOpen = ref(false)
const isAddDrawerOpen = ref(false)
const isConfirmDeletePopupVisible = ref(false)

const adsStore = useAdsStore()
const loading = computed(() => adsStore.isLoading)
const ads = computed(() => adsStore.allAds)

// Initial loading state for first page load
const initialLoading = ref(true)

const editingBanner = ref<IAd | null>(null)

const pagination = computed(
  () => adsStore.paginationInfo || { total: 0, page: 1, limit: 8, pageCount: 1 },
)
const stats = computed(() => adsStore.adsStats || { totalAds: 0, activeAds: 0, deactiveAds: 0 })
const page = ref(1)
const selectedAd = ref<IAd | null>(null)
const itemsPerPage = ref(8)

const headers = [
  { title: 'ID', key: '_id', sortable: false },
  { title: t('bannerImage'), key: 'image', sortable: false },
  { title: t('bannerTitle'), key: 'title', sortable: false },
  { title: t('startEndDate'), key: 'expireDate', sortable: false },
  { title: t('status'), key: 'status', sortable: false },
  { title: t('actions'), key: '', sortable: false },
]

const getColorAccordingToExpireDate = (expireDate: string | Date) => {
  switch (getStatusAccordingToExpireDate(expireDate)) {
    case t('active'):
      return 'green'
    case t('deactive'):
      return 'red'
    default:
      return 'grey'
  }
}

const newBanner = ref({
  title: '',
  startAt: '',
  expireDate: '',
  url: '',
  image: '',
  status: 'active',
})

const imageUploadProgress = ref(0)
const imageUrl = ref('')
const uploadedFileName = ref('')
const uploadedFileSize = ref('')
const isDragOver = ref(false)
const totalFileSize = ref('')
const fileInput = ref<HTMLInputElement>()

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      processFile(file)
    }
  }
}

const processFile = (file: File) => {
  uploadedFileName.value = file.name
  uploadedFileSize.value = formatFileSize(file.size)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'flutter_unsigned_upload')

  const xhr = new XMLHttpRequest()
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      imageUploadProgress.value = Math.round((e.loaded / e.total) * 100)
    }
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const res = JSON.parse(xhr.responseText)
      imageUrl.value = res.secure_url
      if (isUpdateDrawerOpen.value && editingBanner.value) {
        editingBanner.value.image = res.secure_url
      } else {
        newBanner.value.image = res.secure_url
      }
      imageUploadProgress.value = 0
      totalFileSize.value = formatFileSize(res.bytes)
    }
  }

  xhr.open('POST', 'https://api.cloudinary.com/v1_1/dmc7iowmo/image/upload', true)
  xhr.send(formData)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadImage = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  processFile(file)
}

const removeImage = () => {
  imageUrl.value = ''
  if (isUpdateDrawerOpen.value && editingBanner.value) {
    editingBanner.value.image = ''
  } else {
    newBanner.value.image = ''
  }
  imageUploadProgress.value = 0
  uploadedFileName.value = ''
  uploadedFileSize.value = ''
}

const resetForm = () => {
  newBanner.value = {
    title: '',
    startAt: '',
    expireDate: '',
    url: '',
    image: '',
    status: 'active',
  }
  imageUrl.value = ''
  uploadedFileName.value = ''
  uploadedFileSize.value = ''
  imageUploadProgress.value = 0
  isDragOver.value = false
}

const onAddButtonPressed = async () => {
  if (!newBanner.value.title || !newBanner.value.expireDate) {
    toastErrorMessage('Title and Expire Date are required', 'Please fill out the required fields.')
    return
  }
  if (
    newBanner.value.startAt &&
    new Date(newBanner.value.startAt) > new Date(newBanner.value.expireDate)
  ) {
    toastErrorMessage('Please Check Again', t('startDateCannotBeAfterExpireDate'))
    return
  }
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  if (newBanner.value.startAt && new Date(newBanner.value.startAt) < startOfToday) {
    toastErrorMessage('Please Check Again', t('startDateCannotBeBeforeToday'))
    return
  }
  await adsStore.createAd(newBanner.value as IAd)
  toastSuccessMessage(t('toastAddBannerTitle'), t('toastAddBannerDescription'))
  isAddDrawerOpen.value = false
  resetForm()
  fetchAds()
  fetchStats()
}

const editBanner = (item: any) => {
  editingBanner.value = item

  const formatDateForInput = (date: string | Date | undefined) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  if (editingBanner.value) {
    editingBanner.value.startAt =
      formatDateForInput(editingBanner.value.startAt) ||
      formatDateForInput(editingBanner.value.createdAt)
    editingBanner.value.expireDate = formatDateForInput(editingBanner.value.expireDate)
  }

  if (item.image) {
    imageUrl.value = item.image
    uploadedFileName.value = 'current-image.jpg'
  }
  isUpdateDrawerOpen.value = true
}

const closeDeletePopup = () => (isConfirmDeletePopupVisible.value = false)

const fetchAds = async () => {
  const response = await adsStore.getAds({ page: page.value, limit: itemsPerPage.value })
  if (response.pagination && response.pagination.page !== page.value) {
    page.value = response.pagination.page
  }
  const totalPages = Math.ceil((response.pagination?.total ?? 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

const fetchStats = async () => {
  await adsStore.getAdsStats()
}

onMounted(async () => {
  try {
    await Promise.all([fetchAds(), fetchStats()])
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    initialLoading.value = false
  }
})

watch([page, itemsPerPage], fetchAds)

const onDeleteButtonPressed = async (selectedAdId: string) => {
  if (!selectedAdId) {
    console.error('No ad selected for deletion')
    return
  }
  await adsStore.deleteAd(selectedAdId)
  await fetchAds()
  isDeleteDrawerOpen.value = false
  isConfirmDeletePopupVisible.value = false
  toastDeleteMessage(t('toastDeleteBannerTitle'), t('toastDeleteBannerDescription'))
}

const onUpdateButtonPressed = async () => {
  if (!editingBanner.value?._id) {
    return
  }
  if (!editingBanner.value.title || !editingBanner.value.expireDate) {
    toastErrorMessage('Title and Expire Date are required', 'Please fill out the required fields.')
    return
  }
  if (
    editingBanner.value.startAt &&
    new Date(editingBanner.value.startAt) > new Date(editingBanner.value.expireDate)
  ) {
    toastErrorMessage('Please Check Again', t('startDateCannotBeAfterExpireDate'))
    return
  }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  if (editingBanner?.value?.startAt && new Date(editingBanner?.value?.startAt) < startOfToday) {
    toastErrorMessage('Please Check Again', t('startDateCannotBeBeforeToday'))
    return
  }

  await adsStore.updateAd(editingBanner.value._id, editingBanner.value)
  toastSuccessMessage('Banner updated!', 'The banner details have been successfully updated.')
  isUpdateDrawerOpen.value = false
  resetForm()
  fetchAds()
  fetchStats()
}

const statusColorAccordingToExpireDate = (date: string | Date): string => {
  return StaticFunctions.getStatusColorByExpireDateOnly(date)
}

function getStatusAccordingToExpireDate(expireDate: string | Date) {
  const currentDate = new Date()
  const expiredDate = new Date(expireDate)
  if (expiredDate < currentDate) {
    return t('deactive')
  }
  return t('active')
}

function viewDetails(item: any) {
  selectedAd.value = item as IAd
  isDetailsDrawerOpen.value = true
}

function deleteAd(item: any) {
  selectedAd.value = item as IAd
  isDeleteDrawerOpen.value = true
}
</script>
<style scoped lang="scss">

.action-btns {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.image-upload-container {
  width: 100%;
}

.image-upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #1976d2;
    background-color: #f5f5f5;
  }

  &.drag-over {
    border-color: #1976d2;
    background-color: #e3f2fd;
    transform: scale(1.02);
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    p {
      margin: 0;
      font-size: 14px;
      color: #444;
    }

    .subtext {
      font-size: 12px;
      color: #999;
    }
  }

  .uploaded-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 12px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    gap: 12px;

    .preview-img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .file-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .file-name {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      .file-size {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.upload-progress {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
}

.banner-key {
  flex: 1;
}
</style>
