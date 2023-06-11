<template>
  <div class="uk-section uk-section-small devices-list-view" uk-height-viewport="offset-top:true">
    <div class="uk-container">
      <h1>{{ guide.name }}</h1>
      <p class="uk-text-lead">{{ guide.description }}</p>
    </div>
    <div class="uk-container uk-margin">
      <div class="" uk-slider="center: true; finite:true">
        <div class="uk-position-relative uk-visible-toggle" tabindex="-1">
          <ul class="uk-slider-items uk-grid uk-grid-match">
            <template v-for="(slide, si) of slides" :key="slide.id">
              <li class="uk-width-1-1">
                <div class="">
                  <div class="uk-child-width-expand uk-grid-small" uk-grid>
                    <div>
                      <div class="uk-padding" uk-scrollspy="target: > *; cls:uk-animation-slide-left-medium; delay:150; repeat:true;">
                        <h3 class="uk-margin-remove">{{ si + 1 }}. {{ slide.name }}</h3>
                        <div v-for="(step, index) of slide.content" :key="index">
                          <p class="uk-margin-remove uk-text-bold">{{ step.label }}</p>
                          <p class="uk-margin-remove">{{ step.description }}</p>
                        </div>
                        <div class="uk-margin-top">
                          <button v-if="si < slides.length - 1" class="uk-button uk-button-secondary uk-width-1-1"
                                  uk-slider-item="next">
                            Next
                          </button>
                          <button v-else class="uk-button uk-button-secondary uk-width-1-1" uk-slider-item="0">
                            Start Again
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="uk-position-relative uk-border-rounded uk-overflow-hidden">
                        <img class="slide-image" :src="'/public/' + slide.uri" :alt="slide.name" uk-scrollspy="cls:uk-animation-slide-right-medium;delay:100;repeat:true;">
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "GuideView",
  components: {FontAwesomeIcon},
  data() {
    return {
      guide: {},
      slides: [],
    }
  },
  async mounted() {
    await this.getGuide();
  },
  methods: {
    async getGuide() {
      try {
        const response = await axios.get(`/api/guides/${this.$route.params.id}`);
        this.guide = response.data.guide;
        this.slides = response.data.slides.map(slide => {
          try {
            slide.content = JSON.parse(slide.content);
          } catch (error) {
            console.log(error);
          }
          return slide;
        });
        console.log(this.slides);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
img.slide-image {
  max-height: 70vh;
}
</style>