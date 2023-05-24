<template>
  <div
    id="device-pool-selector-modal"
    class="uk-flex-top uk-modal-container"
    uk-modal
  >
    <div class="uk-modal-dialog uk-margin-auto-vertical nxd-min-height-80vh">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <div class="uk-modal-header">Pool Location Selection</div>
      <div
        class="uk-modal-body"
        uk-scrollspy="target: >div; cls: uk-animation-fade; delay:50; repeat:true;"
      >
        <SelectorLocations
          v-if="!selectedLocation"
          ref="locations"
          @locationSelected="selectedLocation = $event"
        />
        <SelectorCabinets
          v-else-if="selectedLocation && !selectedCabinet"
          ref="cabinets"
          :selectedLocation="selectedLocation"
          @cabinetSelected="selectedCabinet = $event"
          @showLocations="selectedLocation = null"
        />
        <SelectorSlot
          v-else-if="selectedLocation && selectedCabinet"
          ref="slots"
          :selected-location="selectedLocation"
          :selectedCabinet="selectedCabinet"
          @slotSelected="handleSlotSelected($event)"
          @showCabinets="selectedCabinet = null"
        />
        <div v-else class="uk-margin-large-top">
          <div class="uk-text-center uk-height-large">
            <div uk-spinner="ratio: 3"></div>
            <div class="uk-margin-top uk-text-muted">Loading</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIkit from "uikit";
import { useAuthStore } from "@/stores/auth";
import SelectorLocations from "@/components/poolSelector/selectorLocations.vue";
import SelectorCabinets from "@/components/poolSelector/selectorCabinets.vue";
import SelectorSlot from "@/components/poolSelector/selectorSlot.vue";

export default {
  name: "PoolSelector",
  components: { SelectorSlot, SelectorCabinets, SelectorLocations },
  emits: ["selected"],
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      selectedCabinet: null,
      selectedLocation: null,
      modal: null,
    };
  },
  mounted() {
    this.registerEventListeners();
    this.modal = UIkit.modal("#device-pool-selector-modal");
  },
  methods: {
    registerEventListeners() {
      UIkit.util.on("#device-pool-selector-modal", "show", () => {
        this.$refs["locations"].getLocations();
      });
      UIkit.util.on("#device-pool-selector-modal", "hidden", () => {
        this.resetSelection();
      });
    },
    showModal() {
      this.modal.show();
    },

    resetSelection() {
      this.selectedLocation = null;
      this.selectedCabinet = null;
    },

    handleLocationSelected(location) {
      this.selectedLocation = location;
      this.getCabinets();
    },

    handleCabinetSelected(cabinet) {
      this.getCabinet(cabinet.id);
    },

    handleSlotSelected(slot) {
      this.$emit("selected", slot);
      this.modal.hide();
    },
  },
};
</script>

<style scoped></style>
