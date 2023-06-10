<template>
  <div class="uk-section user-list-view uk-padding-remove">
    <div class="uk-container nxd-padding-xlarge-bottom">
      <div class="uk-grid-small uk-flex uk-flex-middle" uk-grid>
        <div>
          <router-link :to="{ name: 'guides' }" class="go-back-link">
            <font-awesome-icon
              class="uk-h2 uk-preserve-width uk-margin-remove-bottom"
              :icon="['fas', 'arrow-left']"
            />
          </router-link>
        </div>
        <div>
          <h2 class="uk-h2 uk-margin-remove">{{ guide.name }} Slides</h2>
        </div>
      </div>

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
              <div class="uk-margin-small-top uk-card uk-card-default uk-card-body uk-position-relative">
                <div class="uk-position-top-left">
                  <div class="uk-padding-small">
                    <font-awesome-icon v-if="!slide.uri || !slide.uri.length" class="uk-text-danger uk-preserve-width uk-margin-small-right " :icon="['fas', 'exclamation-triangle']" />
                    <font-awesome-icon v-if="!slide.content || !slide.content.length" class="uk-text-warning uk-preserve-width" :icon="['fas', 'exclamation-triangle']" />
                  </div>
                </div>
                <div class="uk-flex uk-flex-middle uk-grid-small" uk-grid>
                  <div class="uk-width-expand">
                    <div>
                      <h4 class="uk-h3 uk-margin-remove">{{ slide.name }}</h4>
                    </div>
                    <div v-if="slide.content && slide.content.length">
                      <h6 class="uk-margin-small-top uk-margin-remove-bottom">Steps in this Slide:</h6>
                      <table class="uk-table uk-list-divider uk-margin-remove uk-table-middle uk-table-small">
                        <tr v-for="shape of slide.content">
                          <td class="uk-text-nowrap uk-table-shrink"><span class="uk-text-small">{{ shape.label }}: </span></td>
                          <td><span class="uk-text-muted uk-text-small">{{ shape.description || "no Description Text" }}</span></td>
                        </tr>
                      </table>

                    </div>
                  </div>
                  <div class="uk-width-small uk-flex uk-flex-right">
                    <font-awesome-icon :icon="['fas', 'chevron-right']" />
                  </div>
                </div>

                <router-link
                  :to="{
                    name: 'admin-guide-slide-edit',
                    params: { id: slide.id },
                    query: { gid: id },
                  }"
                  class="uk-position-cover"
                  :uk-tooltip="buildMessage(slide)"
                ></router-link>
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
    <ControlsFooterWidget @cancel="handleCancelClicked" @save="handleSaveClicked" />
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
      guide: {name: ''},
      slides: [],
    };
  },
  async beforeMount() {
    await this.loadGuide();
    await this.loadSlides();
  },
  async mounted() {
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
    buildMessage(slide) {
      let msg = "";
      if(!slide.uri || !slide.uri.length){
        msg += "This slide has no image and will not be shown in Frontend! ";
      }
      if (!slide.content || !slide.content.length) {
        msg += "This slide has no shapes. ";
      }

      msg += "Click to edit";
      return msg;
    },
    async loadGuide() {
      try {
        const response = await axios.get(`/api/admin/guides/${this.id}`);
        this.guide = response.data.guide;
      } catch (err) {
        console.log(err);
      }
    },
    async loadSlides() {
      try {
        const response = await axios.get(`/api/admin/guides/${this.id}/slides`);
        this.slides = response.data.slides;
        for (const slide of this.slides) {
          if(slide.content){
            try{
              slide.content = JSON.parse(slide.content);
            }catch (err) {
              console.log(err);
            }
          }
        }
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
