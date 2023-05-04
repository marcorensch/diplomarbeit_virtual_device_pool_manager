<template>
  <div
    class="uk-section uk-section-small device-config-view uk-position-relative"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container nxd-padding-xlarge-bottom">
      <h1 v-if="!manufacturerEditStore.manufacturer.id">Add Manufacturer</h1>
      <h1 v-else>Edit {{ manufacturerEditStore.manufacturer.name }}</h1>
      <div
        class="uk-position-relative"
        uk-grid=""
        uk-height-match="target: .uk-card-body"
      >
        <div class="uk-width-1-1 uk-width-2-3@m">
          <div class="uk-card uk-card-default uk-card-body">
            <div class="uk-margin">
              <label for="name">Name</label>
              <input
                id="name"
                class="uk-input"
                type="text"
                v-model="manufacturerEditStore.manufacturer.name"
              />
            </div>
            <div>
              <label for="notes">Notes</label>
              <textarea
                id="notes"
                class="uk-textarea"
                v-model="manufacturerEditStore.manufacturer.notes"
              ></textarea>
            </div>
            <div class="uk-margin">
              <label for="hidden">Hidden Notes</label>
              <textarea
                id="hidden"
                class="uk-textarea"
                v-model="manufacturerEditStore.manufacturer.hidden"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="uk-width-1-1 uk-width-1-3@m uk-flex-last@m">
          <ImageWidget
            :title="'Logo'"
            :image="manufacturerEditStore.manufacturer.image"
            :baseDir="'/'"
            @image-changed="handleImageChanged"
          />
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
import ImageWidget from "@/components/widgets/configform/ImageWidget.vue";
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";

export default {
  name: "ManufacturerConfigView",
  components: { ImageWidget, ControlsFooterWidget },
  data() {
    return {
      manufacturerEditStore: useManufacturerEditStore(),
    };
  },
  async mounted() {
    await this.manufacturerEditStore.load(this.$route.params.id);
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
    handleImageChanged(imageUri) {
      console.log("image changed");
      this.manufacturerEditStore.manufacturer.image = imageUri;
    },
  },
};
</script>
