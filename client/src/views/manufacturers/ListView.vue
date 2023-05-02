<template>
  <div
    class="uk-section uk-section-small devices-list-view"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container">
      <h1>Manufacturers</h1>
      <div
        class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
      >
        <div class="uk-flex uk-flex-right">
          <div v-if="authStore.hasPermission('canCreateManufacturer')">
            <router-link
              :to="{ name: 'create-manufacturer' }"
              class="uk-button uk-button-primary uk-flex uk-flex-middle"
            >
              <div>
                <font-awesome-icon :icon="['fas', 'plus']" /> Add Manufacturer
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  name: "listView",
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
};
</script>

<style scoped></style>
