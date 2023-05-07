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
          <ImageWidget
            :title="'Image'"
            :image="deviceEditStore.device.image"
            :baseDir="'images'"
            @image-changed="handleImageChanged"
          />
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
    <ControlsFooterWidget
      @cancel="handleCancelClicked"
      @save="handleSaveClicked"
    />
  </div>
</template>

<script>
import { useDeviceEditStore } from "@/stores/deviceEdit";
import BasicsWidget from "@/components/widgets/configform/BasicsWidget.vue";
import Device from "@/models/Device.mjs";
import ImageWidget from "@/components/widgets/configform/ImageWidget.vue";
import NotesWidget from "@/components/widgets/configform/NotesWidget.vue";
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";

export default {
  name: "DeviceConfigView",
  components: { NotesWidget, ImageWidget, BasicsWidget, ControlsFooterWidget },
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
    handleImageChanged(imageRelativePath) {
      let path = imageRelativePath.length ? "/public/" + imageRelativePath : "";
      this.deviceEditStore.device.image = path;
    },
    handleCancelClicked() {
      this.$router.push({ name: "widgets" });
    },
    handleSaveClicked() {
      this.deviceEditStore.saveDevice();
    },
  },
};
</script>
