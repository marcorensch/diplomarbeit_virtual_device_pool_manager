<template>
  <div class="uk-grid-small" uk-grid>
    <div>
      <a href="#" class="go-back-link">
        <font-awesome-icon
          :icon="['fas', 'arrow-left']"
          class="uk-h2 uk-margin-remove"
          @click="this.$emit('showLocations')"
        />
      </a>
    </div>
    <div>
      <h5 class="uk-margin-remove">{{ selectedLocation.name }}</h5>
      <h4 class="uk-margin-remove">Select Cabinet</h4>
    </div>
  </div>
  <template v-if="cabinets">
    <div
      v-if="cabinets.length"
      uk-scrollspy="target: >div; cls: uk-animation-fade; delay:50; repeat:true;"
    >
      <div
        v-for="cabinet of cabinets"
        :key="cabinet.id"
        class="uk-margin-small"
      >
        <div
          class="uk-card uk-card-default uk-card-body uk-card-small element-link"
          @click="handleCabinetSelected(cabinet)"
        >
          <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-expand">
              <h3 class="uk-card-title uk-text-truncate">
                <font-awesome-icon
                  :icon="['fas', 'building']"
                  class="uk-preserve-width"
                />
                {{ cabinet.name }}
              </h3>
            </div>
            <div>
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="uk-padding">
        <div class="uk-text-center uk-text-muted">
          <div class="uk-text-large">No Cabinets Found</div>
          <div v-if="authStore.hasPermission('canAccessPoolBuilder')">
            Note: You can manage Device Pools in the Admin area
          </div>
        </div>
      </div>
    </template>
  </template>
  <template v-else>
    <div class="uk-text-center uk-height-large">
      <div uk-spinner="ratio: 3"></div>
      <div class="uk-margin-top uk-text-muted">Loading Cabinets</div>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "selectorCabinets",
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  emits: ["cabinetSelected", "showLocations"],
  props: {
    selectedLocation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cabinets: [],
    };
  },
  mounted() {
    this.getCabinets();
  },
  methods: {
    handleCabinetSelected(cabinet) {
      this.$emit("cabinetSelected", cabinet);
    },
    async getCabinets() {
      try {
        const response = await axios.get(
          `/api/devicepool/items?category=cabinet&location=${this.selectedLocation.id}`
        );
        this.cabinets = response.data;
      } catch (e) {
        console.log(e);
        this.cabinets = [];
      }
    },
  },
};
</script>

<style scoped></style>
