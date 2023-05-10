<template>
  <div class="uk-section uk-section-small builder-view">
    <div class="uk-container">
      <h1>Builder View</h1>
      <BuilderNotAvailableMobile />
    </div>
  </div>
</template>

<script>
import BuilderNotAvailableMobile from "@/components/builder/BuilderNotAvailableMobile.vue";

export default {
  name: "BuilderView",
  components: { BuilderNotAvailableMobile },
};
</script>

<style lang="less" scoped>
@import "@/assets/less/components/builder.less";
</style>
