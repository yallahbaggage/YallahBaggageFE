<template>
  <div class="landing-page">
    <!-- Header -->
    <header class="page-header">
      <div class="container header-content">
        <div class="logo">
          <img src="@/assets/images/logo.svg" alt="Logo" />
          Yallah Baggage
        </div>
        <nav class="nav-links">
          <a href="#contact">Contact</a>
          <a href="#faqs">FAQs</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="full-width-section hero-section">
      <div class="container">
        <div class="hero">
          <div class="waitlist-box">
            <h3>Be the first to know when we launch</h3>
            <button class="waitlist-button" @click="redirectToWaitlist">Join Waitlist</button>
          </div>

          <h1 class="title">Lunch App Coming Soon!</h1>
          <p class="subtitle">We're cooking up something tasty. Stay tuned!</p>
          <div class="countdown">
            <div class="time-box" v-for="(value, label) in countdown" :key="label">
              <span class="number">{{ value }}</span>
              <span class="label">{{ label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image and Text Section -->
    <section class="full-width-section image-text-section">
      <div class="container image-text-content">
        <div class="image-box">
          <img src="@/assets/images/travel.webp" alt="Descriptive Image" />
        </div>
        <div class="text-box">
          <h2>Travel Smarter with Yallah Baggage</h2>
          <p>
            Say goodbye to the hassle of carrying your bags around. Whether you're a tourist,
            business traveler, or digital nomad, Yallah Baggage ensures your journey through Dubai
            is smooth and hands-free.
          </p>
          <p>
            We pick up, store, and deliver your luggage wherever you are, so you can explore the
            city without limitations.
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faqs" class="full-width-section faq-section">
      <div class="container">
        <h2 class="faq-title">Frequently Asked Questions</h2>

        <div class="waitlist-box under-faq">
          <h3>Still curious? Join the waitlist!</h3>
          <button class="waitlist-button" @click="redirectToWaitlist">Join Waitlist</button>
        </div>

        <div v-for="(faq, index) in faqs" :key="index" class="accordion">
          <button class="accordion-header" @click="toggleFAQ(index)">
            {{ faq.question }}
            <span>{{ openFAQ === index ? '−' : '+' }}</span>
          </button>
          <div class="accordion-body" v-show="openFAQ === index">
            <div v-html="faq.answer"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="full-width-section contact-section">
      <div class="container">
        <div class="contact-box">
          <div class="contact-content">
            <div class="text">
              <h2>Have Questions?</h2>
              <p>
                Should you require further information about our app, its features, or membership
                structure, don't hesitate to get in touch with us.
              </p>
            </div>
            <button v-on:click="redirectToWaitlist" class="email-button">Contact Us →</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-left">
          <div class="footer-logo">
            <img src="@/assets/images/logo.svg" alt="Logo" />
            <span>Yallah Baggage</span>
          </div>
          <p class="footer-desc">Helping you pack smarter and launch stronger.</p>
          <div class="social-icons">
            <a href="https://facebook.com" target="_blank" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" aria-label="linkedin">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://instagram.com" target="_blank" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div class="footer-right">
          <nav class="footer-links">
            <a href="#contact">Contact</a>
            <a href="#faqs">FAQs</a>
            <a href="#">Home</a>
          </nav>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} Yallah Baggage. All rights reserved.</p>
      </div>
    </footer>

    <!-- Back to Top -->
    <button v-show="showToTop" class="to-top-button" @click="scrollToTop" aria-label="Back to top">
      <v-icon>mdi-arrow-up-thin</v-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const targetDate = new Date('2025-07-04T00:00:00').getTime()
const countdown = ref({ days: 0, hours: 0, min: 0, sec: 0 })
let interval: ReturnType<typeof setInterval>

const updateCountdown = () => {
  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance <= 0) {
    clearInterval(interval)
    countdown.value = { days: 0, hours: 0, min: 0, sec: 0 }
    return
  }

  countdown.value = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    min: Math.floor((distance / (1000 * 60)) % 60),
    sec: Math.floor((distance / 1000) % 60),
  }
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})
onUnmounted(() => clearInterval(interval))

const openFAQ = ref<number | null>(null)
const toggleFAQ = (index: number) => {
  openFAQ.value = openFAQ.value === index ? null : index
}

const faqs = ref([
  {
    question: 'What is Yallah Baggage?',
    answer: `Yallah Baggage is an on-demand luggage pickup, storage, and delivery service designed for travelers in Dubai and wider UAE.
    We collect your bags from the airport your hotel, Airbnb, or any location, securely store them, and deliver them back to you when and where you need — whether it’s at the airport, a mall, or your next stop.`,
  },
  {
    question: 'What problem does Yallah Baggage solve?',
    answer: `Travelers often face long gaps between check-out and flights — with no safe place to store their luggage.
Dragging bags around the city wastes time, limits your plans, and adds stress to your trip.

Yallah Baggage gives you the freedom to explore Dubai or wider UAE hands-free, without worrying about your bags.`,
  },
  {
    question: 'Who is Yallah Baggage for?',
    answer: `
    <p>We’re built for anyone who wants to travel smarter in Dubai, including:</p>
    <ul>
      <li>✈️ Tourists with early check-outs or late-night flights</li>
      <li>💼 Business travelers heading to meetings after checkout</li>
      <li>🕌 Pilgrims transiting to/from Saudi Arabia</li>
      <li>🏙️ Digital nomads and Airbnb guests with no concierge</li>
      <li>👨‍👩‍👧‍👦 Families who want to enjoy the city without luggage hassle</li>
    </ul>
  `,
  },
])

