<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/userStore'
import { errorMessage } from '@/utils/helpers'

const name = ref('')
const password = ref('')
const passwordAgain = ref('')
const email = ref('')
const userStore = useUserStore()

const deleteUser = async () => {
  console.log(name.value, password.value, passwordAgain.value, email.value)
  if (password.value !== passwordAgain.value) {
    errorMessage('Passwords do not match')
    return
  }
  try {
    await userStore.deleteUserByNameEmailAndPass(name.value, password.value, email.value)
  } catch (error) {
    errorMessage('Failed to delete user')
    console.log(error)
    navigateTo.push('/')
  }
}

const navigateTo = useRouter()
</script>
<template>
  <div class="delete-user-mobile">
    <v-form @submit.prevent="deleteUser">
      <h1>Mobile User Account Delete</h1>
      <v-text-field v-model="name" label="Name" required />
      <v-text-field v-model="email" label="Email" required />

      <v-text-field v-model="password" label="Password" required />
      <v-text-field v-model="passwordAgain" label="Password Again" required />
      <div class="action-delete-btn">
        <v-btn type="submit" color="error">Delete</v-btn>
        <v-btn type="button" color="" @click="navigateTo.push('/')">Cancel</v-btn>
      </div>
    </v-form>
  </div>
</template>

<style scoped>
.delete-user-mobile {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  gap: 10px;
  display: flex;
}

.action-delete-btn {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
