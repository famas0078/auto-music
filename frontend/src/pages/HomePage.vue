<template>
  <div class="home-page">
    <section id="hero" class="hero">
      <div class="container hero__grid">
        <div class="hero__copy" v-reveal>
          <span class="hero__eyebrow">Автозвук нового уровня</span>
          <h1 class="hero__title">
            Идеальный <span>звук</span> для
            <br />
            вашего автомобиля!
          </h1>
          <p class="hero__text">
            Ощутите мощь звука в вашем автомобиле и получите бесплатную консультацию от наших
            профессионалов.
          </p>
          <BaseButton class="hero__button" @click="goToConsultation">Получить консультацию</BaseButton>
        </div>

        <div class="hero__wave" v-reveal="2" aria-hidden="true">
          <span v-for="bar in 12" :key="bar" :style="{ '--bar-index': bar }"></span>
        </div>
      </div>
    </section>

    <section class="container section-block">
      <div class="guarantees">
        <div class="guarantees__head" v-reveal>
          <h2>Какие у нас <span>гарантии?</span></h2>
        </div>

        <div class="guarantees__grid">
          <GuaranteeCard
            v-for="(item, index) in home.guarantees"
            :key="item.title"
            v-reveal="index + 1"
            :title="item.title"
            :description="item.description"
            :icon="item.icon"
            :highlighted="index === 1"
          />
        </div>
      </div>
    </section>

    <section id="new-arrivals" class="container section-block arrivals">
      <div class="arrivals__copy" v-reveal>
        <span class="section-eyebrow">Новинки</span>
        <h2>Наши последние <span>новинки</span></h2>
        <p>Подборка свежих моделей, которые уже можно заказать или установить в ближайшее время.</p>
        <BaseButton class="section-button" @click="openCatalog">Смотреть еще</BaseButton>
      </div>

      <div class="arrivals__grid">
        <ProductCard
          v-for="(item, index) in home.newProducts"
          :key="item.id"
          v-reveal="index + 1"
          :product="item"
          show-actions
          @add-to-cart="handleAddToCart"
        />
      </div>
    </section>

    <section id="weekly" class="container section-block weekly">
      <div class="weekly__showcase" v-reveal>
        <div class="weekly__topline">
          <span class="weekly__label">Популярны на этой неделе</span>
          <div class="weekly__nav">
            <button type="button" aria-label="Предыдущий товар" @click="shiftWeekly(-1)">←</button>
            <button type="button" aria-label="Следующий товар" @click="shiftWeekly(1)">→</button>
          </div>
        </div>

        <div ref="weeklyViewport" class="weekly__viewport" @scroll.passive="handleWeeklyScroll">
          <div class="weekly__track" :style="weeklyTrackStyle">
            <div
              v-for="product in home.weeklyProducts"
              :key="product.id"
              ref="weeklySlides"
              class="weekly__slide"
            >
              <ProductCard :product="product" wide show-actions @add-to-cart="handleAddToCart" />
            </div>
          </div>
        </div>
      </div>

      <div class="weekly__copy" v-reveal="2">
        <span class="section-eyebrow">Хиты недели</span>
        <h2>
          Популярны на
          <br />
          этой <span>неделе</span>
        </h2>
        <p>
          Еженедельная подборка товаров, которые чаще всего выбирают для апгрейда повседневных и
          соревновательных систем.
        </p>
        <BaseButton class="section-button" @click="openCatalog">Смотреть еще</BaseButton>
      </div>
    </section>

    <section id="reviews" class="container section-block reviews">
      <div class="reviews__head" v-reveal>
        <span class="section-eyebrow">Отзывы</span>
        <h2>
          Мы слышим что они
          <br />
          <span>слышат</span>
        </h2>
        <p>Реальные впечатления клиентов после установки, настройки и подбора оборудования.</p>
      </div>

      <div class="reviews__grid">
        <TestimonialCard
          v-for="(item, index) in home.testimonials"
          :key="item.name"
          v-reveal="index + 1"
          :testimonial="item"
        />
      </div>
    </section>

    <section id="newsletter" class="container section-block newsletter">
      <div class="newsletter__card" v-reveal>
        <div class="newsletter__visual" aria-hidden="true">
          <img :src="newsletterImages.man" alt="" class="newsletter__person" />
        </div>
        <img :src="newsletterImages.spark" alt="" class="newsletter__spark" />
        <div class="newsletter__copy">
          <span class="section-eyebrow section-eyebrow--light">Подписка</span>
          <h2>Присоединяйся к <span>нам</span>!</h2>
          <p>
            Вы будете получать самую первую обновленную информацию о наших услугах и товарах.
          </p>

          <form class="newsletter__form" @submit.prevent="handleSubscribe">
            <label class="newsletter__field">
              <span>@</span>
              <input v-model.trim="newsletterEmail" type="email" placeholder="Ваш e-mail" required />
            </label>
            <BaseButton type="submit" :disabled="isSubscribing">Подписаться</BaseButton>
          </form>

          <p v-if="subscribeMessage" class="newsletter__message">{{ subscribeMessage }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BaseButton from '../components/shared/BaseButton.vue';
import GuaranteeCard from '../components/shared/GuaranteeCard.vue';
import ProductCard from '../components/shared/ProductCard.vue';
import TestimonialCard from '../components/shared/TestimonialCard.vue';
import { api } from '../services/api';
import { enrichProducts, enrichTestimonials, newsletterImages } from '../data/media';
import { authStore } from '../stores/auth';
import { cartStore } from '../stores/cart';

export default {
  name: 'HomePage',
  components: {
    BaseButton,
    GuaranteeCard,
    ProductCard,
    TestimonialCard,
  },
  data() {
    return {
      home: {
        guarantees: [],
        newProducts: [],
        weeklyProducts: [],
        testimonials: [],
      },
      isSubscribing: false,
      newsletterEmail: '',
      subscribeMessage: '',
      weeklyIndex: 0,
      weeklyPerView: 2,
      newsletterImages,
    };
  },
  computed: {
    maxWeeklyIndex() {
      return Math.max(0, this.home.weeklyProducts.length - this.weeklyPerView);
    },
    weeklyTrackStyle() {
      return {
        '--per-view': this.weeklyPerView,
        '--weekly-gap': this.weeklyPerView === 1 ? '12px' : '18px',
      };
    },
  },
  async created() {
    this.updateWeeklyPerView();

    try {
      const payload = await api.getHome();
      this.home = {
        guarantees: payload.guarantees || [],
        newProducts: enrichProducts(payload.newProducts || []),
        weeklyProducts: enrichProducts(payload.weeklyProducts || []),
        testimonials: enrichTestimonials(payload.testimonials || []),
      };
      this.$nextTick(() => {
        this.scrollWeeklyToIndex(false);
      });
    } catch (error) {
      this.subscribeMessage = 'Сервис временно недоступен, но макет страницы уже готов.';
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateWeeklyPerView, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateWeeklyPerView);
  },
  methods: {
    goToConsultation() {
      this.$router.push({ path: '/', hash: '#newsletter' });
    },
    openCatalog() {
      this.$router.push('/catalog');
    },
    shiftWeekly(direction) {
      if (!this.home.weeklyProducts.length) {
        return;
      }

      const nextIndex = this.weeklyIndex + direction;

      if (nextIndex < 0) {
        this.weeklyIndex = this.maxWeeklyIndex;
        return;
      }

      if (nextIndex > this.maxWeeklyIndex) {
        this.weeklyIndex = 0;
      } else {
        this.weeklyIndex = nextIndex;
      }

      this.scrollWeeklyToIndex();
    },
    updateWeeklyPerView() {
      const nextValue = window.innerWidth <= 820 ? 1 : 2;
      this.weeklyPerView = nextValue;
      this.weeklyIndex = Math.min(this.weeklyIndex, Math.max(0, this.home.weeklyProducts.length - nextValue));
      this.$nextTick(() => {
        this.scrollWeeklyToIndex(false);
      });
    },
    scrollWeeklyToIndex(smooth = true) {
      const slides = Array.isArray(this.$refs.weeklySlides)
        ? this.$refs.weeklySlides
        : [this.$refs.weeklySlides].filter(Boolean);
      const target = slides[this.weeklyIndex];

      if (!target || typeof target.scrollIntoView !== 'function') {
        return;
      }

      target.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'start',
      });
    },
    handleWeeklyScroll() {
      const viewport = this.$refs.weeklyViewport;
      const slides = Array.isArray(this.$refs.weeklySlides)
        ? this.$refs.weeklySlides
        : [this.$refs.weeklySlides].filter(Boolean);

      if (!viewport || !slides.length) {
        return;
      }

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      this.weeklyIndex = Math.min(this.maxWeeklyIndex, closestIndex);
    },
    handleAddToCart(product) {
      if (!authStore.isAuthenticated) {
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.fullPath,
          },
        });
        return;
      }

      cartStore.add(product);
      this.subscribeMessage = `Товар «${product.title}» добавлен в корзину.`;
      window.setTimeout(() => {
        this.subscribeMessage = '';
      }, 2200);
    },
    async handleSubscribe() {
      this.isSubscribing = true;
      this.subscribeMessage = '';

      try {
        const response = await api.subscribe(this.newsletterEmail);
        this.subscribeMessage = response.message;
        this.newsletterEmail = '';
      } catch (error) {
        this.subscribeMessage = error.message;
      } finally {
        this.isSubscribing = false;
      }
    },
  },
};
</script>

