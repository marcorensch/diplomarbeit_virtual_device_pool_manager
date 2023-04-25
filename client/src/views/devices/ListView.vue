<template>
  <div class="devices-list-view">
    <h1>Pool Devices</h1>
    <div
      class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
    >
      <div class="uk-flex uk-flex-right">
        <div v-if="authStore.hasPermission('canCreateDevices')">
          <router-link
            :to="{ name: 'create-device' }"
            class="uk-button uk-button-primary"
          >
            <font-awesome-icon :icon="['fas', 'plus']" /> Add Device
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  name: "ListView",
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
};
</script>

<style scoped></style>
