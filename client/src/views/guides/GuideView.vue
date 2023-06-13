<template>
  <div>
    <div class="uk-section nxd-background-horizon uk-section-small" uk-height-viewport="offset-top:true">
      <div class="uk-container">
        <div class="uk-grid-small uk-child-width-auto uk-flex-middle" uk-grid>
          <div>
            <router-link :to="{ name: 'guides-front' }" class="uk-text-lead">
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
            </router-link>
          </div>
          <div>
            <h1 class="uk-margin-remove"> {{ guide.name }}</h1>
          </div>
        </div>
        <p class="uk-text-lead">{{ guide.description }}</p>
      </div>

      <div class="uk-container uk-margin">
        <div id="guide-slider" class="" uk-slider="center: true; finite:true">
          <div class="uk-position-relative">

            <div class="uk-slider-container uk-visible-toggle" tabindex="-1">
              <ul class="uk-slider-items uk-grid uk-grid-match">
                <template v-for="(slide, si) of slides" :key="slide.id">
                  <li class="uk-width-1-1">
                    <div class="">
                      <div class="uk-child-width-1-1 uk-child-width-expand@m uk-grid-small" uk-grid>

                        <div>
                          <div class="uk-flex uk-flex-center" >
                            <div class="uk-border-rounded uk-overflow-hidden uk-position-relative">
                              <img :id="'slide-image-' + si" :data-index="si" class="slide-image" :src="'/public' + slide.uri" :alt="slide.name">
                              <div class="canvas-container uk-position-cover">
                                <v-stage :config="configKonva[si]">
                                  <v-layer>
                                  <template v-for="shape in slide.content" :key="shape.id">
                                    <v-circle
                                        v-if="shape.type === 'circle'"
                                        :config="shape"
                                    ></v-circle>
                                    <v-rect
                                        v-if="shape.type === 'rectangle'"
                                        :config="shape"
                                    ></v-rect>
                                  </template>
                                  </v-layer>
                                </v-stage>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="uk-width-large@m uk-flex-first@m">
                          <div class="uk-card uk-card-default uk-card-body">
                            <h3 class="uk-margin-remove" uk-slider-parallax="x: 300,-300">{{ si + 1 }}. {{ slide.name }}</h3>
                            <div v-for="(step, index) of slide.content" :key="index" uk-slider-parallax="x: 400,-400">
                              <p class="uk-margin-remove uk-text-bold">{{ step.label }}</p>
                              <p class="uk-margin-remove">{{ step.description }}</p>
                            </div>
                            <div class="uk-margin-top" uk-slider-parallax="x: 450,-450">
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
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
            </div>

            <div class="uk-hidden@l">
              <a class="uk-position-center-left" href="#" uk-slidenav-previous
                 uk-slider-item="previous">
              </a>
              <a class="uk-position-center-right" href="#" uk-slidenav-next uk-slider-item="next"></a>
            </div>

            <div class="uk-visible@l">
              <a class="uk-position-center-left-out uk-position-small" href="#" uk-slidenav-previous
                 uk-slider-item="previous">
              </a>
              <a class="uk-position-center-right-out uk-position-small" href="#" uk-slidenav-next
                 uk-slider-item="next"></a>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>

</template>

<script>

import axios from "axios";
import UIkit from "uikit";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "GuideView",
  components: {FontAwesomeIcon},
  data() {
    return {
      imageLoaded: false,
      guide: {},
      slides: [],
      configKonva: {},
      currentSlideDomElement: null,
      currentSlideIndex: 0,
    }
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
  async mounted() {
    await this.getGuide();

    window.addEventListener('resize', this.handleWindowResize);

    UIkit.util.on('#guide-slider', 'itemshown', (e) => {
      this.currentSlideDomElement = e.target;
      this.currentImageDomElement = this.currentSlideDomElement.querySelector('img.slide-image');
      if(!this.currentImageDomElement.complete) {
        this.loadImage(this.currentImageDomElement).then((imageDomElement) => {
          this.initStage(imageDomElement)
        });
      }else {
        this.initStage(this.currentImageDomElement)
      }
    });

  },
  methods: {
    handleWindowResize() {
      this.$nextTick(() => {
        this.initStage(this.currentImageDomElement)
      });
    },
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
      } catch (error) {
        console.log(error);
      }
    },

    async loadImage(element){
      return new Promise((resolve, reject) => {
        element.onload = () => {
          resolve(element);
        };
        element.onerror = reject;
      });
    },

    initStage(imageDomElement){
      this.currentSlideIndex = imageDomElement.dataset.index;
      this.configKonva[this.currentSlideIndex] = {
        width: imageDomElement.offsetWidth,
        height: imageDomElement.offsetHeight
      };
      this.placeShapes(this.currentSlideIndex);
    },

    placeShapes(stageIndex){
      const slide = this.slides[stageIndex];
      const shapes = slide.content;
      shapes.forEach(shape => {
        this.updateShapeDimensionsByPercentages(shape, stageIndex)
      });
    },
    updateShapeDimensionsByPercentages(shape, stageIndex) {
      shape.x = (this.configKonva[stageIndex].width / 100) * shape.percentages.x;
      shape.y = (this.configKonva[stageIndex].height / 100) * shape.percentages.y;
      shape.strokeWidth = Math.ceil((this.configKonva[stageIndex].width / 100) * shape.percentages.strokeWidth);
      if (shape.type === "rectangle") {
        shape.width = (this.configKonva[stageIndex].width / 100) * shape.percentages.width;
        shape.height = (this.configKonva[stageIndex].height / 100) * shape.percentages.height;
        shape.cornerRadius = (this.configKonva[stageIndex].width / 100) * shape.percentages.cornerRadius;
      }
      if (shape.type === "circle") {
        shape.radius = (this.configKonva[stageIndex].width / 100) * shape.percentages.radius;
      }

    },
  }
}
</script>

<style scoped>
img.slide-image {
  max-height: 60vh;
}
@media screen and (min-width: 960px) {
  img.slide-image {
    max-height: 80vh;
  }
}
</style>