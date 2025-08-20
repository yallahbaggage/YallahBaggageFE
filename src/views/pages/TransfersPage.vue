<template>
  <div class="app-management-page">
    <BaseHeader
      :pageIcon="'mdi-swap-horizontal'"
      :title="t('transfers')"
      :desc="t('manageAndTrackYourTransfers')"
    />

    <div class="page-content">
      <!-- Loading state for initial page load -->
      <div v-if="initialLoading" class="loading-state">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <p>{{ t('loading') }}</p>
      </div>

      <!-- Content when loaded -->
      <div v-else>
        <div class="cards">
          <InfoCard class="infoCard" :cardTitle="t('todaysTransfers')">
            <div class="stats-container">
              {{ stats.todaysTransfers }}
              <p class="present-change">
                <span class="present">+{{ stats.todaysTransfersChange }}</span>
                {{ t('vsYesterday') }}
              </p>
            </div>
          </InfoCard>
          <InfoCard class="infoCard" :cardTitle="t('currentTransfers')">
            <div class="stats-container">
              {{ stats.currentTransfers }}
              <p class="present-change">
                <span class="present">+{{ stats.currentTransfersChange }}</span>
                {{ t('vsYesterday') }}
              </p>
            </div></InfoCard
          >
          <InfoCard class="infoCard" :cardTitle="t('cancelledTransfers')">
            <div class="stats-container">
              {{ stats.cancelledTransfers }}
              <p class="present-change">
                <span class="cancel-present">+{{ stats.cancelledTransfersChange }}</span>
                {{ t('vsYesterday') }}
              </p>
            </div></InfoCard
          >
        </div>
        <hr class="infoHr" />
        <div class="filter-section" style="margin-bottom: 16px; position: relative">
          <!-- Filter Button + Panel -->
          <v-menu
            v-model="filterMenu"
            :close-on-content-click="false"
            offset-y
            transition="scale-transition"
            max-width="360"
            min-width="280"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                outline
                class="text-capitalize"
                prepend-icon="mdi-filter-variant"
              >
                {{ t('filters') }}
              </v-btn>
            </template>

            <!-- Filter Content -->
            <v-card
              style="
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px 6px rgba(0, 0, 0, 0.1);
              "
            >
              <v-card-text
                style="
                  padding: 10px;
                  font-size: 14px;
                  font-weight: 500;
                  width: 260px;
                  line-height: 20px;
                  background-color: #fff;
                  border: 1px solid #ebebeb;
                  margin-top: 15px;
                "
              >
                <div class="d-flex justify-space-between align-center mb-2">
                  <h4 class="text-subtitle-1 font-weight-medium">Filters</h4>
                  <v-btn variant="text" @click="clearFilters" class="text-primary">Clear</v-btn>
                </div>

                <div class="drawer-form-group">
                  <label for="name" class="drawer-label-group">
                    {{ t('client') }}
                  </label>
                  <input
                    id="name"
                    type="text"
                    class="form-input no-focus-border"
                    placeholder="client name or email"
                    v-model="filters.client"
                  />
                </div>
                <div class="drawer-form-group">
                  <label for="name" class="drawer-label-group">
                    {{ t('employees') }}
                  </label>
                  <v-select
                    v-model="filters.workerName"
                    :items="workers.map((w: IWorker) => w.name)"
                    label=""
                    variant="outlined"
                    density="comfortable"
                  />
                </div>

                <div class="drawer-form-group">
                  <label for="name" class="drawer-label-group">
                    {{ t('transferStatus') }}
                  </label>
                  <v-select
                    v-model="filters.transferStatus"
                    :items="statusOptions.map((s: any) => t(s.label))"
                    variant="outlined"
                    density="compact"
                    required
                    hide-details
                    class="no-focus-border"
                  />
                </div>
                <!-- <div class="drawer-form-group">
                  <label for="name" class="drawer-label-group">
                    {{ t('paymentStatus') }}
                  </label>
                  <v-select
                    v-model="filters.paymentStatus"
                    :items="paymentStatusOptions.map((s: string) => t(s))"
                    variant="outlined"
                    density="compact"
                    required
                    hide-details
                    class="no-focus-border"
                  />
                </div> -->
                <div class="d-flex justify-space-between mt-4">
                  <v-btn variant="outlined" @click="clearFilters">Clear</v-btn>
                  <v-btn color="primary" @click="applyFilters">Apply</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
        <ServerTable
          :headers="headers"
          :items="ads"
          :total-items="pagination.total"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
        >
          <template #cell-_id="{ item }"> #{{ item._id.substring(0, 10) }} </template>
          <template #cell-worker="{ item }">
            <span v-if="item?.worker?.name ?? item.workerId?.name">{{
              item.worker?.name ?? item.workerId?.name
            }}</span>
            <v-btn
              class="text-capitalize assign-button btn-border"
              v-if="!item?.worker?.name && !item.workerId?.name && item?.status !== 'cancelled' && item?.status !== 'rejected' && item?.status !== 'completed'"
              :style="{ color: '#5C5C5C' }"
              @click="() => assignEmployee(item as Transfer)"
            >
              <v-icon color="#5C5C5C">mdi-plus-circle-outline</v-icon>
              {{ t('assign') }}
            </v-btn>
          </template>
          <template #cell-customer="{ item }">
            <span class="name-bold">{{ item?.newContact?.name ?? item?.user?.name ?? item.userId?.name }}</span>
          </template>
          <template #cell-status="{ item }">
            <v-chip
              v-if="
                item.status != 'cancelled' &&
                item.status != 'rejected' &&
                item.status != 'completed'
              "
              :color="statusColor(item.status)"
              text-color="white"
              medium
            >
              <span
                :style="{ backgroundColor: statusColor(item.status) }"
                class="status-circle"
              ></span>
              {{ t(item.status) ?? t('pending') }}
            </v-chip>
            <div class="flex button-border" outline v-else>
              <v-icon v-if="item.status === 'cancelled'" color="error" size="20"
                >mdi-alert-circle</v-icon
              >
              <v-icon v-if="item.status === 'completed'" color="success" size="20"
                >mdi-check-circle</v-icon
              >
              {{ t(item.status) ?? t('pending') }}
            </div>
          </template>
          <template #cell-pickUpDate="{ item }">
            <span>{{ formatDate(item.pickUpDate) }}</span>
          </template>
          <template #cell-deliveryDate="{ item }">
            <span>{{ formatDate(item.deliveryDate) }}</span>
          </template>
          <template #cell-createdAt="{ item }">
            <span>{{ formatDate(item.createdAt) }}</span>
          </template>
          <template #cell-actions="{ item }">
            <v-menu location="bottom end" offset="4">
              <template #activator="{ props }">
                <v-btn icon v-bind="props" variant="text" density="comfortable">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list class="menu-list pa-0 ma-0">
                <v-list-item class="menu-item" @click="viewDetails(item as Transfer)">
                  <v-icon class="mr-2">mdi-eye-outline</v-icon>
                  {{ t('seeDetails') }}
                </v-list-item>
                <v-list-item 
                  v-if="item?.status !== 'cancelled' && item?.status !== 'rejected' && item?.status !== 'completed'"
                    class="menu-item" @click="assignEmployee(item as Transfer)">
                  <v-icon class="mr-2">mdi-account-outline</v-icon>
                  {{ t('assignChangeStaff') }}
                </v-list-item>
                <v-list-item class="menu-item" @click="viewDetails(item as Transfer)">
                  <v-icon class="mr-2">mdi-lightning-bolt-outline</v-icon>
                  {{ t('changeStatus') }}
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </ServerTable>

        <!-- assign empeloyee Drawer -->
        <Drawer
          :isOpen="isAssignEmployeeDrawerOpen"
          :title="!selectedTransfer?.worker?.name ? t('assignDriver') : t('changeDriver')"
          :desc="
            !selectedTransfer?.worker?.name
              ? t('assignDriverToTransfer', {
                  transferId: selectedTransfer?._id?.substring(0, 10),
                })
              : t('changeDriverForTransfer', {
                  transferId: selectedTransfer?._id?.substring(0, 10),
                })
          "
          @close="isAssignEmployeeDrawerOpen = false"
        >
          <div class="drawer-content">
            <form class="form">
              <div>
                <div class="drawer-banner">
                  <p>{{ t('selectADriver') }}</p>
                </div>
                <div v-if="workersLoading" class="loading-state">
                  <p>{{ t('loading') }}...</p>
                </div>
                <div v-else-if="workers.length === 0" class="no-workers">
                  <p>{{ t('noWorkersAvailable') }}</p>
                </div>
                <div v-else>
                  <div class="workers-list">
                    <AssignEmployeeCard
                      v-for="(employee, index) in workers"
                      :key="`employee-${employee._id}-${index}`"
                      :fullName="employee.name"
                      :status="employee.status"
                      @assign="assignEmployeeProcess(employee, selectedTransfer as Transfer)"
                    />
                  </div>
                </div>

                <div class="action-btns">
                  <ActionButton
                    :buttonText="t('cancel')"
                    buttonColor="white"
                    class="action-Btn"
                    @button-pressed="() => (isAssignEmployeeDrawerOpen = false)"
                  />
                  <ActionButton
                    :buttonText="t('save')"
                    class="action-Btn"
                    @button-pressed="saveAssignment"
                  />
                </div>
              </div>
            </form>
          </div>
        </Drawer>
        <!-- assign empeloyee Drawer -->

        <!-- Details Drawer -->
        <Drawer
          :isOpen="isDetailsTransfersDrawerOpen"
          :title="'Transfer' + ' ' + '#' + selectedTransfer?._id.substring(0, 10)"
          :desc="`${selectedTransfer?.createdAt ? formatDateWithoutTime(selectedTransfer.createdAt) : ''} - ${
            selectedTransfer?.totalAmount
              ? (selectedTransfer.totalAmount * 1.02).toFixed(2)
              : '0.00'
          }$`"
          @close="isDetailsTransfersDrawerOpen = false"
        >
          <template #drawerStatus>
            <v-menu v-model="menu" :close-on-content-click="false" offset-y>
              <template #activator="{ props }">
                <v-btn
                  :style="{
                    backgroundColor: statusBg(editableStatus),
                    color: statusColor(editableStatus),
                  }"
                  v-bind="props"
                  class="status-btn"
                  variant="tonal"
                  rounded
                >
                  <span
                    class="status-dot"
                    :style="{ backgroundColor: statusColor(editableStatus) }"
                  ></span>
                  {{ t(statusLabel(editableStatus)) }}
                  <v-icon size="18" class="ml-1">mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list class="status-list">
                <v-list-item
                  v-for="status in statusOptions"
                  :key="status.label"
                  @click="selectStatus(status.label)"
                  class="status-item"
                  :style="{
                    backgroundColor: statusBg(status.label),
                    color: statusColor(status.label),
                  }"
                >
                  <template #prepend>
                    <span
                      class="status-dot"
                      :style="{ backgroundColor: statusColor(status.label) }"
                    ></span>
                  </template>
                  <v-list-item-title>{{ t(status.label) }}</v-list-item-title>
                  <template #append>
                    <v-icon v-if="status.label === editableStatus" color="green"
                      >mdi-check-circle</v-icon
                    >
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <div style="max-height: 75vh">
            <form v-on:submit.prevent="saveStatus" class="drawer-form">
              <div>
                <v-card>
                  <v-tabs v-model="tab" align-tabs="start" color="deep-purple-accent-4">
                    <v-tab value="details">{{ t('details') }}</v-tab>
                    <v-tab value="timeLine">{{ t('timeLine') }}</v-tab>
                  </v-tabs>

                  <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="details">
                      <v-expansion-panels v-if="selectedTransfer" v-model="panel" multiple>
                        <!-- Panel 1: Customer Contacts -->
                        <v-expansion-panel
                          elevation="0"
                          :title="t('customerContacts')"
                          :value="'customerContacts'"
                        >
                          <template #default>
                            <div class="employee-card" v-if="panel.includes('customerContacts')">
                              <div class="employee-info">
                                <div class="avatar">
                                  {{
                                    selectedTransfer?.newContact?.name
                                      ?.substring(0, 2)
                                      .toUpperCase() ??
                                    selectedTransfer?.user?.name?.substring(0, 2).toUpperCase()
                                  }}
                                </div>
                                <div class="details">
                                  <div class="name">
                                    {{
                                      selectedTransfer?.newContact?.name ??
                                      selectedTransfer?.user?.name ??
                                      ''
                                    }}
                                  </div>
                                  <div class="phone">
                                    {{
                                      selectedTransfer?.newContact?.email ??
                                      selectedTransfer?.user?.email ??
                                      ''
                                    }}
                                    -
                                    {{
                                      selectedTransfer?.newContact?.phone ??
                                      selectedTransfer?.user?.phone ??
                                      ''
                                    }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </v-expansion-panel>

                        <!-- Panel 2: Contact Person -->
                        <v-expansion-panel
                          elevation="0"
                          :title="t('contactPerson')"
                          :value="'contactPerson'"
                        >
                          <template #default>
                            <div class="accordion-card" v-if="panel.includes('contactPerson')">
                              <div class="drawer-info">
                                <p class="drawer-key">{{ t('fullName') }}</p>
                                <p class="drawer-value">
                                  {{
                                    selectedTransfer?.newContact?.name ??
                                    selectedTransfer?.user?.name ??
                                    'N/A'
                                  }}
                                </p>
                              </div>

                              <div class="drawer-info">
                                <p class="drawer-key">{{ t('contactPreference') }}</p>
                                <p class="drawer-value">
                                  <template v-if="preferredInfo === 'whatsapp'">
                                    <v-icon color="success">mdi-whatsapp</v-icon>
                                    {{ preferredInfo }}
                                  </template>
                                  <template v-else-if="preferredInfo === 'email'">
                                    <v-icon color="primary">mdi-email</v-icon>
                                    {{ preferredInfo }}
                                  </template>
                                  <template v-else-if="preferredInfo === 'call'">
                                    <v-icon color="error">mdi-phone</v-icon>
                                    {{ preferredInfo }}
                                  </template>
                                  <template v-else-if="preferredInfo === 'sms'">
                                    <v-icon color="info">mdi-sms</v-icon>
                                    {{ preferredInfo }}
                                  </template>
                                  <template v-else>
                                    {{ preferredInfo ?? 'N/A' }}
                                  </template>
                                </p>
                              </div>

                              <div class="drawer-info">
                                <p class="drawer-key">{{ t('phoneNumber') }}</p>
                                <p class="drawer-value">
                                  {{
                                    selectedTransfer?.newContact?.phone ??
                                    selectedTransfer?.user?.phone ??
                                    'N/A'
                                  }}
                                </p>
                              </div>
                            </div>
                          </template>
                        </v-expansion-panel>

                        <!-- Panel 3: Transfer Summary-->
                        <v-expansion-panel
                          elevation="0"
                          :title="t('transferSummary')"
                          :value="'transferSummary'"
                        >
                          <template #default>
                            <div class="accordion-card" v-if="panel.includes('transferSummary')">
                              <template
                                v-if="selectedTransfer.items && selectedTransfer.items.length > 0"
                                v-for="(item, index) in selectedTransfer.items"
                                :key="`employee-${item._id}-${index}`"
                              >
                                <div class="baggage-item">
                                  <img
                                    class="baggage-img"
                                    :src="item?.images?.[0]"
                                    :alt="item?.name"
                                  />
                                  <div class="baggage-info">
                                    <div class="baggage-title">
                                      {{ item?.name ?? 'N/A' }}
                                      <v-chip
                                        v-if="item?.isBreakable"
                                        size="x-small"
                                        color="orange-lighten-2"
                                        class="ml-2"
                                        text-color="orange-darken-2"
                                      >
                                        <v-icon start size="12" color="orange-darken-2"
                                          >mdi-alert</v-icon
                                        >
                                        {{ t('fragile') }}
                                      </v-chip>
                                    </div>
                                    <div class="baggage-weight">{{ item.weight }}kg</div>
                                  </div>
                                  <div class="baggage-price">
                                    {{
                                      selectedTransfer?.totalAmount /
                                      selectedTransfer?.items?.length
                                    }}$
                                  </div>
                                </div>
                              </template>

                              <v-divider class="my-2" />
                              <div class="drawer-info">
                                <p class="drawer-key">{{ t('subtotal') }}</p>
                                <p class="drawer-value">
                                  {{ selectedTransfer?.totalAmount ?? 'N/A' }}
                                  {{ selectedTransfer.totalAmount ? '$' : '' }}
                                </p>
                              </div>
                              <div class="drawer-info">
                                <p class="drawer-key">{{ t('vat') }}</p>
                                <p class="drawer-value">
                                  <template v-if="selectedTransfer?.totalAmount">
                                    {{ (selectedTransfer.totalAmount * 0.02).toFixed(2) }}$
                                  </template>
                                  <template v-else> N/A </template>
                                </p>
                              </div>
                              <div class="drawer-info">
                                <p class="drawer-key">{{ t('total') }}</p>
                                <p class="drawer-value">
                                  <template v-if="selectedTransfer?.totalAmount">
                                    {{
                                      (
                                        selectedTransfer.totalAmount +
                                        selectedTransfer.totalAmount * 0.02
                                      ).toFixed(2)
                                    }}$
                                  </template>
                                  <template v-else> N/A </template>
                                </p>
                              </div>
                            </div>
                          </template>
                        </v-expansion-panel>
                        <!-- Panel 4: Destination-->
                        <v-expansion-panel
                          elevation="0"
                          :title="t('destination')"
                          :value="'destination'"
                        >
                          <template #default>
                            <div class="accordion-card" v-if="panel.includes('destination')">
                              <div class="status-stepper">
                                <v-timeline>
                                  <v-timeline-item
                                    dot-color="white"
                                    icon="mdi-arrow-down"
                                    icon-color="primary"
                                    v-if="selectedTransfer?.from"
                                  >
                                    <div class="timeline-item-content">
                                      <h4>{{ selectedTransfer?.from }}</h4>
                                      <span
                                        >{{ formatDateWithoutTime(selectedTransfer?.pickUpDate) }}
                                        {{ selectedTransfer?.pickUpTime }}</span
                                      >
                                    </div>
                                    <p class="status-desc">
                                      {{ t('pickUpLocation') }}
                                    </p>
                                  </v-timeline-item>

                                  <v-timeline-item
                                    v-slot:opposite
                                    dot-color="white"
                                    icon="mdi-map-marker-outline"
                                    icon-color="gray"
                                    v-if="selectedTransfer?.to"
                                  >
                                    <div class="timeline-item-content">
                                      <h4>{{ selectedTransfer?.to }}</h4>
                                      <span
                                        >{{
                                          formatDateWithoutTime(selectedTransfer?.deliveryDate)
                                        }}
                                        {{ selectedTransfer?.deliveryTime }}</span
                                      >
                                    </div>
                                    <p class="status-desc">
                                      {{ t('deliveryLocation') }}
                                    </p>
                                  </v-timeline-item>
                                </v-timeline>
                              </div>
                            </div>
                          </template>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="timeLine">
                      <div class="drawer-banner">
                        <p>{{ t('timeLine') }}</p>
                      </div>
                      <div class="status-stepper">
                        <v-timeline>
                          <v-timeline-item
                            dot-color="white"
                            icon="mdi-shopping-outline"
                            icon-color="gray"
                            v-if="selectedTransfer?.acceptedAt"
                          >
                            <div class="timeline-item-content">
                              <h4>{{ t('orderConfirmed') }}</h4>
                              <span>{{ formatDate(selectedTransfer?.acceptedAt) }}</span>
                            </div>
                            <p class="status-desc">
                              {{ t('orderPlacedAndConfirmed') }}
                            </p>
                          </v-timeline-item>

                          <v-timeline-item
                            dot-color="white"
                            icon="mdi-cancel"
                            icon-color="red"
                            v-if="selectedTransfer?.status === 'cancelled' && selectedTransfer?.cancelledAt"
                            >
                            <div class="timeline-item-content">
                              <h4>{{ t('transferCancelled') }}</h4>
                              <span>{{ formatDate(selectedTransfer?.cancelledAt || '') }}</span>
                            </div>
                            <p class="status-desc">
                              {{ t('transferHasBeenCancelled') }}
                            </p>
                          </v-timeline-item>

                          <v-timeline-item
                            v-slot:opposite
                            dot-color="white"
                            icon="mdi-account-outline"
                            icon-color="gray"
                            v-if="selectedTransfer?.assigneedAt && selectedTransfer?.worker"
                          >
                            <div class="timeline-item-content">
                              <h4>{{ t('staffAssigned') }}</h4>
                              <span>{{ formatDate(selectedTransfer?.assigneedAt) }}</span>
                            </div>
                            <p class="status-desc">
                              <span class="stepper-worker-name">{{
                                selectedTransfer.worker?.name
                              }}</span>
                              {{ t('assignedToTransfer') }}
                            </p>
                          </v-timeline-item>

                          <v-timeline-item
                            v-if="selectedTransfer?.onTheWayAt"
                            dot-color="white"
                            icon="mdi-car-estate"
                            icon-color="orange"
                          >
                            <div class="timeline-item-content">
                              <h4>{{ t('courierIsOnTheWay') }}</h4>
                              <span>{{ formatDate(selectedTransfer?.onTheWayAt) }}</span>
                            </div>
                            <p class="status-desc">
                              {{ t('ourCourierIsOnTheWayToPickUp') }}
                            </p>
                          </v-timeline-item>
                          <v-timeline-item
                            v-slot:opposite
                            v-if="selectedTransfer?.inTransitAt"
                            dot-color="white"
                            icon="mdi-clock-time-three-outline"
                            icon-color="blue"
                          >
                            <div class="timeline-item-content">
                              <h4>{{ t('weReceivedYourLuggages') }}</h4>
                              <span>{{ formatDate(selectedTransfer?.inTransitAt) }}</span>
                            </div>
                            <p class="status-desc">
                              {{ t('packageInTransit') }}
                            </p>
                          </v-timeline-item>
                          <v-timeline-item
                            v-if="selectedTransfer?.completedAt"
                            dot-color="white"
                            icon="mdi-check"
                            icon-color="success"
                          >
                            <div class="timeline-item-content">
                              <h4>{{ t('baggageDelivered') }}</h4>
                              <span>{{ formatDate(selectedTransfer?.completedAt) }}</span>
                            </div>
                            <p class="status-desc">
                              {{
                                t('baggageHasBeenDeliveredTo', {
                                  placeName: selectedTransfer?.to ? t(selectedTransfer?.to) : 'N/A',
                                })
                              }}
                            </p>
                          </v-timeline-item>
                        </v-timeline>
                      </div>
                    </v-tabs-window-item>
                  </v-tabs-window>
                </v-card>
              </div>
              <div class="action-btns">
                <ActionButton
                  :buttonText="t('cancel')"
                  buttonColor="white"
                  @button-pressed="() => (isDetailsTransfersDrawerOpen = false)"
                  class="action-Btn"
                />
                <ActionButton
                  class="action-Btn"
                  :buttonText="t('saveStatus')"
                  buttonType="submit"
                />
              </div>
            </form>
          </div>
        </Drawer>
        <!-- Details Drawer -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseHeader from '@/components/base/BaseHeader.vue'
import InfoCard from '@/components/base/InfoCard.vue'
import { useI18n } from 'vue3-i18n'
import { useTransfersStore } from '@/stores/modules/transfer'
import { ref, onMounted, computed, watch } from 'vue'
import { Transfer } from '@/models/transfer'
import ServerTable from '@/components/base/ServerTable.vue'
import { formatDate, formatDateWithoutTime } from '@/utils/helpers/date-helper'
import AssignEmployeeCard from '@/components/base/AssignEmployeeCard.vue'
import { useWorkersStore } from '@/stores/modules/workers'
import { IWorker } from '@/models/worker'
import { toastErrorMessage, toastSuccessMessage } from '@/utils/helpers/notification'

const { t } = useI18n()

const tranfersStore = useTransfersStore()
const workersStore = useWorkersStore()
const loading = computed(() => tranfersStore.isLoading)

// Initial loading state for first page load
const initialLoading = ref(true)

const isDetailsTransfersDrawerOpen = ref(false)
const workers = ref<IWorker[]>([])
const workersLoading = ref(false)
const statusOptions = [
  { label: 'pending' },
  { label: 'in_progress' },
  { label: 'onTheWay' },
  { label: 'in_transit' },
  { label: 'completed' },
  { label: 'cancelled' },
]

const panel = ref<string>('contactPerson') // Default open panel

import type { Ref } from 'vue'
const selectedTransfer: Ref<Transfer | null> = ref<Transfer | null>(null)
const tab = ref(null)
const isAssignEmployeeDrawerOpen = ref(false)
const editableStatus = ref(selectedTransfer.value?.status ?? 'pending')
const ads = computed(() => tranfersStore.allTransfers || [])
const pagination = computed(
  () => tranfersStore.paginationInfo || { total: 0, page: 1, limit: 8, pageCount: 1 },
)

const stats = computed(
  () =>
    tranfersStore.stats || {
      todaysTransfers: 0,
      todaysTransfersChange: 0,
      currentTransfers: 0,
      currentTransfersChange: 0,
      cancelledTransfers: 0,
      cancelledTransfersChange: 0,
    },
)
const page = ref(1)
const itemsPerPage = ref(8)
const menu = ref(false)

const headers = [
  { title: 'ID', key: '_id', sortable: false },
  { title: t('transferDate'), key: 'createdAt', sortable: false },
  { title: t('customer'), key: 'customer', sortable: false },
  { title: t('pickUpDate'), key: 'pickUpDate', sortable: false },
  { title: t('deliveryDate'), key: 'deliveryDate', sortable: false },
  { title: t('status'), key: 'status', sortable: false },
  { title: t('assignChangeStaff'), key: 'worker', sortable: false },
  { title: t('actions'), key: 'actions', sortable: false },
]

// function statusColor(status: string): string {
//   switch (status) {
//     case 'pending':
//       return '#f59e0b' // amber
//     case 'in_progress':
//       return '#3b82f6' // blue
//     case 'resolved':
//       return '#10b981' // green
//     case 'rejected':
//       return '#ef4444' // red
//     case 'closed':
//       return '#6b7280' // gray
//     default:
//       return '#9ca3af' // fallback gray
//   }
// }

const statusLabel = (status: string) => {
  return statusOptions.find((s) => s.label === status)?.label ?? status
}

const selectStatus = (status: string) => {
  editableStatus.value = status as Transfer['status']
  menu.value = false
}

const statusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return '#FF9800' // amber
    case 'in_progress':
      return '#1976D2' // blue
    case 'in_transit':
      return '#FFC107' // amber
    case 'onTheWay':
      return '#00B894' // teal
    case 'resolved':
    case 'completed':
      return '#2E7D32' // green
    case 'rejected':
      return '#D32F2F' // red
    case 'closed':
      return '#616161' // gray
    default:
      return '#757575' // fallback gray
  }
}

const statusBg = (status: string): string => {
  switch (status) {
    case 'pending':
      return '#FFF4E5' // soft orange
    case 'in_progress':
      return '#E6F0FF' // light blue
    case 'in_transit':
      return '#FFF8D9' // pale yellow
    case 'onTheWay':
      return '#E6FFF4' // soft teal green
    case 'resolved':
    case 'completed':
      return '#E9F9EE' // soft green
    case 'rejected':
      return '#FFE5E5' // light red
    case 'closed':
      return '#F0F0F0' // neutral gray
    default:
      return '#F5F5F5' // fallback gray
  }
}

const saveStatus = async () => {
  if (!selectedTransfer.value) return

  try {
    await tranfersStore.updateTransfer({
      transferId: selectedTransfer.value._id,
      transferData: { status: editableStatus.value, items: selectedTransfer.value.items },
      emitSocket: false,
    })
    selectedTransfer.value.status = editableStatus.value // Update local state
    isDetailsTransfersDrawerOpen.value = false
    toastSuccessMessage(t('toastUpdateStatusTitle'), t('toastUpdateStatusDescription'))
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

function viewDetails(item: Transfer) {
  selectedTransfer.value = item as Transfer
  isDetailsTransfersDrawerOpen.value = true
}

const fetchAllTranfers = async () => {
  const params: any = {
    page: page.value,
    limit: itemsPerPage.value,
  }

  // Add filters if set
  if (filters.value.client) params.search = filters.value.client
  if (filters.value.workerName) params.workerName = filters.value.workerName
  if (filters.value.transferStatus) {
    // Find the status key from the label if translated
    const found = statusOptions.find((s) => t(s.label) === filters.value.transferStatus)
    params.status = found ? found.label : filters.value.transferStatus
  }
  if (filters.value.paymentStatus) {
    // Find the payment status key from the label if translated
    const found = paymentStatusOptions.find((s) => t(s) === filters.value.paymentStatus)
    params.paymentStatus = found || filters.value.paymentStatus
  }

  const response = await tranfersStore.getTransfers(params)
  if (response.pagination && response.pagination.page !== page.value) {
    page.value = response.pagination.page
  }
  const totalPages = Math.ceil((response.pagination?.total ?? 0) / itemsPerPage.value)
  if (page.value > totalPages && totalPages > 0) {
    page.value = totalPages
  }
}

const assignEmployee = async (item: Transfer) => {
  selectedTransfer.value = item as Transfer
  isAssignEmployeeDrawerOpen.value = true

  // Reset the current transfer's assigned worker ID for the new transfer
  currentTransferAssignedWorkerId.value = null

  // Reset all worker statuses to their original state from the database
  await resetWorkerStatuses()

  // If workers are not loaded, try to load them again
  if (workers.value.length === 0) {
    try {
      workersLoading.value = true
      await workersStore.getWorkers()
      workers.value = workersStore.allWorkers
      console.log('Workers reloaded:', workers.value.length)
    } catch (error) {
      console.error('Error reloading workers:', error)
    } finally {
      workersLoading.value = false
    }
  }
}

// Function to reset worker statuses to their original state
const resetWorkerStatuses = async () => {
  try {
    // Fetch fresh worker data from the store to get original statuses
    await workersStore.getWorkers()
    workers.value = workersStore.allWorkers
    console.log('Worker statuses reset to original state')
  } catch (error) {
    console.error('Error resetting worker statuses:', error)
  }
}

const filterMenu = ref(false)

const filters = ref({
  client: '',
  workerName: null,
  paymentStatus: null,
  transferStatus: null,
})

const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded']
// const staffOptions = ['John', 'Sarah', 'Ahmed']

const preferredInfo = computed(() => {
  return (selectedTransfer.value?.newContact?.informationPreference?.[0] ??
    selectedTransfer.value?.user?.informationPreference?.[0] ??
    'N/A') as 'whatsapp' | 'email' | 'call' | 'sms' | 'N/A'
})

function clearFilters() {
  filters.value = {
    client: '',
    workerName: null,
    paymentStatus: null,
    transferStatus: null,
  }
  fetchAllTranfers()
  filterMenu.value = false
}

function applyFilters() {
  fetchAllTranfers()
  filterMenu.value = false
}

const fetchStats = async () => {
  await tranfersStore.getTransfersStats()
}

const selectedEmployee = ref<IWorker | null>(null)
// Track the currently assigned worker for the current transfer (for local UI state)
const currentTransferAssignedWorkerId = ref<string | null>(null)

const assignEmployeeProcess = async (employee: IWorker, selectedTransfer: Transfer) => {
  console.log('Assigning employee:', employee.name)
  if (employee.status !== 'Available') {
    toastErrorMessage(
      'Plese select another empoloyee',
      'Employee is not available:' + employee.name,
    )
    return
  }

  // If there's a previously assigned worker for this transfer in the current session, make them available
  if (currentTransferAssignedWorkerId.value) {
    const previousWorkerIndex = workers.value.findIndex(
      (w) => w._id === currentTransferAssignedWorkerId.value,
    )
    if (previousWorkerIndex !== -1) {
      workers.value[previousWorkerIndex].status = 'Available'
      workers.value[previousWorkerIndex].isAvailable = true
      console.log(
        'Previous session worker status updated to Available:',
        workers.value[previousWorkerIndex].name,
      )
    }
  }

  // If the transfer already has a worker assigned from the database, update the status of that worker to Available
  if (selectedTransfer.worker) {
    // Handle both string and object cases for worker
    const previousWorkerId =
      typeof selectedTransfer.worker === 'string'
        ? selectedTransfer.worker
        : selectedTransfer.worker._id

    // Always make the previous database worker available when selecting a new worker
    const previousWorkerIndex = workers.value.findIndex((w) => w._id === previousWorkerId)
    if (previousWorkerIndex !== -1) {
      workers.value[previousWorkerIndex].status = 'Available'
      workers.value[previousWorkerIndex].isAvailable = true
      console.log(
        'Previous database worker status updated to Available:',
        workers.value[previousWorkerIndex].name,
      )
    }
  }

  // Update the selected employee's status to Assigned
  const workerIndex = workers.value.findIndex((w) => w._id === employee._id)
  if (workerIndex !== -1) {
    workers.value[workerIndex].status = 'Assigned'
    workers.value[workerIndex].isAvailable = false
  }

  // Update the current transfer's assigned worker ID
  currentTransferAssignedWorkerId.value = employee._id

  // Store the selected employee for later use when saving
  selectedEmployee.value = employee

  // Update the selectedTransfer's worker reference for immediate UI update (ensure reactivity)
  if (selectedTransfer) {
    selectedTransfer.worker = employee
  }
  console.log('Worker status updated locally to Assigned:', employee.name)
}

// Function to send WhatsApp message to the assigned worker
function sendWhatsappToWorker(worker: IWorker, transfer: Transfer) {
  // Format phone number (remove non-digits)
  const phone = (worker.phone || '').replace(/\D/g, '')

  if (!phone) {
    console.error('Invalid phone number')
    return
  }

  if (!Array.isArray(transfer.items) || transfer.items.length === 0) {
    console.error('No transfer items found')
    return
  }

  // Build detailed items info (name, weight, images)
  const itemsSection = transfer.items
    .map((item, idx) => {
      const validImages = (item.images || []).filter(
        (img) => img && (img.startsWith('http://') || img.startsWith('https://'))
      )

      const imagesText = validImages.length > 0 ? validImages.join('\n') : 'No images'

      return `Item #${idx + 1}: ${item.name}
