<template>
  <div
    class="uk-section user-list-view uk-padding-remove"
    v-if="guide && slide"
  >
    <div class="uk-container">
      <div class="uk-grid-small uk-flex uk-flex-middle" uk-grid>
        <div>
          <router-link
            class="go-back-link"
            :to="{ name: 'admin-guide-slides', params: { id: guide.id } }"
          >
            <font-awesome-icon
              class="uk-h2 uk-preserve-width uk-margin-remove"
              :icon="['fas', 'arrow-left']"
            />
          </router-link>
        </div>
        <div>
          <h2 v-if="guide" class="uk-h3 uk-margin-remove">{{ guide.name }}</h2>
          <h3 class="uk-h2 uk-margin-remove">Edit Slide {{ slide.name }}</h3>
        </div>
      </div>

      <div class="uk-margin">
        <div
          id="stage-container"
          uk-height-viewport="expand:true"
          class="uk-position-relative"
          style="background: transparent"
        >
          <div class="uk-position-cover">
            <img :src="'/public' + slide.uri" alt="Slide Image" />
          </div>
          <div class="uk-position-top-right uk-box-shadow-large nxd-no-select">
            <div class="uk-card uk-card-default uk-card-small uk-width-medium">
              <div
                class="uk-padding-small uk-position-relative nxd-cursor-pointer"
                @click="showControls = !showControls"
              >
                <h4 class="uk-h4 uk-margin-remove-bottom">Controls</h4>
                <div class="uk-position-center-right uk-margin-right">
                  <font-awesome-icon
                    v-if="!showControls"
                    :icon="['fas', 'chevron-down']"
                  />
                  <font-awesome-icon v-else :icon="['fas', 'chevron-up']" />
                </div>
              </div>
              <div id="stage-controls" :class="{ 'uk-hidden': !showControls }">
                <div class="uk-card-body">
                  <ul uk-accordion="multiple: true; active:0">
                    <li>
                      <a class="uk-accordion-title" href="#">Image</a>
                      <div class="uk-accordion-content uk-flex uk-flex-right">
                        <button
                          class="uk-button uk-button-secondary uk-button-small"
                          uk-toggle="target: #filemanager-modal"
                        >
                          {{ slide.uri ? "Change" : "Select" }} Image
                        </button>
                      </div>
                    </li>
                    <li>
                      <a class="uk-accordion-title" href="#">Elements</a>
                      <div class="uk-accordion-content">
                        <div id="sliderVisualElements">
                          <div
                            class="uk-margin-small-top"
                            v-for="(el, index) of elements"
                            :key="index"
                          >
                            {{ el.name }}
                          </div>
                        </div>
                        <div class="uk-margin-small-top uk-flex uk-flex-right">
                          <button
                            class="uk-button uk-button-small uk-button-secondary"
                            @click="handleAddVisualElementClicked"
                          >
                            Add Element
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="uk-card-footer">
                  <div class="uk-grid-small uk-flex uk-flex-right" uk-grid>
                    <div>
                      <button
                        class="uk-button uk-button-secondary uk-button-small"
                        style="min-width: 100px"
                        @click="
                          this.$router.push({
                            name: 'admin-guide-slides',
                            params: { id: guide.id },
                          })
                        "
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        class="uk-button uk-button-primary uk-button-small"
                        style="min-width: 100px"
                        @click="saveSlide"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="filemanager-modal" class="uk-flex-top uk-modal-container" uk-modal>
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button class="uk-modal-close-default" uk-close type="button"></button>
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">Select Image</h2>
        </div>
        <div class="uk-modal-body uk-padding-remove">
          <FileManager
            :updateTriggerCounter="updateTriggerCounter"
            :base-dir="'/guides'"
            @file-selected="handleFileSelected"
          />
        </div>
        <div class="uk-modal-footer">
          <div class="uk-grid-small uk-flex uk-flex-right" uk-grid>
            <div>
              <button class="uk-button uk-button-secondary uk-modal-close">
                Cancel
              </button>
            </div>
            <div>
              <button
                class="uk-button uk-button-primary uk-modal-close"
                :class="{ 'uk-disabled': !fm_file }"
                @click="handleImageSelected"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FileManager from "@/components/FileManager.vue";

class sliderVisualElement {
  constructor() {
    this.id = null;
    this.sorting = null;
    this.description = "";
    this.type = "";
    this.name = "Element";
  }
}

export default {
  name: "EditSlide",
  components: { FileManager, FontAwesomeIcon },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      guide: null,
      slide: null,
      showControls: true,
      elements: [],
      updateTriggerCounter: 0,
      fm_file: null,
    };
  },
  mounted() {
    if (!this.$route.params.id) {
      this.toast.error("Invalid Slide ID");
      this.$router.push({ name: "guides" });
    }
    if (!this.$route.query.gid) {
      this.toast.error("Invalid Guide ID");
      this.$router.push({ name: "guides" });
    }
    this.getGuide();
    this.getSlide();
  },
  methods: {
    handleImageSelected() {
      console.log("Image Selected");
      const path = this.fm_file.fullPath;
      this.slide.uri = path;
    },
    handleFileSelected(file) {
      this.fm_file = file;
    },
    handleAddVisualElementClicked() {
      this.elements.push(new sliderVisualElement());
    },
    handleSelectImageClicked() {
      console.log("Select Image Clicked");
    },
    async getGuide() {
      try {
        const result = await axios.get(
          `/api/admin/guides/${this.$route.query.gid}`
        );
        this.guide = result.data.guide;
        console.log(this.guide);
      } catch (err) {
        console.log(err);
      }
    },
    async getSlide() {
      try {
        const result = await axios.get(
          `/api/admin/guides/${this.$route.query.gid}/slides/${this.$route.params.id}`
        );
        this.slide = result.data.slide;
        console.log(this.slide);
      } catch (err) {
        console.log(err);
      }
    },
    async saveSlide() {
      try {
        await axios.put(
          `/api/admin/guides/${this.$route.query.gid}/slides/${this.$route.params.id}`,
          this.slide
        );
        this.$router.push({
          name: "admin-guide-slides",
          params: { id: this.$route.query.gid },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped></style>
