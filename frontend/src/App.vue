<template>
  <div class="app-shell">
    <AppHeader v-if="!$route.meta.hideHeader" />
    <main class="app-main" :class="{ 'app-main--bare': $route.meta.hideHeader }">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.meta.viewKey || route.matched[0]?.path || route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter v-if="!$route.meta.hideFooter" />
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeader,
    RouterView,
  },
};
</script>
