<template>
  <div
    class="uk-section uk-section-small device-config-view uk-position-relative"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container nxd-padding-xlarge-bottom">
      <h1 v-if="!deviceEditStore.device.id">Add Device</h1>
      <h1 v-else>Edit {{ deviceEditStore.device.name }}</h1>
      <div class="uk-position-relative" uk-grid="masonry=true">
        <div class="uk-width-1-1 uk-width-1-3@m uk-flex-last@m">
          <ImageWidget />
          <NotesWidget class="uk-visible@m" />
        </div>
        <div class="uk-width-1-1 uk-width-2-3@m">
          <BasicsWidget />
        </div>
        <div class="uk-width-1-1 uk-hidden@m">
          <NotesWidget />
        </div>
      </div>
    </div>
    <div class="uk-position-fixed uk-position-bottom uk-position-z-index">
      <div
        class="nxd-background-horizon uk-padding uk-grid-small uk-child-width-1-1 uk-child-width-auto@m uk-flex-right uk-animation-slide-bottom"
        uk-grid
      >
        <div>
          <button
            class="uk-button uk-button-secondary uk-width-1-1"
            @click="handleCancelClicked"
          >
            Cancel
          </button>
        </div>
        <div>
          <button
            class="uk-button uk-button-primary uk-width-1-1"
            @click="handleSaveClicked"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDeviceEditStore } from "@/stores/deviceEdit";
import BasicsWidget from "@/components/devices/configform/BasicsWidget.vue";
import Device from "@/models/Device.mjs";
import ImageWidget from "@/components/devices/configform/ImageWidget.vue";
import NotesWidget from "@/components/devices/configform/NotesWidget.vue";

export default {
  name: "DeviceConfigView",
  components: { NotesWidget, ImageWidget, BasicsWidget },
  data() {
    return {
      deviceEditStore: useDeviceEditStore(),
      device: new Device(),
    };
  },
  mounted() {
    this.device = this.deviceEditStore.getDevice;
  },
  methods: {
    handleCancelClicked() {
      this.$router.push({ name: "devices" });
    },
    handleSaveClicked() {
      this.deviceEditStore.saveDevice();
    },
  },
};
</script>
