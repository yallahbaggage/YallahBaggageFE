<template>
  <div class="terms-page">
    <v-container class="terms-container" max-width="md">
      <h1 class="title">Terms of Use</h1>
      <p class="last-updated">Last updated: June 26, 2025</p>

      <p class="intro">
        By using our app (<strong>Yallah Baggage</strong>), you agree to these Terms of Use and our Privacy Policy.
        If you do not agree, please do not use the app.
      </p>

      <ol class="terms-list">
        <li>
          <h2>1. Use of the App</h2>
          <p>You must be at least 13 years old to use the app. You agree to use the Service only for lawful purposes and in accordance with these Terms.</p>
        </li>

        <li>
          <h2>2. Account Registration</h2>
          <p>You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate and complete information during sign-up.</p>
        </li>

        <li>
          <h2>3. Permissions</h2>
          <ul>
            <li>Location access for location-based features</li>
            <li>Camera access for scanning/uploading content</li>
            <li>Notifications for important updates</li>
          </ul>
        </li>

        <li>
          <h2>4. User Responsibilities</h2>
          <ul>
            <li>Do not violate any laws or regulations</li>
            <li>Do not use the app to send spam or malicious content</li>
            <li>Do not attempt to reverse engineer or tamper with the app</li>
          </ul>
        </li>

        <li>
          <h2>5. Intellectual Property</h2>
          <p>All content, logos, and trademarks used in the app are the property of the app owner or its licensors. You may not reproduce or distribute them without permission.</p>
        </li>

        <li>
          <h2>6. Third-Party Services</h2>
          <p>Our app may include integrations with third-party services (e.g., Google Maps, AdMob). Your use of those services is subject to their own terms and policies.</p>
        </li>

        <li>
          <h2>7. Limitation of Liability</h2>
          <p>We are not liable for any direct, indirect, or incidental damages arising from your use of the app.</p>
        </li>

        <li>
          <h2>8. Termination</h2>
          <p>We reserve the right to suspend or terminate your access if you violate these Terms.</p>
        </li>

        <li>
          <h2>9. Changes to Terms</h2>
          <p>We may update these Terms at any time. Continued use of the app after changes means you accept the updated Terms.</p>
        </li>
      </ol>

      <p class="contact">Contact Us: <a href="mailto:support@exampleapp.com">support@exampleapp.com</a></p>
    </v-container>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.terms-page {
  background-color: #fafafa;
  padding-top: 40px;
  padding-bottom: 40px;

  .terms-container {
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .last-updated {
    color: #777;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .intro {
    margin-bottom: 1.5rem;
    font-size: 1rem;
    color: #333;
  }

  .terms-list {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 1.5rem;

      h2 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #2c3e50;
      }

      p, ul {
        font-size: 0.95rem;
        color: #444;
      }

      ul {
        padding-left: 1.5rem;
        list-style-type: disc;

        li {
          margin-bottom: 0.25rem;
        }
      }
    }
  }

  .contact {
    margin-top: 2rem;
    font-size: 0.95rem;

    a {
      color: #1976d2;
      text-decoration: underline;
    }
  }
}
</style>
