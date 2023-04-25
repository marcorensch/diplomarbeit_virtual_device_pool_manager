<template>
  <div class="uk-margin uk-card uk-card-default">
    <div class="uk-card-body">
      <div>
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          class="uk-textarea"
          v-model="device.notes"
        ></textarea>
      </div>
      <div class="uk-margin">
        <label for="hidden">Hidden Notes</label>
        <textarea
          id="hidden"
          class="uk-textarea"
          v-model="device.hidden"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { useDeviceEditStore } from "@/stores/deviceEdit";
const deviceEditStore = useDeviceEditStore();
export default {
  name: "NotesWidget",
  data() {
    return {
      device: deviceEditStore.getDevice,
    };
  },
};
</script>

<style scoped></style>
