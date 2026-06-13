<template>
  <component
    :is="tag"
    class="base-button"
    :type="tag === 'button' ? type : undefined"
    :to="to"
    :href="href"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    href: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'button',
    },
    to: {
      type: [String, Object],
      default: '',
    },
    type: {
      type: String,
      default: 'button',
    },
  },
};
</script>

