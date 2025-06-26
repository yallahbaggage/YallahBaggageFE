<template>
  <div class="app-privacy-page">
    <v-container class="privacy-container" max-width="md">
      <h1 class="title">Privacy Policy</h1>
      <p class="last-updated">Last updated: June 26, 2025</p>

      <p class="intro">
        By using our app, you agree to the collection and use of your information in accordance with this Privacy Policy. This document explains how we collect, use, and protect your personal data.
      </p>

      <ol class="policy-list">
        <li>
          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number (provided during account registration or login).</li>
            <li><strong>Location Data:</strong> Used to provide location-based services.</li>
            <li><strong>Camera Access:</strong> Required to scan QR codes, upload images, or capture content within the app.</li>
            <li><strong>Device Information:</strong> Device model, OS, and crash data (via Firebase).</li>
            <li><strong>Usage Data:</strong> In-app activity, session duration, interaction events.</li>
          </ul>
        </li>

        <li>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide core app functionality (e.g., location-based services)</li>
            <li>To authenticate and manage your account</li>
            <li>To improve user experience and fix bugs</li>
            <li>To display relevant ads (e.g., via AdMob)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </li>

        <li>
          <h2>3. Third-Party Services</h2>
          <p>We use third-party services that may collect data:</p>
          <ul>
            <li><strong>Firebase Analytics & Crashlytics:</strong> App performance, crash reports</li>
            <li><strong>AdMob:</strong> In-app advertising</li>
            <li><strong>Google Maps SDK:</strong> Location-based features</li>
          </ul>
          <p>These services have their own privacy policies:</p>
          <ul>
            <li><a href="https://firebase.google.com/support/privacy" target="_blank">Firebase Privacy Policy</a></li>
            <li><a href="https://policies.google.com/privacy" target="_blank">AdMob & Google Maps Privacy Policy</a></li>
          </ul>
        </li>

        <li>
          <h2>4. Data Retention</h2>
          <p>We retain personal data as long as your account is active or as needed to provide you services.</p>
        </li>

        <li>
          <h2>5. Children's Privacy</h2>
          <p>Our app is not intended for users under the age of 13. We do not knowingly collect data from children. If we become aware of such data, we delete it immediately.</p>
        </li>

        <li>
          <h2>6. Your Rights</h2>
          <p>You may:</p>
          <ul>
            <li>Request access or correction to your personal data</li>
            <li>Request deletion of your account and associated data</li>
          </ul>
          <p>To exercise your rights, contact us at: <a href="mailto:support@exampleapp.com">support@exampleapp.com</a></p>
        </li>

        <li>
          <h2>7. Security</h2>
          <p>We use appropriate safeguards (encryption, secure storage) to protect your data.</p>
        </li>

        <li>
          <h2>8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. You will be notified of significant changes via in-app notification or email.</p>
        </li>
      </ol>

      <p class="contact">Contact Us: <a href="mailto:support@exampleapp.com">support@exampleapp.com</a></p>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue3-i18n'
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.app-privacy-page {
  background-color: #fafafa;
  padding: 40px 0;

  .privacy-container {
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

  .policy-list {
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

      p,
      ul {
        font-size: 0.95rem;
        color: #444;
      }

      ul {
        padding-left: 1.5rem;
        list-style-type: disc;

        li {
          margin-bottom: 0.25rem;
        }

        a {
          color: #1976d2;
          text-decoration: underline;
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
