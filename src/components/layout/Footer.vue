<template lang="">
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-left">
        <router-link to="/">
          <div class="footer-logo">
            <img src="@/assets/images/logo.png" alt="Logo" />
            Yallah Baggage
          </div>
        </router-link>
        <p class="footer-desc">Helping you pack smarter and launch stronger.</p>
        <div class="social-icons">
          <a
            href="https://www.facebook.com/profile.php?id=61559429296077&sk=about"
            target="_blank"
            aria-label="Facebook"
          >
            <i class="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/yallah-baggage/?viewAsMember=true"
            target="_blank"
            aria-label="linkedin"
          >
            <i class="fab fa-linkedin"></i>
          </a>
          <a
            href="https://www.instagram.com/yallah_baggage/"
            target="_blank"
            aria-label="Instagram"
          >
            <i class="fab fa-instagram"></i>
          </a>
        </div>
      </div>
      <div class="footer-right">
        <nav class="footer-links">
          <router-link :to="{ path: '/', hash: '#contact' }">Contact</router-link>
          <router-link :to="{ path: '/', hash: '#faqs' }">FAQs</router-link>
          <router-link to="/privacy-policy">Privacy Policy</router-link>
          <router-link to="/terms-of-service">Terms of Service</router-link>
        </nav>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} Yallah Baggage. All rights reserved.</p>
    </div>
  </footer>
</template>
<script lang="ts" setup></script>
<style scoped lang="scss">
.footer {
  background: linear-gradient(to right, #1c1f2a, #2c2f3a);
  padding: 2rem 0 1rem;
  border-top: 1px solid #e6ecff;

  .footer-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .footer-left {
    max-width: 300px;

    .footer-logo {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 1.5rem;
      color: #335CFF;
      margin-bottom: 0.5rem;
      text-decoration: none;

      img {
        height: 30px;
        margin-right: 0.5rem;
      }
    }

    .footer-desc {
      font-size: 0.95rem;
      color: #fff;
      margin-bottom: 1rem;
    }

    .social-icons {
      display: flex;
      gap: 0.75rem;

      a {
        color: #335cff;
        font-size: 1.2rem;
        transition: color 0.3s;
        text-decoration: none;

        &:hover {
          color: #2549d9;
        }
      }
    }
  }

  .footer-right {
    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      a {
        color: #fff;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s;

        &:hover {
          color: #335cff;
        }
      }
    }
  }

  .footer-bottom {
    text-align: center;
    font-size: 0.85rem;
    color: #ccc;
    margin-top: 1.5rem;
  }
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.footer-logo span {
  text-decoration: none;
}

a {
  text-decoration: none;
}
</style>