const redirectToWaitlist = () => {
  window.open(
    'https://docs.google.com/forms/d/1um_GwQQLqG_p1ioVGQy9950JQ7uOEH8iX3--GHuAawo/edit',
    '_blank',
  )
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const showToTop = ref(false)

const handleScroll = () => {
  showToTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
@use 'styles/main' as *;

.landing-page {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(to bottom, #f4f7ff, #e6ecff);
  color: #1a1a1a;

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

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero-section {
    background: linear-gradient(to bottom right, #cfd9ff, #eef1ff);
    padding: 4rem 0;
  }

  .hero {
    text-align: center;
    margin-bottom: 4rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 12px 24px rgba(31, 38, 135, 0.2);
    padding: 3rem 2rem;
    color: #fff;

    .title {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #335cff;
    }

    .subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: #e2e8f0;
    }

    .countdown {
      display: flex;
      justify-content: center;
      gap: 1.5rem;

      .time-box {
        background: rgba(255, 255, 255, 0.25);
        padding: 1.5rem;
        border-radius: 12px;
        min-width: 90px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);

        .number {
          font-size: 2rem;
          font-weight: bold;
          color: #335cff;
        }

        .label {
          font-size: 0.9rem;
          color: #444;
        }
      }
    }
  }

  .image-text-section {
    background: linear-gradient(to right, #1c1f2a, #2c2f3a);
    padding: 4rem 0;

    .image-text-content {
      display: flex;
      gap: 2rem;
      align-items: center;
      flex-wrap: wrap;

      .image-box {
        flex: 1 1 50%;

        img {
          width: 100%;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }

      .text-box {
        flex: 1 1 45%;

        h2 {
          font-size: 2rem;
          color: #335cff;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1rem;
          color: #d4cdcd;
          margin-bottom: 1rem;
          line-height: 1.6;
        }
      }
    }
  }

  .faq-section {
    background-color: #f2f6ff;
    padding: 4rem 0;

    .faq-title {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 2rem;
      color: #335cff;
    }

    .accordion {
      background-color: #ffffff;
      border-radius: 10px;
      margin-bottom: 1rem;
      overflow: hidden;
      border: 1px solid #e0e7ff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

      .accordion-header {
        background: none;
        border: none;
        color: #1a1a1a;
        width: 100%;
        text-align: left;
        font-size: 1.1rem;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-weight: 600;

        span {
          font-size: 1.5rem;
          color: #335cff;
        }
      }

      .accordion-body {
        padding: 1rem;
        color: #333;
        font-size: 0.95rem;
        border-top: 1px solid #e0e7ff;
        margin-left: 15px;


        ul {
          list-style: none;
          padding-left: 0;
          margin: 0.5rem 0 0 0;
          margin-left: 50px;

          li {
            position: relative;
            padding-left: 1.5rem;
            text-indent: -1.5rem;
            margin-bottom: 0.5rem;

            &::before {
              content: '•';
              color: #335cff;
              display: inline-block;
              width: 1.5rem;
            }
          }
        }
      }
    }
  }

  .contact-section {
    background: linear-gradient(to bottom right, #cfd9ff, #eef1ff);
    padding: 4rem 0;

    .contact-box {
      background: rgba(255, 255, 255, 0.25);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.4);

      .contact-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1.5rem;
      }

      .text {
        max-width: 600px;

        h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #335cff;
        }

        p {
          color: #333;
          line-height: 1.6;
        }
      }

      .email-button {
        background: linear-gradient(to right, #335cff, #5f79ff);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 999px;
        font-weight: bold;
        font-size: 1rem;
        transition: all 0.3s;
        border: none;
        cursor: pointer;

        &:hover {
          opacity: 0.9;
        }
      }
    }
  }

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
        color: #335cff;
        margin-bottom: 0.5rem;

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

  .to-top-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: #335cff;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 50%;
    font-size: 1.25rem;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition:
      background 0.3s,
      opacity 0.3s ease;
    z-index: 1000;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    &[style*='display: none'] {
      opacity: 0;
      pointer-events: none;
    }

    &:hover {
      background-color: #2549d9;
    }
  }

  .waitlist-box {
    margin-bottom: 2rem;
    text-align: center;

    h3 {
      font-size: 1.25rem;
      color: #335cff;
      margin-bottom: 1rem;
    }

    .waitlist-button {
      background-color: #335cff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-weight: bold;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background-color: #2549d9;
      }
    }
  }
}
</style>
