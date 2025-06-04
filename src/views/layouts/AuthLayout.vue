<template>
  <div class="auth-layout">
    <header>
      <img src="images/ica_logo_400_130.png" width="300" alt="Logo" />
      <p class="text-center">{{kAppVersion}}</p>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped src="styles/layout/auth.scss"></style>

<script setup lang="ts">
import { kAppVersion } from '@/utils/constants/const';
</script>
