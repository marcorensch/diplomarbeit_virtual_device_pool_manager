<template>
  <NavigationBar />
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
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

.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.slide-bottom-enter-from,
.slide-bottom-leave-to {
  opacity: 0;
  transform: translateY(30%);
}
</style>
