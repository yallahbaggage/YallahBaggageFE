<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/userStore';
import { errorMessage } from '@/utils/helpers';

const name = ref('');
const password = ref('');
const passwordAgain = ref('');
const userStore = useUserStore();

const deleteUser = async () => {
  console.log(name.value, password.value, passwordAgain.value);
  if (password.value !== passwordAgain.value) {
    errorMessage("Passwords do not match");
    return;
  }
  try {
    await userStore.deleteUserByNameAndPass(name.value, password.value);
  } catch (error) {
    errorMessage("Failed to delete user");
    console.log(error);
    navigateTo.push('/');
    }
}

const navigateTo = useRouter();
</script>
<template>
  <div>
    <h1>Delete User</h1>
    <v-form @submit.prevent="deleteUser">
      <h1>Mobile User Account Delete</h1>
      <v-text-field v-model="name" label="Name" required />
      <v-text-field v-model="password" label="Password" required />
      <v-text-field v-model="passwordAgain" label="Password Again" required />
      <v-btn type="submit" color="error">Delete</v-btn>
      <v-btn type="button" color="primary" @click="navigateTo.push('/')">Cancel</v-btn>
    </v-form>
  </div>
</template>
