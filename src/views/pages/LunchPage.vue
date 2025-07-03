<template>
  <div class="landing-page">
    <!-- Animated Background Elements -->
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- Header -->
    <header class="page-header">
      <div class="container header-content">
        <div class="logo" @click="scrollToTop" style="cursor: pointer">
          <img src="@/assets/images/logo.svg" alt="Logo" />
          <span class="logo-text">Yallah Baggage</span>
        </div>
        <nav class="nav-links">
          <a href="#contact" class="nav-link">Contact</a>
          <a href="#faqs" class="nav-link">FAQs</a>
          <button class="nav-button" @click="redirectToWaitlist">Join Waitlist</button>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="full-width-section hero-section">
      <div class="container">
        <div class="hero">
          <div class="hero-content">
            <h1 class="title animate__animated animate__fadeInDown">Lunch App Coming Soon!</h1>
            <p class="subtitle animate__animated animate__fadeInDown animate__delay-1s">
              We're cooking up something tasty. Stay tuned!
            </p>
            
            <div class="countdown animate__animated animate__fadeInUp animate__delay-1s">
              <div class="time-box" v-for="(value, label) in countdown" :key="label">
                <span class="number">{{ value }}</span>
                <span class="label">{{ label }}</span>
              </div>
            </div>
            
            <div class="hero-buttons animate__animated animate__fadeInUp animate__delay-2s">
              <button class="waitlist-button" @click="redirectToWaitlist">Join Waitlist</button>
              <button class="secondary-button" @click="scrollToSection('features')">
                Learn More
              </button>
            </div>
          </div>
          
          <div class="hero-image animate__animated animate__fadeInRight">
            <img src="@/assets/images/travel.webp" alt="Travel with ease" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="full-width-section features-section">
      <div class="container">
        <h2 class="section-title animate__animated" :class="{ 'animate__fadeInUp': isVisible.features }">
          Travel Smarter with Yallah Baggage
        </h2>
        
        <div class="features-grid">
          <div 
            class="feature-card animate__animated" 
            :class="{ 'animate__fadeInUp': isVisible.features }"
            v-for="(feature, index) in features" 
            :key="index"
            :style="{ transitionDelay: `${index * 0.1}s` }"
          >
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Image and Text Section -->
    <section class="full-width-section image-text-section">
      <div class="container image-text-content">
        <div class="image-box animate__animated" :class="{ 'animate__fadeInLeft': isVisible.imageText }">
          <img src="@/assets/images/travel.webp" alt="Descriptive Image" />
        </div>
        <div class="text-box animate__animated" :class="{ 'animate__fadeInRight': isVisible.imageText }">
          <h2>Revolutionizing Travel in Dubai</h2>
          <p>
            Say goodbye to the hassle of carrying your bags around. Whether you're a tourist,
            business traveler, or digital nomad, Yallah Baggage ensures your journey through Dubai
            is smooth and hands-free.
          </p>
          <p>
            We pick up, store, and deliver your luggage wherever you are, so you can explore the
            city without limitations.
          </p>
          <ul class="benefits-list">
            <li><i class="fas fa-check-circle"></i> Secure storage facilities</li>
            <li><i class="fas fa-check-circle"></i> On-demand pickup & delivery</li>
            <li><i class="fas fa-check-circle"></i> Real-time tracking</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faqs" class="full-width-section faq-section">
      <div class="container">
        <h2 class="section-title animate__animated" :class="{ 'animate__fadeInUp': isVisible.faqs }">
          Frequently Asked Questions
        </h2>
        
        <div class="faq-container">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index" 
            class="accordion animate__animated" 
            :class="{ 'animate__fadeInUp': isVisible.faqs }"
            :style="{ transitionDelay: `${index * 0.1}s` }"
          >
            <button class="accordion-header" @click="toggleFAQ(index)">
              <span>{{ faq.question }}</span>
              <i :class="['fas', openFAQ === index ? 'fa-minus' : 'fa-plus']"></i>
            </button>
            <transition name="slide-fade">
              <div class="accordion-body" v-show="openFAQ === index">
                <div v-html="faq.answer"></div>
              </div>
            </transition>
          </div>
        </div>
        
        <div class="cta-box animate__animated" :class="{ 'animate__zoomIn': isVisible.faqs }">
          <h3>Still curious? Join the waitlist!</h3>
          <button class="waitlist-button" @click="redirectToWaitlist">Join Waitlist</button>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="full-width-section testimonials-section">
      <div class="container">
        <h2 class="section-title animate__animated" :class="{ 'animate__fadeInUp': isVisible.testimonials }">
          What Travelers Say
        </h2>
        
        <div class="testimonials-slider">
          <div 
            class="testimonial-card animate__animated" 
            :class="{ 'animate__fadeInUp': isVisible.testimonials }"
            v-for="(testimonial, index) in testimonials" 
            :key="index"
            :style="{ transitionDelay: `${index * 0.15}s` }"
          >
            <div class="testimonial-content">
              <div class="quote-icon">
                <i class="fas fa-quote-left"></i>
              </div>
              <p>{{ testimonial.text }}</p>
              <div class="testimonial-author">
                <img :src="testimonial.avatar" :alt="testimonial.name" />
                <div>
                  <h4>{{ testimonial.name }}</h4>
                  <span>{{ testimonial.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="full-width-section contact-section">
      <div class="container">
        <div class="contact-box animate__animated" :class="{ 'animate__zoomIn': isVisible.contact }">
          <div class="contact-content">
            <div class="text">
              <h2>Have Questions?</h2>
              <p>
                Should you require further information about our app, its features, or membership
                structure, don't hesitate to get in touch with us.
              </p>
            </div>
            <button @click="redirectToWaitlist" class="email-button">Contact Us <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-left">
          <div class="footer-logo" @click="scrollToTop" style="cursor: pointer">
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
          <div class="footer-links-group">
            <h3>Quick Links</h3>
            <nav class="footer-links">
              <a href="#contact">Contact</a>
              <a href="#faqs">FAQs</a>
              <a href="#">Home</a>
            </nav>
          </div>
          <div class="footer-links-group">
            <h3>Legal</h3>
            <nav class="footer-links">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>
            </nav>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} Yallah Baggage. All rights reserved.</p>
      </div>
    </footer>

    <!-- Back to Top -->
    <transition name="fade">
      <button v-show="showToTop" class="to-top-button" @click="scrollToTop" aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import 'animate.css'

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
  
  // Initialize intersection observers for scroll animations
  initIntersectionObservers()
})
onUnmounted(() => clearInterval(interval))

