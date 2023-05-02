<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-body uk-position-relative uk-padding-bottom">
      <h3 class="uk-card-title">{{ title }}</h3>
      <div class="device-image-container" v-if="image">
        <img :src="image" />
      </div>
      <div class="uk-position-bottom uk-width-1-1 uk-padding">
        <button
          class="uk-button uk-button-small uk-button-primary uk-width-1-1"
        >
          Select
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageWidget",
  emits: ["image-changed"],
  props: {
    title: {
      type: String,
      default: "Image",
    },
    image: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleImageChanged(selectedImageUri) {
      this.$emit("image-changed", selectedImageUri);
    },
  },
};
</script>

<style scoped>
.uk-card-body {
  min-height: 230px;
}
</style>
