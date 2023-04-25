<template>
  <div
    class="uk-section uk-section-small device-config-view"
    style="background: red"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container">
      <h1>Configure Device</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeviceConfigView",
  data() {
    return {
      device: null,
    };
  },
};
</script>
