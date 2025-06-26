<template>
  <div class="terms-page">
    <v-container class="terms-container" max-width="md">
      <h1 class="title">Yallah Baggage – Terms of Use</h1>
      <p class="last-updated">Last updated: 26th June 2025</p>

      <p class="intro">
        Welcome to Yallah Baggage (“we,” “us,” or “our”). By accessing or using the Yallah Baggage mobile application (“App” or “Service”), you agree to comply with and be bound by the following Terms of Use. If you do not agree to these Terms, please do not use the App.
      </p>

      <ol class="terms-list">
        <li>
          <h2>1. Use of the App</h2>
          <p>You must be at least 18 years old to use our Service. You agree to use the App only for lawful purposes related to luggage pickup, storage, and delivery, and not for any prohibited activities.</p>
        </li>

        <li>
          <h2>2. Account Registration</h2>
          <ul>
            <li>Provide accurate, current, and complete information.</li>
            <li>Keep your login credentials confidential.</li>
            <li>Be solely responsible for all activity under your account.</li>
          </ul>
        </li>

        <li>
          <h2>3. Permissions and Data</h2>
          <p>By using the App, you consent to granting us access to:</p>
          <ul>
            <li><strong>Location Data:</strong> For driver tracking, customer pickup, and delivery coordination.</li>
            <li><strong>Camera:</strong> To scan QR codes for pickup/delivery confirmation.</li>
            <li><strong>Notifications:</strong> To send you real-time updates on your luggage status.</li>
          </ul>
          <p>Your data is handled in accordance with our <a href="#">Privacy Policy</a>.</p>
        </li>

        <li>
          <h2>4. User Responsibilities</h2>
          <ul>
            <li>Do not use the App for fraudulent or unlawful purposes.</li>
            <li>Do not attempt to interfere with the App’s functionality.</li>
            <li>Do not abuse our staff, drivers, or support team.</li>
            <li>Do not violate any local, national, or international laws.</li>
          </ul>
        </li>

        <li>
          <h2>5. Intellectual Property</h2>
          <p>All materials, branding, features, and designs within the App are owned by Yallah Baggage or our licensors. You may not reuse, modify, or distribute any content without written permission.</p>
        </li>

        <li>
          <h2>6. Third-Party Integrations</h2>
          <p>Our App integrates with third-party platforms such as Google Maps, payment gateways, and cloud hosting providers. Your use of those services is governed by their respective terms and privacy policies.</p>
        </li>

        <li>
          <h2>7. Service Limitations and Liability</h2>
          <p>Yallah Baggage is a facilitator of luggage services and does not guarantee delivery times in all scenarios (e.g., force majeure, service disruptions).</p>
          <p>We are not liable for:</p>
          <ul>
            <li>Any indirect, incidental, or consequential damages.</li>
            <li>Loss or damage caused by misuse or delay not caused by our direct negligence.</li>
          </ul>
          <p>See our <a href="#">Claims and Refunds Policy</a> for more details.</p>
        </li>

        <li>
          <h2>8. Termination of Service</h2>
          <p>We reserve the right to suspend or terminate your access to the App at any time, with or without notice, if we reasonably believe you have violated these Terms or engaged in behavior harmful to the platform or its users.</p>
        </li>

        <li>
          <h2>9. Changes to the Terms</h2>
          <p>These Terms may be updated occasionally. Material changes will be notified via the App or your registered email. Continued use of the App constitutes your acceptance of the updated Terms.</p>
        </li>

        <li>
          <h2>10. Contact Us</h2>
          <p>If you have any questions or concerns, please contact us at:</p>
          <p>📧 <a href="mailto:support@yallahbaggage.com">support@yallahbaggage.com</a></p>
        </li>
      </ol>
    </v-container>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.terms-page {
  background-color: #f9f9f9;
  padding: 40px 0;

  .terms-container {
    background: #fff;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .last-updated {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

  .intro {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .terms-list {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 1.75rem;

      h2 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #2c3e50;
      }

      p {
        font-size: 0.97rem;
        color: #444;
        margin-bottom: 0.5rem;
      }

      ul {
        list-style-type: disc;
        padding-left: 1.5rem;

        li {
          font-size: 0.95rem;
          margin-bottom: 0.3rem;
          color: #444;
        }
      }

      a {
        color: #1976d2;
        text-decoration: underline;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }
}
</style>
