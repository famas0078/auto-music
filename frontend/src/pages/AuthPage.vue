<template>
  <section class="auth-screen">
    <div class="auth-screen__media">
      <img src="../assets/image-music.png" alt="Автозвук" class="auth-screen__image" />
    </div>

    <div class="auth-screen__content">
      <div class="auth-card">
        <div class="auth-card__surface">
          <div class="auth-card__viewport">
            <div class="auth-card__slider" :style="sliderStyle">
              <section class="auth-pane">
                <h1>Войдите</h1>
                <div class="auth-tabs">
                  <button
                    type="button"
                    class="auth-tabs__item"
                    :class="{ 'auth-tabs__item--active': activeTab === 'login' }"
                    @click="switchTab('login')"
                  >
                    Вход
                  </button>
                  <button
                    type="button"
                    class="auth-tabs__item"
                    :class="{ 'auth-tabs__item--active': activeTab === 'register' }"
                    @click="switchTab('register')"
                  >
                    Регистрация
                  </button>
                </div>

                <form class="auth-form" @submit.prevent="submitLogin">
                  <label>
                    <span>Введите Email</span>
                    <input v-model.trim="loginForm.email" type="email" placeholder="you@example.com" required />
                  </label>

                  <label>
                    <span>Введите пароль</span>
                    <input v-model.trim="loginForm.password" type="password" placeholder="Пароль" required />
                  </label>

                  <button class="auth-form__link" type="button">Забыли пароль? Восстановить</button>

                  <BaseButton type="submit" :disabled="loginSubmitting">Войти</BaseButton>
                </form>

                <p v-if="loginMessage" class="auth-card__message">{{ loginMessage }}</p>
              </section>

              <section class="auth-pane auth-pane--register">
                <h1>Зарегистрируйтесь</h1>
                <div class="auth-tabs">
                  <button
                    type="button"
                    class="auth-tabs__item"
                    :class="{ 'auth-tabs__item--active': activeTab === 'login' }"
                    @click="switchTab('login')"
                  >
                    Вход
                  </button>
                  <button
                    type="button"
                    class="auth-tabs__item"
                    :class="{ 'auth-tabs__item--active': activeTab === 'register' }"
                    @click="switchTab('register')"
                  >
                    Регистрация
                  </button>
                </div>

                <form class="auth-form auth-form--register" @submit.prevent="submitRegister">
                  <label>
                    <span>Введите имя</span>
                    <input v-model.trim="registerForm.name" type="text" placeholder="Имя" required />
                  </label>

                  <label>
                    <span>Введите номер телефона</span>
                    <input v-model.trim="registerForm.phone" type="tel" placeholder="+7 (999) 888 98 98" required />
                  </label>

                  <label>
                    <span>Введите Email</span>
                    <input v-model.trim="registerForm.email" type="email" placeholder="Email" required />
                  </label>

                  <label>
                    <span>Придумайте пароль</span>
                    <input v-model.trim="registerForm.password" type="password" placeholder="Пароль" required />
                  </label>

                  <label>
                    <span>Повторите пароль</span>
                    <input
                      v-model.trim="registerForm.confirmPassword"
                      type="password"
                      placeholder="Пароль"
                      required
                    />
                  </label>

                  <button class="auth-form__link" type="button">Забыли пароль? Восстановить</button>

                  <BaseButton type="submit" :disabled="registerSubmitting">Зарегистрироваться</BaseButton>
                </form>

                <p v-if="registerMessage" class="auth-card__message">{{ registerMessage }}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from '../components/shared/BaseButton.vue';
import { api } from '../services/api';
import { authStore } from '../stores/auth';

