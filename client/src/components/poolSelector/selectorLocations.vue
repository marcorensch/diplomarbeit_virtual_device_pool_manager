<template>
  <h2>Select Location</h2>
  <template v-if="locations.length"
    ><div v-for="location in locations" :key="location.id" class="uk-margin">
      <div
        class="uk-card uk-card-default uk-card-body element-link"
        @click="handleLocationSelected(location)"
      >
        <div class="uk-grid-small uk-flex-middle" uk-grid>
          <div class="uk-width-expand">
            <h3 class="uk-card-title uk-text-truncate">
              <font-awesome-icon
                :icon="['fas', 'building']"
                class="uk-preserve-width"
              />
              {{ location.name }}
            </h3>
          </div>
          <div>
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </div>
        </div>
      </div></div
  ></template>
  <template v-else-if="!locations.length">
    <div class="uk-padding">
      <div class="uk-text-center uk-text-muted">
        <div class="uk-text-large">No Locations Found</div>
        <div v-if="authStore.hasPermission('canAccessPoolBuilder')">
          Note: You can manage Device Pools in the Admin area
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "selectorLocations",
  emits: ["locationSelected"],
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      locations: [],
    };
  },
  mounted() {
    this.getLocations();
  },
  methods: {
    async getLocations() {
      try {
        const response = await axios.get(
          "/api/devicepool/items?category=location"
        );
        this.locations = response.data;
      } catch (e) {
        console.log(e);
        this.locations = [];
      }
    },
    handleLocationSelected(location) {
      this.$emit("locationSelected", location);
    },
  },
};
</script>

<style scoped></style>