Weight: ${item.weight} kg
Images:
${imagesText}`
    })
    .join('\n\n') // double newline between items for better spacing

  const message = `
New Transfer Assigned!
Transfer ID: #${transfer._id.substring(0, 10)}
From: ${transfer.from}
To: ${transfer.to}
Pickup: ${formatDate(transfer.pickUpDate)} ${transfer.pickUpTime}
Delivery: ${formatDate(transfer.deliveryDate)} ${transfer.deliveryTime}
Customer: ${transfer?.newContact?.name ?? transfer?.user?.name ?? ''}
Phone: ${transfer?.newContact?.phone ?? transfer?.user?.phone ?? ''}

Items:
${itemsSection}
  `.trim()

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`

  console.log('Opening WhatsApp:', whatsappUrl)
  window.open(whatsappUrl, '_blank')
}


const saveAssignment = async () => {
  if (!selectedEmployee.value || !selectedTransfer.value) {
    console.error('No employee or transfer selected')
    return
  }

  try {
    await fetchAllTranfers()
    await fetchAllWorkers()

    if (selectedEmployee.value && selectedTransfer.value) {
      console.log('Calling WhatsApp function')
      sendWhatsappToWorker(selectedEmployee.value, selectedTransfer.value)
    }

    await tranfersStore.updateTransfer({
      transferId: selectedTransfer.value._id ?? '',
      transferData: {
        workerId: selectedEmployee.value._id ?? '',
        items: selectedTransfer.value?.items ?? [],
      },
      emitSocket: false,
    })

    // Refresh the transfers list and workers list
    await fetchAllTranfers()
    await fetchAllWorkers()
    selectedEmployee.value = null // Reset selected employee
    currentTransferAssignedWorkerId.value = null // Reset current transfer assigned worker

    isAssignEmployeeDrawerOpen.value = false
  } catch (error) {
    console.error('Error saving assignment:', error)
  }
}

