<template>
  <aside class="auth-showcase">
    <div class="auth-showcase__pattern auth-showcase__pattern--top"></div>
    <div class="auth-showcase__pattern auth-showcase__pattern--bottom"></div>
    <div class="auth-showcase__spark"></div>

    <div class="auth-showcase__device">
      <div class="auth-showcase__reel"></div>
      <div class="auth-showcase__reel auth-showcase__reel--right"></div>
      <div class="auth-showcase__controls">
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="auth-showcase__person">
      <div class="auth-showcase__hood"></div>
      <div class="auth-showcase__body"></div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AuthShowcase',
};
</script>

<style scoped>
.auth-showcase {
  position: relative;
  min-height: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, #68256e 0%, #ac144f 48%, #e10f37 100%);
}

.auth-showcase__pattern {
  position: absolute;
  width: 360px;
  height: 360px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
}

.auth-showcase__pattern::before,
.auth-showcase__pattern::after {
  content: '';
  position: absolute;
  inset: 18px;
  border: 2px solid rgba(255, 255, 255, 0.28);
  border-radius: inherit;
}

.auth-showcase__pattern::after {
  inset: 36px;
}

.auth-showcase__pattern--top {
  top: -160px;
  left: -160px;
}

.auth-showcase__pattern--bottom {
  right: -160px;
  bottom: -180px;
}

.auth-showcase__spark {
  position: absolute;
  left: -26px;
  top: 180px;
  width: 180px;
  height: 110px;
  clip-path: polygon(0 50%, 100% 0, 82% 50%, 100% 100%);
  background:
    radial-gradient(circle at 25% 50%, rgba(255, 255, 255, 0.92), transparent 18%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(255, 0, 83, 0.35));
  filter: drop-shadow(0 8px 18px rgba(255, 255, 255, 0.25));
}

.auth-showcase__device {
  position: absolute;
  left: 50%;
  top: 34%;
  width: 250px;
  height: 170px;
  border-radius: 12px;
  transform: translate(-50%, -50%);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent),
    linear-gradient(145deg, #312d30, #121214);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
}

.auth-showcase__device::before {
  content: '';
  position: absolute;
  inset: 16px 20px 48px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
}

.auth-showcase__reel {
  position: absolute;
  top: 28px;
  left: 42px;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background:
    radial-gradient(circle, #877b72 0 20%, #352f2c 21% 36%, #a68f79 37% 58%, #221f20 59% 100%);
}

.auth-showcase__reel--right {
  left: auto;
  right: 42px;
}

.auth-showcase__controls {
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: 22px;
  display: flex;
  justify-content: space-between;
}

.auth-showcase__controls span {
  display: block;
  width: 78px;
  height: 42px;
  border-radius: 10px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.22), transparent 10%),
    linear-gradient(145deg, #d2d5d9, #93969b);
}

.auth-showcase__person {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 310px;
  height: 330px;
  transform: translateX(-50%);
}

.auth-showcase__hood {
  position: absolute;
  left: 50%;
  top: 88px;
  width: 188px;
  height: 180px;
  border-radius: 50% 50% 42% 42%;
  transform: translateX(-50%);
  background: linear-gradient(180deg, #dfdee3, #bfc6cd);
}

.auth-showcase__body {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 262px;
  height: 220px;
  border-radius: 24px 24px 0 0;
  transform: translateX(-50%);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.14), transparent),
    linear-gradient(145deg, #ced4da, #9ca3af);
}

@media (max-width: 980px) {
  .auth-showcase {
    display: none;
  }
}
</style>

