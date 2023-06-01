<template>
  <div class="uk-section user-list-view uk-padding-remove">
    <div class="uk-container nxd-padding-xlarge-bottom">
      <h1>Configure Slides</h1>

      <div class="uk-margin">
        <div v-if="!slides.length">
          <div id="slides-container-placeholder" class="uk-position-relative">
            <div class="uk-text-center uk-height-medium">
              <div class="uk-position-center">
                <div class="uk-text-large uk-text-muted">
                  Oh... there are no slides yet.<br />
                  <a href="#" @click="handleAddSlideClicked">Add first slide</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="uk-position-relative"
          id="slides"
          :class="{ 'uk-hidden': !slides.length }"
          uk-sortable
        >
          <div v-for="(slide, index) of slides" :key="slide.id" :id="slide.id">
            <div class="">
              <div
                class="uk-margin-small-top uk-card uk-card-default uk-card-body"
              >
                {{ index }}
                {{ slide }}
              </div>
            </div>
          </div>
        </div>
        <div class="uk-margin-small" :class="{ 'uk-hidden': !slides.length }">
          <div
            class="uk-card uk-card-body nx-card-add uk-card-hover uk-flex uk-flex-center"
            @click="handleAddSlideClicked"
          >
            <div class="uk-text-large uk-width-auto">
              <font-awesome-icon :icon="['fas', 'plus']" />
              <span class="uk-text-large uk-margin-small-left"
                >Create Slide</span
              >
            </div>
          </div>
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
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import GuideMeSlideItem from "@/models/GuideMeSlideItem.mjs";
import UIkit from "uikit";
import axios from "axios";

export default {
  name: "SlidesManagerView",
  components: { FontAwesomeIcon, ControlsFooterWidget },
  data() {
    return {
      id: this.$route.params.id,
      slides: [],
    };
  },
  async mounted() {
    await this.loadSlides();
    UIkit.util.on("#slides", "moved", (e, sortable) => {
      for (let i = 0; i < sortable.items.length; i++) {
        const id = sortable.items[i].id;
        const slide = this.slides.find(
          (slide) => parseInt(slide.id) === parseInt(id)
        );
        if (!slide) continue;
        if (slide.sorting !== i + 1) {
          slide.sorting = i + 1;
          this.updateSlide(slide);
        }
      }
    });
  },
  methods: {
    registerEvents() {},
    async loadSlides() {
      try {
        const response = await axios.get(`/api/admin/guides/${this.id}/slides`);
        this.slides = response.data.slides;
      } catch (err) {
        console.log(err);
      }
    },
    handleCancelClicked() {
      this.$router.push({ name: "guides" });
    },
    handleSaveClicked() {
      this.$router.push({ name: "guides" });
    },
    async handleAddSlideClicked() {
      const slide = new GuideMeSlideItem();
      slide.guide_id = this.id;
      slide.name = `Slide ${this.slides.length + 1}`;
      try {
        const response = await axios.post(
          `/api/admin/guides/${this.id}/slides`,
          slide
        );
        slide.id = response.data.id;
        this.slides.push(slide);
      } catch (err) {
        this.toast.error("Failed to create new slide");
        console.log(err);
      }
    },
    updateSlide(slide) {
      try {
        axios.put(`/api/admin/guides/${this.id}/slides/${slide.id}`, slide);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/less/components/guidememanager.less";
</style>
