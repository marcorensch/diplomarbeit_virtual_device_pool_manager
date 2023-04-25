<template>
  <div class="uk-position-fixed uk-position-bottom uk-position-z-index">
    <div
      class="nxd-background-horizon uk-padding uk-grid-small uk-child-width-1-1 uk-child-width-auto@m uk-flex-right uk-animation-slide-bottom"
      uk-grid
    >
      <div>
        <button
          class="uk-button uk-button-secondary uk-width-1-1"
          @click="handleCancelClicked"
        >
          Cancel
        </button>
      </div>
      <div>
        <button
          class="uk-button uk-button-primary uk-width-1-1"
          @click="handleSaveClicked"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlsFooterWidget",
  emits: ["cancel", "save"],
  methods: {
    handleCancelClicked() {
      this.$emit("cancel");
    },
    handleSaveClicked() {
      this.$emit("save");
    },
  },
};
</script>

<style scoped></style>
