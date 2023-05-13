<template>
  <div class="uk-section uk-section-small builder-view">
    <div class="uk-container">
      <BuilderNotAvailableMobile />
      <div class="uk-visible@m">
        <div>
          <h4 class="uk-margin-remove-bottom">Pool Builder</h4>
        </div>
        <div>
          <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition || 'fade'" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BuilderNotAvailableMobile from "@/components/builder/BuilderNotAvailableMobile.vue";

export default {
  name: "BuilderView",
  components: { BuilderNotAvailableMobile },
  data() {
    return {
      categories: [],
    };
  },
};
</script>

<style lang="less">
@import "@/assets/less/components/builder.less";
</style>
