<template>
  <div>
    <h1>Settings</h1>
    <h2 v-if="auth.user?.firstname">Hi {{ auth.user.firstname }}</h2>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  name: "UserSettingsView",
  data() {
    return {
      auth: useAuthStore(),
    };
  },
};
</script>

<style scoped></style>
