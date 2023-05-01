<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-header">
      <h3>Logout Everywhere</h3>
    </div>
    <div class="uk-card-body">
      Using this feature will log you out of all devices. You will need to log
      back in on each device.
    </div>
    <div class="uk-card-footer">
      <button
        class="uk-button uk-button-secondary uk-width-1-1"
        @click="auth.logoutEveryhere"
      >
        Logout Everywhere
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
export default {
  name: "LogoutEverywhereWidget",
  data() {
    return {
      auth: useAuthStore(),
    };
  },
};
</script>

<style scoped></style>
