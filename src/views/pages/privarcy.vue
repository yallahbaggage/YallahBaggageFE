<template>
  <div class="privacy-page">
    <Header />
    <div class="privacy-container container" max-width="md">
      <h1 class="title">Privacy Policy</h1>
      <p class="last-updated">Last updated: June 26, 2025</p>

      <p class="intro">
        Yallah Baggage ("we", "us", or "our") is committed to protecting your privacy. By using our
        app, you agree to the collection and use of your information in accordance with this Privacy
        Policy. This document outlines how we collect, use, and protect your personal data.
      </p>

      <ol class="policy-list">
        <li>
          <h2>1. Information We Collect</h2>
          <p>We may collect and process the following types of information:</p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, email address, phone number, and other
              details provided during registration or booking.
            </li>
            <li>
              <strong>Location Data:</strong> Used to enable pick-up and drop-off services, and
              real-time tracking.
            </li>
            <li>
              <strong>Camera Access:</strong> Needed to scan QR codes for booking verification and
              upload identity or luggage images.
            </li>
            <li>
              <strong>Device Information:</strong> Includes model, OS version, IP address, and crash
              logs (via Firebase).
            </li>
            <li>
              <strong>Usage Data:</strong> App activity, session time, interactions with features
              such as tracking and customer support.
            </li>
          </ul>
        </li>

        <li>
          <h2>2. How We Use Your Information</h2>
          <p>Your information is used to:</p>
          <ul>
            <li>Provide and manage the luggage pick-up, storage, and delivery service</li>
            <li>Authenticate your identity and secure your bookings</li>
            <li>Enable real-time driver tracking and notifications</li>
            <li>Improve the performance and reliability of the app</li>
            <li>Send updates, promotions, and customer support messages</li>
            <li>Comply with legal and regulatory obligations</li>
          </ul>
        </li>

        <li>
          <h2>3. Third-Party Services</h2>
          <p>
            We use trusted third-party services, which may collect and process some data
            independently:
          </p>
          <ul>
            <li><strong>Firebase Analytics & Crashlytics:</strong> App usage, crash reporting</li>
            <li><strong>Google Maps SDK:</strong> Geolocation and routing</li>
            <li><strong>Stripe / Payment Gateway:</strong> Secure payment processing</li>
            <li><strong>WhatsApp API:</strong> Optional real-time support communication</li>
          </ul>
          <p>Please review their respective privacy policies:</p>
          <ul>
            <li>
              <a href="https://firebase.google.com/support/privacy" target="_blank">Firebase</a>
            </li>
            <li><a href="https://policies.google.com/privacy" target="_blank">Google Maps</a></li>
            <li><a href="https://stripe.com/privacy" target="_blank">Stripe</a></li>
            <li>
              <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank">WhatsApp</a>
            </li>
          </ul>
        </li>

        <li>
          <h2>4. Data Retention</h2>
          <p>
            We retain your data only as long as your account is active or as required to provide
            services and meet legal requirements. You can request data deletion at any time.
          </p>
        </li>

        <li>
          <h2>5. Children’s Privacy</h2>
          <p>
            Yallah Baggage is not intended for individuals under the age of 13. We do not knowingly
            collect personal data from children. If we discover such data has been collected, we
            will delete it promptly.
          </p>
        </li>

        <li>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access or correct your personal data</li>
            <li>Request deletion of your account and all associated data</li>
          </ul>
          <p>
            To exercise these rights, email:
            <a href="mailto:support@yallahbaggage.com">support@yallahbaggage.com</a>
          </p>
        </li>

        <li>
          <h2>7. Security</h2>
          <p>
            We implement appropriate physical, technical, and administrative security measures
            including data encryption and secure cloud storage to protect your information.
          </p>
        </li>

        <li>
          <h2>8. Changes to This Policy</h2>
          <p>
            This policy may be updated from time to time. Any changes will be notified via email or
            in-app alerts.
          </p>
        </li>
      </ol>

      <div class="contact">
        <h2>Contact Us</h2>
        <p>If you have any questions or concerns about this policy, please reach out to us at:</p>
        <p>📧 <a href="mailto:support@yallahbaggage.com">support@yallahbaggage.com</a></p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue'
import Header from '@/components/layout/Header.vue'

// No logic needed for static content
</script>

<style lang="scss" scoped>
.privacy-page {
  background-color: #f9f9f9;

  .privacy-container {
    background: white;
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
    color: #777;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .intro {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .policy-list {
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
        padding-left: 1.5rem;
        list-style-type: disc;

        li {
          font-size: 0.95rem;
          margin-bottom: 0.3rem;
          color: #444;
        }

        a {
          color: #1976d2;
          text-decoration: underline;

          &:hover {
            text-decoration: none;
          }
        }
      }

      a {
        color: #1976d2;
        text-decoration: underline;
      }
    }
  }

  .contact {
    margin-top: 2rem;

    h2 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.95rem;
      color: #444;
    }

    a {
      color: #1976d2;
      text-decoration: underline;
    }
  }
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
