<template>
  <div class="uk-section uk-section-small builder-view">
    <div class="uk-container">
      <BuilderNotAvailableMobile />
      <div
        class="uk-visible@m uk-card uk-card-default uk-position-relative"
        uk-height-viewport="offset-top:true; offset-bottom:40px"
      >
        <div class="uk-position-cover">
          <div class="uk-grid-collapse" uk-grid>
            <div class="uk-width-1-4 builder-sidebar">
              <div class="uk-position-relative">
                <BuilderLocationsSection
                  v-if="categories.length"
                  :categories="categories"
                />
              </div>
            </div>
            <div class="uk-width-3-4">
              bar
              <BuilderCabinet />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BuilderNotAvailableMobile from "@/components/builder/BuilderNotAvailableMobile.vue";
import BuilderLocationsSection from "@/components/builder/BuilderLocationsSection.vue";
import axios from "axios";

export default {
  name: "BuilderView",
  components: { BuilderLocationsSection, BuilderNotAvailableMobile },
  data() {
    return {
      categories: [],
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      try {
        const result = await axios.get("/api/admin/poolbuilder/categories");
        this.categories = result.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="less">
@import "@/assets/less/components/builder.less";
</style>
