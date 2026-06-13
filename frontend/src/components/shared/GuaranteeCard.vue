<template>
  <article class="guarantee-card" :class="{ 'guarantee-card--active': highlighted }">
    <h3>{{ title }}</h3>
    <div class="guarantee-card__icon">
      <span>{{ icon }}</span>
    </div>
    <p>{{ description }}</p>
  </article>
</template>

<script>
export default {
  name: 'GuaranteeCard',
  props: {
    description: {
      type: String,
      required: true,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '♪',
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.guarantee-card {
  max-width: 307px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 398px;
  padding: 34px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(90, 42, 96, 0.08);
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease,
    color 0.3s ease;
}

@media (max-width: 900px) {
  .guarantee-card{
    max-width: none;
  }
}

.guarantee-card:hover {
  transform: translateY(-6px);
}

.guarantee-card--active {
  flex: 1 1 auto;
  max-width: none;
  color: #fff;
  background: linear-gradient(180deg, #e30f3f 0%, #d31247 100%);
  box-shadow: 0 18px 30px rgba(227, 15, 63, 0.22);
  transform: scale(1.05) !important;
  @media (max-width: 900px) {
    transform: scale(1) !important;
  }
}

.guarantee-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 12px 0 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}

.guarantee-card:not(.guarantee-card--active) .guarantee-card__icon {
  background: rgba(225, 15, 55, 0.08);
  color: var(--brand-red);
}

.guarantee-card h3 {
  max-width: 210px;
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
}

.guarantee-card p {
  margin: 0;
  color: inherit;
  opacity: 0.84;
  font-size: 12px;
  line-height: 1.45;
}

@media (max-width: 900px) {
  .guarantee-card {
    min-height: auto;
    padding: 28px 18px;
  }
}
</style>
