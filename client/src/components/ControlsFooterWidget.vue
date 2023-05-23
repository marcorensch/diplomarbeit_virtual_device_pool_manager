<template>
  <div class="uk-position-fixed uk-position-bottom uk-position-z-index">
    <div
      class="nxd-background-horizon uk-padding-small uk-animation-slide-bottom"
    >
      <div
        class="uk-child-width-1-1 uk-child-width-auto@m uk-grid-small"
        uk-grid
      >
        <div v-if="!showDelete">
          <button
            class="uk-button uk-button-danger uk-width-1-1"
            @click="handleDeleteClicked"
          >
            Delete
          </button>
        </div>
        <div class="uk-width-expand">
          <div
            class="uk-grid-small uk-child-width-1-1 uk-child-width-auto@m uk-flex-right"
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlsFooterWidget",
  emits: ["cancel", "save", "delete"],
  props: {
    showDelete: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleDeleteClicked() {
      this.$emit("delete");
    },
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
