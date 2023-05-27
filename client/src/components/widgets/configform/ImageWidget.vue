<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-body uk-position-relative uk-padding-remove-bottom">
      <h3 class="uk-card-title">{{ title }}</h3>
      <div
        class="uk-position-relative device-image-container-outter uk-padding-remove-vertical"
        v-if="image"
      >
        <div class="configurator-main-image-container uk-border-rounded">
          <img :src="image" :title="title" class="uk-animation-fade" />
        </div>

        <div class="uk-position-top-right">
          <div
            id="delete-image"
            class="uk-padding-small uk-overlay uk-overlay-primary uk-border-rounded uk-animation-fade"
            @click="handleImageRemoved"
            uk-tooltip="title: Remove Image; pos: bottom-right"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </div>
        </div>
      </div>
    </div>
    <div class="uk-card-footer">
      <button
        class="uk-button uk-button-small uk-button-secondary uk-width-1-1"
        @click="handleOpenFileManagerModal"
      >
        Select
      </button>
    </div>
    <div id="image-manager-modal" class="uk-modal-container" uk-modal>
      <div class="uk-modal-dialog">
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">Select {{ title }}</h2>
        </div>
        <div class="uk-modal-body uk-padding-remove">
          <div>
            <FileManager
              :id="'image-manager'"
              :updateTriggerCounter="updateTriggerCounter"
              :baseDir="baseDir"
              @file-selected="handleFileSelected"
              :allowedFiletypes="'image/jpeg, image/png, image/gif, image/webp'"
            />
          </div>
        </div>
        <div class="uk-modal-footer">
          <div
            class="uk-child-width-1-1 uk-child-width-auto@s uk-grid-small uk-flex-right@s"
            uk-grid
          >
            <div>
              <button
                class="uk-width-1-1 uk-button uk-button-secondary uk-modal-close"
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                class="uk-width-1-1 uk-button uk-button-primary uk-modal-close"
                :class="{ 'uk-disabled': !this.selectedFile }"
                @click="handleImageChanged"
              >
                Select
              </button>
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "ImageWidget",
  components: {
    FontAwesomeIcon,
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
    baseDir: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      updateTriggerCounter: 0,
      selectedFile: null,
    };
  },
  methods: {
    handleImageChanged() {
      this.$emit("image-changed", this.selectedFile.fullPath);
    },
    handleOpenFileManagerModal() {
      this.updateTriggerCounter++;
      UIkit.modal("#image-manager-modal").show();
    },
    handleFileSelected(selectedFile) {
      this.selectedFile = selectedFile;
    },
    handleImageRemoved() {
      console.log("handleImageRemoved");
      this.$emit("image-changed", "");
    },
  },
};
</script>

<style lang="less" scoped>
.uk-card-body {
  min-height: 230px;
}
#delete-image {
  cursor: pointer;
}

.configurator-main-image-container {
  display: block;
  position: relative;
  text-align: center;
}
</style>
