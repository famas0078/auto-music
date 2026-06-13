<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="checkout-modal" @click.self="$emit('close')">
        <div class="checkout-modal__panel">
          <button class="checkout-modal__close" type="button" @click="$emit('close')">×</button>

          <div class="checkout-modal__head">
            <span class="checkout-modal__eyebrow">Оформление заказа</span>
            <h2>Давайте завершим покупку</h2>
            <p>Оставьте контакты, и мы уточним доставку, установку и удобное время.</p>
          </div>

          <form class="checkout-form" @submit.prevent="submit">
            <label>
              <span>Имя</span>
              <input v-model.trim="form.name" type="text" placeholder="Ваше имя" required />
            </label>

            <label>
              <span>Телефон</span>
              <input v-model.trim="form.phone" type="tel" placeholder="+7 (999) 123 45 67" required />
            </label>

            <label>
              <span>Email</span>
              <input v-model.trim="form.email" type="email" placeholder="mail@example.com" required />
            </label>

            <label class="checkout-form__wide">
              <span>Комментарий</span>
              <textarea
                v-model.trim="form.comment"
                rows="4"
                placeholder="Например: нужна установка в субботу после 14:00"
              ></textarea>
            </label>

            <div class="checkout-form__summary">
              <div>
                <small>Позиций</small>
                <strong>{{ itemCount }}</strong>
              </div>
              <div>
                <small>Сумма</small>
                <strong>{{ formattedTotal }}</strong>
              </div>
            </div>

            <div class="checkout-form__actions">
              <button class="checkout-form__ghost" type="button" @click="$emit('close')">Вернуться</button>
              <button class="base-button" type="submit" :disabled="submitting">
                {{ submitting ? 'Отправляем...' : 'Оформить заказ' }}
              </button>
            </div>

            <p v-if="message" class="checkout-form__message">{{ message }}</p>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'CheckoutModal',
  emits: ['close', 'submit'],
  props: {
    initialValues: {
      type: Object,
      default: () => ({
        email: '',
        name: '',
        phone: '',
      }),
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      default: '',
    },
    open: {
      type: Boolean,
      default: false,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        name: '',
        phone: '',
        email: '',
        comment: '',
      },
    };
  },
  computed: {
    formattedTotal() {
      return new Intl.NumberFormat('ru-RU').format(this.total) + ' ₽';
    },
  },
  watch: {
    initialValues: {
      deep: true,
      handler() {
        if (this.open) {
          this.applyInitialValues();
        }
      },
    },
    open(value) {
      if (value) {
        this.applyInitialValues();
      }
    },
  },
  methods: {
    applyInitialValues() {
      this.form = {
        name: this.initialValues.name || '',
        phone: this.initialValues.phone || '',
        email: this.initialValues.email || '',
        comment: '',
      };
    },
    submit() {
      this.$emit('submit', { ...this.form });
    },
  },
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.checkout-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(24, 20, 29, 0.52);
  backdrop-filter: blur(10px);
}

.checkout-modal__panel {
  position: relative;
  width: min(760px, 100%);
  padding: 34px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 30px 60px rgba(36, 16, 40, 0.24);
}

.checkout-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: #f4f1f6;
  color: #454a57;
  font-size: 22px;
  cursor: pointer;
}

.checkout-modal__eyebrow {
  color: var(--brand-red);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.checkout-modal__head h2 {
  margin: 14px 0 10px;
  font-size: 34px;
  line-height: 1.02;
}

.checkout-modal__head p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.6;
}

.checkout-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.checkout-form label {
  display: grid;
  gap: 8px;
}

.checkout-form span {
  color: #555a69;
  font-size: 14px;
}

.checkout-form input,
.checkout-form textarea {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #d7dce5;
  border-radius: 22px;
  outline: none;
  resize: vertical;
}

.checkout-form__wide,
.checkout-form__summary,
.checkout-form__actions,
.checkout-form__message {
  grid-column: 1 / -1;
}

.checkout-form__summary {
  display: flex;
  justify-content: space-between;
  padding: 18px 20px;
  border-radius: 22px;
  background: #f6f3f8;
}

.checkout-form__summary small {
  display: block;
  margin-bottom: 6px;
  color: var(--text-soft);
}

.checkout-form__summary strong {
  font-size: 20px;
}

.checkout-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.checkout-form__ghost {
  min-height: 45px;
  padding: 0 22px;
  border: 1px solid #dbdce2;
  border-radius: 22px;
  background: #fff;
  cursor: pointer;
}

.checkout-form__message {
  margin: 0;
  color: var(--brand-red);
}

@media (max-width: 720px) {
  .checkout-modal__panel {
    padding: 28px 18px;
  }

  .checkout-form {
    grid-template-columns: 1fr;
  }

  .checkout-form__actions {
    flex-direction: column-reverse;
  }

  .checkout-form__actions button {
    width: 100%;
  }
}
</style>