export default {
  name: 'AuthPage',
  components: {
    BaseButton,
  },
  props: {
    initialTab: {
      type: String,
      default: 'login',
    },
  },
  data() {
    return {
      activeTab: this.initialTab,
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        name: '',
        phone: '+7 (999) 888 98 98',
        email: '',
        password: '',
        confirmPassword: '',
      },
      loginSubmitting: false,
      registerSubmitting: false,
      loginMessage: '',
      registerMessage: '',
    };
  },
  computed: {
    sliderStyle() {
      return {
        transform: this.activeTab === 'login' ? 'translateX(0%)' : 'translateX(-50%)',
      };
    },
    redirectPath() {
      return typeof this.$route.query.redirect === 'string' ? this.$route.query.redirect : '/';
    },
  },
  watch: {
    initialTab(value) {
      this.activeTab = value;
    },
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
      const target = tab === 'login' ? '/login' : '/register';

      if (this.$route.path !== target) {
        this.$router.replace({
          path: target,
          query: this.$route.query,
        });
      }
    },
    async submitLogin() {
      this.loginSubmitting = true;
      this.loginMessage = '';

      try {
        const response = await api.login(this.loginForm);
        authStore.setSession(response);
        this.loginMessage = `${response.message}. Добро пожаловать, ${response.user.name}.`;
        await this.$router.replace(this.redirectPath);
      } catch (error) {
        this.loginMessage = error.message;
      } finally {
        this.loginSubmitting = false;
      }
    },
    async submitRegister() {
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.registerMessage = 'Пароли не совпадают.';
        return;
      }

      this.registerSubmitting = true;
      this.registerMessage = '';

      try {
        const response = await api.register(this.registerForm);
        authStore.setSession(response);
        this.registerMessage = `${response.message}. Аккаунт ${response.user.email} готов к работе.`;
        await this.$router.replace(this.redirectPath);
      } catch (error) {
        this.registerMessage = error.message;
      } finally {
        this.registerSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background: #f7f5f8;
}

.auth-screen__media {
  flex: 1 1 auto;
  max-width: 60%;
  display: flex;
  align-items: stretch;
  justify-content: start;
  overflow: hidden;
  background: linear-gradient(180deg, #68256e 0%, #ad1451 55%, #e3103c 100%);
}

.auth-screen__image {
  max-width: 100%;
  height: 100%;
  object-fit: cover;
}

.auth-screen__content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 28px;
  max-width: 100svw;
}

.auth-card {
  width: min(464px, 100%);
}

.auth-card__surface {
  padding: 34px 34px 30px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 24px 54px rgba(77, 31, 73, 0.12);
}

.auth-card__viewport {
  overflow: hidden;
}

.auth-card__slider {
  display: flex;
  width: 200%;
  transition: transform 0.45s ease;
}

.auth-pane {
  width: 50%;
  padding: 0 10px;
}

.auth-pane h1 {
  margin: 0 0 28px;
  color: #232838;
  font-size: 44px;
  line-height: 1;
  text-align: center;
}

.auth-pane--register h1 {
  font-size: 36px;
}

.auth-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: end;
  margin-bottom: 26px;
  border-bottom: 1px solid #d8d8de;
}

.auth-tabs__item {
  padding: 0 0 12px;
  border: none;
  background: transparent;
  color: #2f3340;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  border-bottom: 1px solid transparent;
}

.auth-tabs__item--active {
  color: var(--brand-red);
  border-color: var(--brand-red);
}

.auth-form {
  display: grid;
  gap: 18px;
}

.auth-form--register {
  gap: 14px;
}

.auth-form label {
  display: grid;
  gap: 6px;
}

.auth-form span {
  color: #555a69;
  font-size: 14px;
}

.auth-form input {
  height: 42px;
  padding: 0 18px;
  border: 1px solid #d9dbe2;
  border-radius: 22px;
  background: #ffffff;
  outline: none;
}

.auth-form input::placeholder {
  color: #b5b8c3;
}

.auth-form__link {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--brand-red);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.auth-card__message {
  margin: 14px 0 0;
  color: #555a69;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 1180px) {
  .auth-screen {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-screen__media {
    display: none;
  }
}

@media (max-width: 640px) {
  .auth-screen__content {
    padding: 24px 14px 32px;
  }

  .auth-card__surface {
    padding: 24px 18px 22px;
    border-radius: 24px;
  }

  .auth-pane {
    padding: 0 4px;
  }

  .auth-pane h1,
  .auth-pane--register h1 {
    font-size: 34px;
    margin-bottom: 24px;
  }
}
</style>
