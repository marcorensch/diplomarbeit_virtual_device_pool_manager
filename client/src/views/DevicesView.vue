<template>
  <div class="devices-view">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  name: "DevicesView",
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
};
</script>
