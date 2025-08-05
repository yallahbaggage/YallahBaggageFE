<template>
  <header class="page-header">
    <div class="container header-content">
      <router-link to="/">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="Logo" />
          Yallah Baggage
        </div>
      </router-link>
      <nav class="nav-links">
        <router-link :to="{ path: '/', hash: '#contact' }">Contact</router-link>
        <router-link :to="{ path: '/', hash: '#faqs' }">FAQs</router-link>
        <!-- <router-link to="/privacy-policy">Privacy Policy</router-link>
             <router-link to="/terms-of-service">Terms of Service</router-link> -->
      </nav>
    </div>
  </header>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.page-header {
  background: linear-gradient(to right, #1c1f2a, #2c2f3a);
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
  color: #335cff;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 1.5rem;
    text-decoration: none;

    img {
      height: 40px;
      margin-right: 0.5rem;
    }
  }

  .nav-links a {
    color: #ffffff;
    text-decoration: none;
    margin-left: 1.5rem;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #5f79ff;
    }
  }
}

a {
  text-decoration: none;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
