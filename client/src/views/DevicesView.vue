<template>
  <div class="devices-view">
    <img alt="Vue logo" src="../assets/logo.png" />
    <router-view />
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
