<template>
  <div class="uk-section uk-section-small devices-list-view" uk-height-viewport="offset-top:true">
    <div class="uk-container">
      <h1>GuideMe</h1>
      <p class="uk-text-lead">On this page you will find helpful step by step guides to support you.</p>

      <div class="uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-3@l uk-grid-small" uk-grid uk-height-match="target: .uk-card-body" uk-scrollspy="target: > div > div.uk-card; cls:uk-animation-slide-bottom-small; delay:100;">
        <template v-for="guide of guides" :key="guide.id">
          <div>
            <div class="uk-card uk-card-default uk-card-small uk-position-relative">
              <div class="uk-grid-collapse uk-flex uk-flex-middle" uk-grid>
                <div class="uk-width-expand">
                  <div class="uk-card-header">
                    <h3 class="uk-card-title">{{ guide.name }}</h3>
                  </div>
                  <div class="uk-card-body uk-padding-remove-top uk-padding-remove-right">
                    <p>{{ guide.description }}</p>
                  </div>
                </div>
                <div class="uk-width-auto">
                  <div class="uk-padding-small">
                    <font-awesome-icon class="uk-preserve-width nxd-link-icon" :icon="['fas', 'chevron-right']" size="2x"/>
                  </div>
                </div>
              </div>
              <router-link :to="{ name: 'guide-front', params: { id: guide.id } }" class="uk-position-cover" />
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "GuidesOverview",
  components: {FontAwesomeIcon},
  data() {
    return {
      guides: []
    }
  },
  async mounted() {
    await this.getGuides();
  },
  methods: {
    async getGuides() {
      try {
        const response = await axios.get("/api/guides");
        this.guides = response.data.guides;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>

</style>