<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-body uk-position-relative uk-padding-remove-bottom">
      <h3 class="uk-card-title">{{ title }}</h3>
      <div
        class="uk-position-relative device-image-container-outter uk-padding-remove-vertical"
        v-if="image.length"
      >
        <div class="device-image-container uk-border-rounded">
          <img :src="image" :title="title" uk-cover class="uk-animation-fade" />
        </div>

        <div class="uk-position-top-right">
          <div
            id="delete-image"
            class="uk-padding-small uk-overlay uk-overlay-primary uk-border-rounded uk-animation-fade"
            @click="handleImageRemoved"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </div>
        </div>
      </div>
    </div>
    <div class="uk-card-footer">
      <button
        class="uk-button uk-button-small uk-button-primary uk-width-1-1"
        @click="handleOpenFileManagerModal"
      >
        Select
      </button>
    </div>
    <div id="file-manager-modal" class="uk-modal-container" uk-modal>
      <div class="uk-modal-dialog">
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">Select Logo</h2>
        </div>
        <div class="uk-modal-body uk-padding-remove">
          <div>
            <FileManager
              :updateTriggerCounter="updateTriggerCounter"
              :baseDir="'logos'"
              @file-selected="handleFileSelected"
              :allowedExtensions="['jpg', 'jpeg', 'png', 'gif']"
            />
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
              <button
                class="uk-button uk-button-primary uk-modal-close"
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
    basedir: {
      type: String,
      default: "/",
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
      UIkit.modal("#file-manager-modal").show();
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

.device-image-container-outter {
}
.device-image-container {
  display: block;
  position: relative;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.02),
    rgba(0, 0, 0, 0.05),
    rgba(0, 0, 0, 0.02)
  );
  background-size: 200% 200%;
  padding-bottom: 100%;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  animation: gradient 1s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
