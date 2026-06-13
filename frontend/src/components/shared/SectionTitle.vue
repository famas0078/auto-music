<template>
  <div>
    <span v-if="eyebrow" class="section-eyebrow">{{ eyebrow }}</span>
    <h2 class="section-title" v-html="title"></h2>
    <p v-if="copy" class="section-copy">{{ copy }}</p>
  </div>
</template>

<script>
export default {
  name: 'SectionTitle',
  props: {
    copy: {
      type: String,
      default: '',
    },
    eyebrow: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