// Intersection Observer for scroll animations
const isVisible = ref({
  features: false,
  imageText: false,
  faqs: false,
  testimonials: false,
  contact: false
})

const initIntersectionObservers = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  }

  const sections = [
    { id: 'features', ref: 'features' },
    { id: 'image-text', ref: 'imageText' },
    { id: 'faqs', ref: 'faqs' },
    { id: 'testimonials', ref: 'testimonials' },
    { id: 'contact', ref: 'contact' }
  ]

  sections.forEach(section => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value[section.ref] = true
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  })
}

const openFAQ = ref<number | null>(null)
const toggleFAQ = (index: number) => {
  openFAQ.value = openFAQ.value === index ? null : index
}

const features = ref([
  {
    icon: 'fas fa-luggage-cart',
    title: 'Luggage Pickup',
    description: 'We collect your bags from any location in Dubai at your convenience.'
  },
  {
    icon: 'fas fa-warehouse',
    title: 'Secure Storage',
    description: 'Your belongings are stored in our monitored, climate-controlled facilities.'
  },
  {
    icon: 'fas fa-truck',
    title: 'On-Demand Delivery',
    description: 'Get your bags delivered wherever you need them, whenever you need them.'
  },
  {
    icon: 'fas fa-map-marker-alt',
    title: 'Real-Time Tracking',
    description: 'Track your luggage in real-time through our mobile app.'
  }
])

