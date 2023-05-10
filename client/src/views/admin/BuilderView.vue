<template>
  <div class="uk-section uk-section-small builder-view">
    <div class="uk-container">
      <BuilderNotAvailableMobile />
      <div
        class="uk-visible@m uk-card uk-card-default uk-position-relative"
        uk-height-viewport="offset-top:true; offset-bottom:40px"
      >
        <div class="uk-position-cover" style="background: blue">
          <div class="uk-grid-collapse" uk-grid>
            <div class="uk-width-1-4" style="background: yellow">
              <div
                class="uk-position-relative"
                uk-height-viewport="offset-top:true; offset-bottom:true"
              >
                <BuilderLocationsSection />
              </div>
            </div>
            <div class="uk-width-3-4" style="background: firebrick">
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

export default {
  name: "BuilderView",
  components: { BuilderLocationsSection, BuilderNotAvailableMobile },
};
</script>

<style lang="less" scoped>
@import "@/assets/less/components/builder.less";
</style>
