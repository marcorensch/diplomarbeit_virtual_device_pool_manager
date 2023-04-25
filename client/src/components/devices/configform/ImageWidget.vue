<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-body">
      <div class="device-image-container" v-if="device.image">
        <img :src="device.image" />
      </div>
      <div class="uk-margin">
        <input type="file" />
      </div>
    </div>
  </div>
</template>

<script>
import { useDeviceEditStore } from "@/stores/deviceEdit";
const deviceEditStore = useDeviceEditStore();
export default {
  name: "ImageWidget",
  data() {
    return {
      device: deviceEditStore.getDevice,
    };
  },
};
</script>

<style scoped></style>