const faqs = ref([
  {
    question: 'What is Yallah Baggage?',
    answer: '<p>Yallah Baggage is an on-demand luggage pickup, storage, and delivery service designed for travelers in Dubai and wider UAE. We collect your bags from the airport, your hotel, Airbnb, or any location, securely store them, and deliver them back to you when and where you need — whether it\'s at the airport, a mall, or your next stop.</p>'
  },
  {
    question: 'What problem does Yallah Baggage solve?',
    answer: '<p>Travelers often face long gaps between check-out and flights — with no safe place to store their luggage. Dragging bags around the city wastes time, limits your plans, and adds stress to your trip. Yallah Baggage gives you the freedom to explore Dubai or wider UAE hands-free, without worrying about your bags.</p>'
  },
  {
    question: 'Who is Yallah Baggage for?',
    answer: `
      <p>We're built for anyone who wants to travel smarter in Dubai, including:</p>
      <ul class="faq-list">
        <li><i class="fas fa-plane"></i> Tourists with early check-outs or late-night flights</li>
        <li><i class="fas fa-briefcase"></i> Business travelers heading to meetings after checkout</li>
        <li><i class="fas fa-mosque"></i> Pilgrims transiting to/from Saudi Arabia</li>
        <li><i class="fas fa-laptop-house"></i> Digital nomads and Airbnb guests with no concierge</li>
        <li><i class="fas fa-users"></i> Families who want to enjoy the city without luggage hassle</li>
      </ul>
    `
  },
  {
    question: 'How does the pricing work?',
    answer: '<p>We offer flexible pricing based on the duration of storage and number of bags. Our pricing is transparent with no hidden fees. You\'ll pay for the storage time you need and any additional services like express delivery.</p>'
  },
  {
    question: 'Is my luggage insured?',
    answer: '<p>Yes! All luggage stored with Yallah Baggage is covered by our comprehensive insurance policy. We take every precaution to ensure your belongings are safe and secure while in our care.</p>'
  }
])

