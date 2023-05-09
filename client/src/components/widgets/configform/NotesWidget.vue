<template>
  <div :class="{ 'uk-margin uk-card uk-card-default': inCard }">
    <div class="uk-card-header" v-if="inCard">
      <h3 class="uk-card-title">Notes</h3>
    </div>
    <div :class="{ 'uk-card-body': inCard }">
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
    <div class="uk-card-footer" v-if="inCard"></div>
  </div>
</template>

<script>
export default {
  name: "NotesWidget",
  props: {
    inCard: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      device: {
        notes: "",
        hidden: "",
      },
    };
  },
};
</script>

<style scoped></style>
