<template>
  <NavigationBar />
  <div class="uk-section uk-section-small">
    <div class="uk-container">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script>
import { useAuthStore } from "@/stores/auth";
import NavigationBar from "@/components/NavigationBar.vue";
export default {
  name: "App",
  components: { NavigationBar },
  data() {
    return {
      auth: useAuthStore(),
    };
  },
  mounted() {
    this.auth.checkAuth();
  },
};
</script>
<style lang="less">
@import "../node_modules/uikit/src/less/uikit.less";
@import "@/assets/less/main.less";
</style>
