import { reactive } from 'vue';

const STORAGE_KEY = 'automusic-session';

const savedSession = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
const initialSession = savedSession ? JSON.parse(savedSession) : null;

const state = reactive({
  token: initialSession?.token || '',
  user: initialSession?.user || null,
});

function persist() {
  if (typeof window === 'undefined') {
    return;
  }

  if (state.user && state.token) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: state.token,
        user: state.user,
      }),
    );
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export const authStore = {
  state,
  get isAuthenticated() {
    return Boolean(state.user && state.token);
  },
  setSession(session) {
    state.user = session.user;
    state.token = session.token;
    persist();
  },
  logout() {
    state.user = null;
    state.token = '';
    persist();
  },
};
