<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-header">
      <h3 class="uk-card-title">Similar Device</h3>
    </div>
    <div class="uk-card-body">
      Link here
      <button
        class="uk-button uk-button-small uk-button-secondary"
        @click="showModal"
      >
        Select
      </button>
    </div>
  </div>
  <div id="device-select-modal" class="uk-flex-top" ref="modal" uk-modal>
    <div class="uk-modal-dialog uk-margin-auto-vertical">
      <a href="" class="uk-modal-close-default" uk-close></a>
      <div class="uk-modal-header">
        <h3 class="uk-modal-title">Select Device</h3>
      </div>
      <div class="uk-modal-body">BODY</div>
      <div class="uk-modal-footer">
        <div
          class="uk-child-width-1-1 uk-child-width-auto@m uk-flex uk-flex-right uk-grid-small"
          uk-grid
        >
          <div>
            <button class="uk-button uk-button-secondary uk-modal-close">
              Cancel
            </button>
          </div>
          <div>
            <button
              class="uk-button uk-button-primary"
              @click="handleDeviceSelected"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIkit from "uikit";
export default {
  name: "SelectDeviceWidget",
  emits: ["device-selected"],
  data() {
    return {
      devices: [],
      selectedDevice: null,
    };
  },
  mounted() {},
  methods: {
    handleDeviceSelected() {
      this.$emit("device-selected", this.selectedDevice);
    },
    showModal() {
      const modal = this.$refs.modal;
      UIkit.modal(modal).show();
    },
  },
};
</script>

<style scoped></style>