<style scoped>
.home-page {
  padding-bottom: 4px;
}

.hero {
  padding-top: 72px;
}

.hero__grid {
  display: grid;
  grid-template-columns: 480px 410px;
  justify-content: space-between;
  align-items: center;
  min-height: 481px;
}

.hero__eyebrow {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--brand-red);
  background: #fff0f4;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero__title {
  margin: 18px 0 0;
  font-size: 64px;
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.hero__title span,
.guarantees__head span,
.arrivals__copy span,
.weekly__copy span,
.reviews__head span,
.newsletter__copy span {
  color: var(--brand-red);
}

.newsletter__copy span {
  color: var(--brand-red);
  @media (max-width: 1240px) {
    color: var(--bg);
  }
}

.hero__text {
  max-width: 405px;
  margin: 18px 0 28px;
  color: #767b89;
  font-size: 14px;
  line-height: 1.6;
}

.hero__button {
  min-width: 268px;
}

.hero__wave {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;
  gap: 10px;
  width: 410px;
  height: 481px;
}

.hero__wave span {
  align-self: center;
  border-radius: 999px;
  background: linear-gradient(180deg, #702e76 0%, #a31c5a 55%, #ef1140 100%);
  animation: wavePulse 3.4s ease-in-out infinite;
  animation-delay: calc(var(--bar-index) * 0.08s);
}

.hero__wave span:nth-child(1),
.hero__wave span:nth-child(12) {
  height: 72px;
}

.hero__wave span:nth-child(2),
.hero__wave span:nth-child(11) {
  height: 112px;
}

.hero__wave span:nth-child(3),
.hero__wave span:nth-child(10) {
  height: 172px;
}

.hero__wave span:nth-child(4),
.hero__wave span:nth-child(9) {
  height: 264px;
}

.hero__wave span:nth-child(5),
.hero__wave span:nth-child(8) {
  height: 372px;
}

.hero__wave span:nth-child(6),
.hero__wave span:nth-child(7) {
  height: 481px;
}

.guarantees {
  padding: 70px 73px;
  border-radius: 16px;
  background: #f5f3f7;
}

.guarantees__head h2,
.arrivals__copy h2,
.weekly__copy h2,
.reviews__head h2,
.newsletter__copy h2 {
  margin: 0;
  font-size: 48px;
  line-height: 1;
  letter-spacing: -0.03em;
}

.guarantees__grid {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  margin-top: 40px;
}

.arrivals {
  display: grid;
  grid-template-columns: 337px minmax(0, 780px);
  justify-content: space-between;
  align-items: start;
}

.arrivals__copy {
  padding-top: 34px;
}

.arrivals__copy p,
.weekly__copy p,
.reviews__head p,
.newsletter__copy p {
  margin: 18px 0 24px;
  color: #767b89;
  line-height: 1.6;
}

.section-button {
  min-width: 186px;
}

.arrivals__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.weekly {
  display: grid;
  grid-template-columns: minmax(0, 702px) 337px;
  justify-content: space-between;
  align-items: center;
}

.weekly__showcase {
  position: relative;
  min-height: 479px;
  padding: 40px 40px 34px;
  overflow: hidden;
  border-radius: 0 54px 54px 0;
  background: linear-gradient(90deg, #68256e 0%, #a1195c 56%, #d1164c 100%);
}

.weekly__showcase::before {
  content: '';
  position: absolute;
  left: -100px;
  bottom: -120px;
  width: 320px;
  height: 220px;
  border-radius: 48% 56% 48% 60%;
  background: rgba(255, 255, 255, 0.12);
}

.weekly__topline {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.weekly__label {
  color: rgba(255, 255, 255, 0.88);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.weekly__nav {
  display: inline-flex;
  gap: 10px;
}

.weekly__nav button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  color: #68256e;
  background: #ffffff;
  cursor: pointer;
}

.weekly__viewport {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
}

.weekly__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - (var(--per-view) - 1) * var(--weekly-gap)) / var(--per-view));
  gap: var(--weekly-gap);
}

