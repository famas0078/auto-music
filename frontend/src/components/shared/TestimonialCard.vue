<template>
  <article class="testimonial-card">
    <div class="testimonial-card__head">
      <div class="testimonial-card__avatar">
        <img v-if="testimonial.avatarSrc" :src="testimonial.avatarSrc" :alt="testimonial.name" />
        <span v-else>{{ initials }}</span>
      </div>
      <div>
        <h3>{{ testimonial.name }}</h3>
        <span>{{ testimonial.role }}</span>
      </div>
    </div>
    <p>{{ testimonial.quote }}</p>
  </article>
</template>

<script>
export default {
  name: 'TestimonialCard',
  props: {
    testimonial: {
      type: Object,
      required: true,
    },
  },
  computed: {
    initials() {
      return this.testimonial.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    },
  },
};
</script>

<style scoped>
.testimonial-card {
  padding: 32px 46px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(90, 42, 96, 0.08);
}

.testimonial-card__head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.testimonial-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  overflow: hidden;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  background: var(--brand-gradient);
}

.testimonial-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-card h3 {
  margin: 0 0 4px;
}

.testimonial-card span {
  color: var(--text-soft);
  font-size: 12px;
}

.testimonial-card p {
  margin: 0;
  color: var(--text-soft);
  font-size: 12px;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .testimonial-card {
    padding: 24px 20px;
  }
}
</style>
