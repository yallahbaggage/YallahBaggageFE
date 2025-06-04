<template>
 
  <v-container fluid>
    <v-card>
      <v-card-title>
        Users
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            text-color="white"
          >
            {{ item.role }}
          </v-chip>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleDateString() }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editUser(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit User</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.phone"
                  label="Phone"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.address"
                  label="Address"
                ></v-text-field>
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
            Cancel
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="saveUser"
            :loading="saving"
          >
            Save
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
import { IUser } from '@/models/user'
import { useAuthStore } from '@/stores/modules/authStore'
import { useUserStore } from '@/stores/modules/userStore'
import { userService } from '@/utils/services/userService'
import { defineComponent, ref, onMounted, computed } from 'vue'

export default defineComponent({
  name: 'UsersView',
  setup() {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const user = computed(() => userStore.user)
    const isLogged = computed(() => authStore.isAuthenticated)

    const loading = ref(false)
    const saving = ref(false)
    const search = ref('')
    const users = ref<IUser[]>([])
    const dialog = ref(false)
    const editedItem = ref<Partial<IUser>>({})
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })

    const headers = [
      { title: 'Name', key: 'name' },
      { title: 'Email', key: 'email' },
      { title: 'Role', key: 'role' },
      { title: 'Phone', key: 'phone' },
      { title: 'Address', key: 'address' },
      { title: 'Created At', key: 'createdAt' },
      { title: 'Actions', key: 'actions', sortable: false }
    ]

    const getRoleColor = (role: string) => {
      switch (role) {
        case 'admin':
          return 'red'
        case 'worker':
          return 'green'
        default:
          return 'blue'
      }
    }

    const fetchUsers = async () => {
      loading.value = true
      try {
        users.value = await userService.getUsers()
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

    const editUser = (item: IUser) => {
      editedItem.value = { ...item }
      dialog.value = true
    }

    const closeDialog = () => {
      dialog.value = false
      editedItem.value = {}
    }

    const saveUser = async () => {
      saving.value = true
      try {
        const updatedUser = await userService.updateUser(editedItem.value)
        const index = users.value.findIndex((user: IUser) => user._id === updatedUser._id)
        if (index !== -1) {
          users.value[index] = updatedUser
        }
        closeDialog()
        snackbar.value = {
          show: true,
          text: 'User updated successfully',
          color: 'success'
        }
      } catch (error: any) {
        snackbar.value = {
          show: true,
          text: error.message,
          color: 'error'
        }
      } finally {
        saving.value = false
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      loading,
      saving,
      search,
      users,
      headers,
      dialog,
      editedItem,
      snackbar,
      getRoleColor,
      editUser,
      closeDialog,
      saveUser,
      user,
      isLogged
    }
  }
})
</script> 