.weekly__slide {
  min-width: 0;
  scroll-snap-align: start;
}

.weekly__viewport::-webkit-scrollbar {
  display: none;
}

.reviews__head {
  max-width: 704px;
  margin: 0 auto;
  text-align: center;
}

.reviews__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.newsletter__card {
  display: grid;
  grid-template-columns: 420px minmax(0, 1fr);
  align-items: center;
  gap: 24px;
  min-height: 347px;
  padding: 0 34px;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(90deg, #ef1140 0%, #a1195c 54%, #68256e 100%);
}

.newsletter__visual {
  position: relative;
  min-height: 320px;
  @media (max-width: 1240px) {
    display: none;
  }
}

.newsletter__spark {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.9;
  z-index: 2;
}

.newsletter__person {
  position: absolute;
  left: 10px;
  bottom: -38px;
  width: 320px;
  max-width: 100%;
  z-index: 4;
}

.newsletter__copy {
  position: relative;
  z-index: 4;
  color: #ffffff;
}

.newsletter__copy p {
  color: rgba(255, 255, 255, 0.82);
}

.section-eyebrow--light {
  color: #fff;
}

.section-eyebrow--light::before {
  background: rgba(255, 255, 255, 0.72);
}

.newsletter__form {
  display: flex;
  align-items: center;
  gap: 12px;
}

.newsletter__field {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 24px;
  background: #ffffff;
  color: #6f7380;
}

.newsletter__field input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
}

