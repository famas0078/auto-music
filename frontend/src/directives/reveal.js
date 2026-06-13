const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -6% 0px',
  },
);

export default {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '');
    if (binding.value) {
      el.setAttribute('data-reveal-delay', String(binding.value));
    }
    observer.observe(el);
  },
  unmounted(el) {
    observer.unobserve(el);
  },
};

