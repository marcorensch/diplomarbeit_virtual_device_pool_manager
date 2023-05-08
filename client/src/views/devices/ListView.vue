<template>
  <div
    class="uk-section uk-section-small devices-list-view"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container">
      <h1>Pool Devices</h1>
      <div
        class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
      >
        <div class="uk-flex uk-flex-right">
          <div v-if="authStore.hasPermission('canCreateDevices')">
            <router-link
              :to="{ name: 'create-device' }"
              class="uk-button uk-button-primary uk-flex uk-flex-middle"
            >
              <div>
                <font-awesome-icon :icon="['fas', 'plus']" /> Add Device
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
import { useToast } from "vue-toastification";
import axios from "axios";

const toast = useToast();

export default {
  name: "ListView",
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  mounted() {
    this.getDevices(20, 0);
  },
  methods: {
    getDevices(limit, offset) {
      if (!limit) {
        limit = 20;
      }
      if (!offset) {
        offset = 0;
      }
      axios
        .get("/api/devices?limit=" + limit + "&offset=" + offset)
        .then((response) => {
          this.devices = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error getting devices");
        });
    },
  },
};
</script>

<style scoped></style>
