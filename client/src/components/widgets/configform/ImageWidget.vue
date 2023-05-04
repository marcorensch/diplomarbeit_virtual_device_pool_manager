<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-body uk-position-relative uk-padding-bottom">
      <h3 class="uk-card-title">{{ title }}</h3>
      <div class="device-image-container" v-if="image">
        <img :alt="title" :src="image" />
      </div>
      <div class="uk-position-bottom uk-width-1-1 uk-padding">
        <button
          class="uk-button uk-button-small uk-button-primary uk-width-1-1"
          @click="handleOpenFileManagerModal"
        >
          Select
        </button>
      </div>
    </div>
    <div id="file-manager-modal" class="uk-modal-container" uk-modal>
      <div class="uk-modal-dialog">
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">Select Logo</h2>
        </div>
        <div class="uk-modal-body uk-padding-remove">
          <div>
            <FileManager :baseDir="'logos'" />
          </div>
        </div>
        <div class="uk-modal-footer">
          <div class="uk-grid-small uk-flex uk-flex-right@m">
            <div>
              <button class="uk-button uk-button-secondary uk-modal-close">
                Cancel
              </button>
            </div>
            <div>
              <button class="uk-button uk-button-primary">Select</button>
            </div>
          </div>
        </div>
        <button class="uk-modal-close-default" type="button" uk-close></button>
      </div>
    </div>
  </div>
</template>

<script>
import UIkit from "uikit";
import FileManager from "@/components/FileManager.vue";
export default {
  name: "ImageWidget",
  components: {
    FileManager,
  },
  emits: ["image-changed"],
  props: {
    title: {
      type: String,
      default: "Image",
    },
    image: {
      type: String,
      default: "",
    },
    basedir: {
      type: String,
      default: "/",
    },
  },
  data() {
    return {
      updateTriggerCounter: 0,
    };
  },
  methods: {
    handleImageChanged(selectedImageUri) {
      this.$emit("image-changed", selectedImageUri);
    },
    handleOpenFileManagerModal() {
      this.updateTriggerCounter++;
      UIkit.modal("#file-manager-modal").show();
    },
  },
};
</script>

<style scoped>
.uk-card-body {
  min-height: 230px;
}
</style>