const testimonials = ref([
  {
    text: "Yallah Baggage saved our family vacation! We could explore Dubai without dragging our suitcases everywhere. The delivery was right on time for our flight.",
    name: "Sarah Johnson",
    role: "Family Traveler",
    avatar: "@/assets/images/avatar1.jpg"
  },
  {
    text: "As a business traveler, time is money. Yallah Baggage allowed me to go straight to my meetings after checkout without worrying about my luggage.",
    name: "Michael Chen",
    role: "Business Executive",
    avatar: "@/assets/images/avatar2.jpg"
  },
  {
    text: "The best service for digital nomads like me. I could work from different cafes without my bags. The app makes everything so easy!",
    name: "Emma Rodriguez",
    role: "Digital Nomad",
    avatar: "@/assets/images/avatar3.jpg"
  }
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

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
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
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  background: linear-gradient(to bottom, #f4f7ff, #e6ecff);
  color: #1a1a1a;
  position: relative;
  overflow-x: hidden;
  
  .bg-shapes {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    
    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(51, 92, 255, 0.05);
      backdrop-filter: blur(5px);
      
      &.shape-1 {
        width: 600px;
        height: 600px;
        top: -300px;
        right: -300px;
        animation: float 15s infinite ease-in-out;
      }
      
      &.shape-2 {
        width: 400px;
        height: 400px;
        bottom: -150px;
        left: -150px;
        animation: float 12s infinite ease-in-out reverse;
      }
      
      &.shape-3 {
        width: 200px;
        height: 200px;
        top: 30%;
        left: 20%;
        animation: float 8s infinite ease-in-out;
      }
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }

  .page-header {
    background: linear-gradient(to right, #1c1f2a, #2c2f3a);
    padding: 1.5rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 1.5rem;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      img {
        height: 40px;
        margin-right: 0.5rem;
      }
      
      .logo-text {
        background: linear-gradient(to right, #335cff, #5f79ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      
      .nav-link {
        color: #ffffff;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        position: relative;
        
        &:hover {
          color: #5f79ff;
          
          &::after {
            width: 100%;
          }
        }
        
        &::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, #335cff, #5f79ff);
          transition: width 0.3s ease;
        }
      }
      
      .nav-button {
        background: linear-gradient(to right, #335cff, #5f79ff);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(51, 92, 255, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(51, 92, 255, 0.4);
        }
      }
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  .hero-section {
    background: linear-gradient(to bottom right, #cfd9ff, #eef1ff);
    padding: 8rem 0 4rem;
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 3rem;
      
      .hero-content {
        flex: 1;
        text-align: left;
        max-width: 600px;
        
        .title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          color: #1c1f2a;
          line-height: 1.2;
          font-weight: 800;
          background: linear-gradient(to right, #1c1f2a, #335cff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.5rem;
          margin-bottom: 2.5rem;
          color: #4a5568;
          font-weight: 400;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          
          .waitlist-button {
            background: linear-gradient(to right, #335cff, #5f79ff);
            color: white;
            border: none;
            padding: 1rem 2rem;
            font-weight: 600;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(51, 92, 255, 0.3);
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(51, 92, 255, 0.4);
            }
          }
          
          .secondary-button {
            background: transparent;
            color: #335cff;
            border: 2px solid #335cff;
            padding: 1rem 2rem;
            font-weight: 600;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            
            &:hover {
              background: rgba(51, 92, 255, 0.1);
              transform: translateY(-2px);
            }
          }
        }
      }
      
      .hero-image {
        flex: 1;
        max-width: 600px;
        
        img {
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transform: perspective(1000px) rotateY(-10deg);
          transition: transform 0.5s ease;
          
          &:hover {
            transform: perspective(1000px) rotateY(0deg);
          }
        }
      }
    }

    .countdown {
      display: flex;
      gap: 1.5rem;
      margin-top: 2rem;

      .time-box {
        background: rgba(255, 255, 255, 0.9);
        padding: 1.5rem 1rem;
        border-radius: 12px;
        min-width: 100px;
        text-align: center;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #335cff;
          display: block;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .label {
          font-size: 1rem;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
      }
    }
  }

  .section-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #1c1f2a;
    position: relative;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(to right, #335cff, #5f79ff);
      border-radius: 2px;
    }
  }

  .features-section {
    padding: 6rem 0;
    background: white;
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      
      .feature-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.05);
        
        &:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(51, 92, 255, 0.15);
          border-color: rgba(51, 92, 255, 0.2);
        }
        
        .feature-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(to bottom right, #eef1ff, #cfd9ff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #335cff;
        }
        
        h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #1c1f2a;
        }
        
        p {
          color: #4a5568;
          line-height: 1.6;
        }
      }
    }
  }

  .image-text-section {
    padding: 6rem 0;
    background: linear-gradient(to right, #1c1f2a, #2c2f3a);
    
    .image-text-content {
      display: flex;
      gap: 4rem;
      align-items: center;
      
      .image-box {
        flex: 1;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        
        img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.5s ease;
          
          &:hover {
            transform: scale(1.03);
          }
        }
      }

      .text-box {
        flex: 1;
        
        h2 {
          font-size: 2.5rem;
          color: #fff;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }

        p {
          font-size: 1.1rem;
          color: #e2e8f0;
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
          margin-top: 2rem;
          
          li {
            margin-bottom: 1rem;
            font-size: 1.1rem;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            
            i {
              color: #5f79ff;
              margin-right: 1rem;
              font-size: 1.2rem;
            }
          }
        }
      }
    }
  }

  .faq-section {
    padding: 6rem 0;
    background: #f8faff;
    
    .faq-container {
      max-width: 800px;
      margin: 0 auto 3rem;
    }

    .accordion {
      background-color: #ffffff;
      border-radius: 12px;
      margin-bottom: 1rem;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .accordion-header {
        background: none;
        border: none;
        color: #1a1a1a;
        width: 100%;
        text-align: left;
        font-size: 1.2rem;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        
        &:hover {
          color: #335cff;
        }
        
        i {
          color: #335cff;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }
      }
      
      .slide-fade-enter-active, .slide-fade-leave-active {
        transition: all 0.3s ease;
      }
      
      .slide-fade-enter-from, .slide-fade-leave-to {
        opacity: 0;
        transform: translateY(-10px);
      }

      .accordion-body {
        padding: 0 1.5rem 1.5rem;
        color: #4a5568;
        font-size: 1rem;
        line-height: 1.8;
        
        .faq-list {
          list-style: none;
          padding-left: 0;
          margin: 1rem 0 0 0;
          
          li {
            position: relative;
            padding-left: 2rem;
            margin-bottom: 0.75rem;
            
            i {
              position: absolute;
              left: 0;
              top: 0.2em;
              color: #335cff;
            }
          }
        }
      }
    }
    
    .cta-box {
      background: linear-gradient(to right, #335cff, #5f79ff);
      border-radius: 16px;
      padding: 3rem;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: 0 15px 40px rgba(51, 92, 255, 0.3);
      
      h3 {
        font-size: 1.8rem;
        color: white;
        margin-bottom: 1.5rem;
      }
      
      .waitlist-button {
        background: white;
        color: #335cff;
        border: none;
        padding: 1rem 2.5rem;
        font-weight: 600;
        font-size: 1.1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
  
  .testimonials-section {
    padding: 6rem 0;
    background: white;
    
    .testimonials-slider {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      
      .testimonial-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.05);
        
        &:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }
        
        .testimonial-content {
          position: relative;
          
          .quote-icon {
            position: absolute;
            top: -10px;
            left: -10px;
            font-size: 3rem;
            color: rgba(51, 92, 255, 0.1);
            z-index: 0;
          }
          
          p {
            position: relative;
            z-index: 1;
            font-style: italic;
            color: #4a5568;
            line-height: 1.8;
            margin-bottom: 1.5rem;
          }
          
          .testimonial-author {
            display: flex;
            align-items: center;
            
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              object-fit: cover;
              margin-right: 1rem;
              border: 3px solid #eef1ff;
            }
            
            h4 {
              margin: 0;
              color: #1c1f2a;
              font-size: 1.1rem;
            }
            
            span {
              color: #718096;
              font-size: 0.9rem;
            }
          }
        }
      }
    }
  }

  .contact-section {
    padding: 6rem 0;
    background: linear-gradient(to bottom right, #cfd9ff, #eef1ff);
    
    .contact-box {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      padding: 4rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.4);

      .contact-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 2rem;
      }

      .text {
        max-width: 600px;
        
        h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #1c1f2a;
          line-height: 1.3;
        }

        p {
          color: #4a5568;
          line-height: 1.8;
          font-size: 1.1rem;
        }
      }

      .email-button {
        background: linear-gradient(to right, #335cff, #5f79ff);
        color: white;
        padding: 1rem 2.5rem;
        border-radius: 50px;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 10px 20px rgba(51, 92, 255, 0.3);
        
        i {
          transition: transform 0.3s ease;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(51, 92, 255, 0.4);
          
          i {
            transform: translateX(5px);
          }
        }
      }
    }
  }

  .footer {
    background: linear-gradient(to right, #1c1f2a, #2c2f3a);
    padding: 4rem 0 1rem;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 3rem;
    }

    .footer-left {
      max-width: 350px;
      
      .footer-logo {
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 1.5rem;
        color: #335cff;
        margin-bottom: 1rem;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
        }

        img {
          height: 30px;
          margin-right: 0.5rem;
        }
      }

      .footer-desc {
        font-size: 1rem;
        color: #e2e8f0;
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .social-icons {
        display: flex;
        gap: 1rem;
        
        a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e2e8f0;
          font-size: 1rem;
          transition: all 0.3s ease;
          
          &:hover {
            background: #335cff;
            color: white;
            transform: translateY(-3px);
          }
        }
      }
    }

    .footer-right {
      display: flex;
      gap: 3rem;
      
      .footer-links-group {
        h3 {
          color: #e2e8f0;
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.5rem;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2px;
            background: #335cff;
          }
        }
        
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          
          a {
            color: #cbd5e0;
            text-decoration: none;
            font-weight: 400;
            transition: all 0.3s ease;
            font-size: 1rem;
            
            &:hover {
              color: #5f79ff;
              padding-left: 5px;
            }
          }
        }
      }
    }

    .footer-bottom {
      text-align: center;
      font-size: 0.9rem;
      color: #a0aec0;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .to-top-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(to bottom right, #335cff, #5f79ff);
    color: white;
    border: none;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 1.25rem;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(51, 92, 255, 0.4);
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
      transform: translateY(-5px) scale(1.1);
      box-shadow: 0 15px 40px rgba(51, 92, 255, 0.5);
    }
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
}

@media (max-width: 992px) {
  .landing-page {
    .hero-section {
      .hero {
        flex-direction: column;
        text-align: center;
        
        .hero-content {
          text-align: center;
          margin-bottom: 3rem;
        }
      }
    }
    
    .image-text-section {
      .image-text-content {
        flex-direction: column;
        
        .text-box {
          text-align: center;
          
          .benefits-list {
            text-align: left;
            max-width: 400px;
            margin: 0 auto;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .landing-page {
    .page-header {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        
        .nav-links {
          width: 100%;
          justify-content: center;
        }
      }
    }
    
    .hero-section {
      padding-top: 10rem;
      
      .hero {
        .hero-content {
          .title {
            font-size: 2.5rem;
          }
          
          .subtitle {
            font-size: 1.2rem;
          }
          
          .hero-buttons {
            flex-direction: column;
          }
        }
      }
      
      .countdown {
        flex-wrap: wrap;
        justify-content: center;
        
        .time-box {
          min-width: 80px;
        }
      }
    }
    
    .contact-section {
      .contact-box {
        padding: 2rem;
        
        .contact-content {
          flex-direction: column;
          text-align: center;
        }
      }
    }
  }
}
</style>
