<template>
  <div
    class="uk-section uk-section-small device-config-view uk-position-relative"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container nxd-padding-xlarge-bottom">
      <h1 v-if="!manufacturerEditStore.manufacturer.id">Add Manufacturer</h1>
      <h1 v-else>Edit {{ manufacturerEditStore.manufacturer.name }}</h1>
      <div class="uk-position-relative" uk-grid="masonry=true">
        <div class="uk-width-1-1 uk-width-1-3@m uk-flex-last@m">
          <ImageWidget />
          <NotesWidget class="uk-visible@m" />
        </div>
        <div class="uk-width-1-1 uk-width-2-3@m"></div>
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
import { useManufacturerEditStore } from "@/stores/manufacturerEdit";
import Manufacturer from "@/models/Manufacturer";
import ImageWidget from "@/components/devices/configform/ImageWidget.vue";
import NotesWidget from "@/components/devices/configform/NotesWidget.vue";
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";

export default {
  name: "ManufacturerConfigView",
  components: { NotesWidget, ImageWidget, ControlsFooterWidget },
  data() {
    return {
      manufacturerEditStore: useManufacturerEditStore(),
      manufacturer: new Manufacturer(),
    };
  },
  mounted() {
    this.device = this.manufacturerEditStore.get;
  },
  methods: {
    handleCancelClicked() {
      console.log("cancel clicked");
      this.$router.push({ name: "manufacturers" });
    },
    handleSaveClicked() {
      this.manufacturerEditStore.save();
    },
  },
};
</script>