.newsletter__message {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.92);
}

@keyframes wavePulse {
  0%,
  100% {
    transform: scaleY(1);
    opacity: 1;
  }

  50% {
    transform: scaleY(0.88);
    opacity: 0.86;
  }
}

@media (max-width: 1240px) {
  .hero__grid,
  .arrivals,
  .weekly,
  .newsletter__card {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero__grid {
    min-height: auto;
  }

  .hero__wave {
    width: min(410px, 100%);
    margin: 0 auto;
  }

  .guarantees {
    padding: 44px 24px;
  }

  .arrivals__grid,
  .reviews__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .arrivals__copy,
  .weekly__copy {
    padding-top: 0;
  }

  .newsletter__card {
    padding: 28px 26px;
  }

  .newsletter__visual {
    min-height: 240px;
    order: 2;
  }

  .newsletter__copy {
    order: 1;
  }
}

@media (max-width: 900px) {
  .hero {
    padding-top: 28px;
  }

  .guarantees__grid {
    flex-direction: column;
  }

  .arrivals__grid,
  .reviews__grid,
  .newsletter__form {
    grid-template-columns: 1fr;
  }

  .hero__title,
  .guarantees__head h2,
  .arrivals__copy h2,
  .weekly__copy h2,
  .reviews__head h2,
  .newsletter__copy h2 {
    font-size: 38px;
  }

  .hero__wave {
    height: 250px;
    max-width: 310px;
  }

  .hero__wave span:nth-child(5),
  .hero__wave span:nth-child(8) {
    height: 210px;
  }

  .hero__wave span:nth-child(6),
  .hero__wave span:nth-child(7) {
    height: 250px;
  }

  .weekly__showcase {
    min-height: auto;
    padding: 22px 18px 18px;
    border-radius: 24px;
  }

  .weekly__topline {
    align-items: flex-start;
  }

  .weekly__showcase :deep(.product-card--wide .product-card__visual) {
    min-height: 200px;
  }

  .weekly__showcase :deep(.product-card--wide .product-card__image) {
    max-height: 140px;
  }

  .newsletter__card {
    padding: 28px 20px 20px;
    border-radius: 24px;
  }

  .newsletter__visual {
    min-height: 200px;
  }

  .newsletter__spark {
    left: -60px;
    top: 0;
    width: 220px;
  }

  .newsletter__person {
    left: 50%;
    width: 220px;
    bottom: -20px;
    transform: translateX(-50%);
  }
}

@media (max-width: 640px) {
  .hero__title,
  .guarantees__head h2,
  .arrivals__copy h2,
  .weekly__copy h2,
  .reviews__head h2,
  .newsletter__copy h2 {
    font-size: 32px;
  }

  .hero__button,
  .section-button,
  .newsletter__form :deep(.base-button) {
    width: 100%;
  }

  .arrivals__grid,
  .reviews__grid,
  .newsletter__form {
    display: grid;
    grid-template-columns: 1fr;
  }

  .weekly__topline {
    flex-direction: column;
    gap: 14px;
  }

  .weekly__nav {
    width: 100%;
    justify-content: flex-end;
  }

  .newsletter__card {
    gap: 18px;
    padding: 24px 16px 18px;
  }

  .newsletter__visual {
    min-height: 160px;
  }

  .newsletter__spark {
    left: -48px;
    width: 180px;
  }

  .newsletter__person {
    width: 180px;
    bottom: -16px;
  }
}
</style>