const fetchAllWorkers = async () => {
  try {
    workersLoading.value = true
    await workersStore.getWorkers()
    workers.value = workersStore.allWorkers
    console.log('Workers fetched:', workers.value.length)
  } catch (error) {
    console.error('Error fetching workers:', error)
  } finally {
    workersLoading.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([fetchAllTranfers(), fetchStats(), fetchAllWorkers()])
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    initialLoading.value = false
  }
})

// Watch for changes in the workers store
watch(
  () => workersStore.allWorkers,
  (newWorkers) => {
    workers.value = newWorkers
    console.log('Workers updated from store:', newWorkers.length)
  },
  { immediate: true },
)

watch([page, itemsPerPage], fetchAllTranfers)

watch(
  () => selectedTransfer.value?.status,
  (newStatus) => {
    editableStatus.value = newStatus ?? 'pending'
  },
)
</script>
<style lang="scss">
@use 'styles/main.scss' as *;

.stats-container {
  display: flex;
  gap: 10px;
  align-items: center;
}
.present-change {
  color: #6b7280;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}
.cancel-present {
  color: #da4122;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}
.present {
  color: #1fc16b;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}

.loading-state,
.no-workers {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #6b7280;
  font-size: 14px;
}

.form {
  overflow-y: auto;
  max-height: 75vh;
}

.drawer-content {
  max-height: 75vh;
  overflow: hidden;
}

.drawer-banner {
  margin-bottom: 16px;
}

.drawer-banner p {
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.action-btns {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.workers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 10px;
}
.stepper-worker-name {
  // underline
  text-decoration: underline;
  color: rgb(var(--v-theme-primary));
}

.employee-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 12px 16px;
  background: #fff;
  max-width: 400px;
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #ffeecc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #5a4217;
  font-size: 14px;
}

.details {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 500;
  font-size: 16px;
  color: #222;
}

.phone {
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  color: #5c5c5c;
}

.accordion-card {
  padding: 0px 7px;
}

.baggage-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
}

.baggage-img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.baggage-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.baggage-title {
  font-weight: 500;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.baggage-weight {
  font-size: 13px;
  color: gray;
}

.baggage-price {
  font-weight: 500;
}

.status-btn {
  text-transform: none;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.status-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}
.status-list {
  min-width: 200px;
  padding: 8px;
}
.status-item {
  border-radius: 12px;
  margin-bottom: 4px;
  padding: 8px 12px;
}

.v-btn.v-btn--density-default.assign-button{
  height: 24px !important;
  border-radius: 6px !important;
}

// // Filter section styles
// .filter-section {
//   margin-bottom: 16px !important;
//   position: relative;

//   :deep(.v-menu) {
//     z-index: 1000 !important;
//   }

//   :deep(.v-card) {
//     border-radius: 8px !important;
//     overflow: hidden !important;
//     box-shadow: 0 4px 6px 6px rgba(0, 0, 0, 0.1) !important;
//   }

//   :deep(.v-card-text) {
//     padding: 10px !important;
//     font-size: 14px !important;
//     font-style: normal !important;
//     font-weight: 500 !important;
//     width: 260px !important;
//     line-height: 20px !important;
//     background-color: #fff !important;
//     border: 1px solid #ebebeb !important;
//     margin-top: 15px !important;
//   }

//   :deep(.v-btn) {
//     text-transform: none !important;
//     font-weight: 500 !important;
//   }
// }
</style>
