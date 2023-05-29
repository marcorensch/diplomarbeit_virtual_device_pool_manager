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
          v-model="local.notes"
          @change="$emit('updateValue', 'notes', local.notes)"
        ></textarea>
      </div>
      <div
        class="uk-margin"
        v-if="authStore.hasPermission('canHandleHiddenInformation')"
      >
        <label for="hidden">Hidden Notes</label>
        <textarea
          id="hidden"
          class="uk-textarea"
          v-model="local.hidden"
          @change="$emit('updateValue', 'hidden', local.hidden)"
        ></textarea>
      </div>
    </div>
    <div class="uk-card-footer" v-if="inCard"></div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  name: "NotesWidget",
  emits: ["updateValue"],
  setup() {
    return {
      authStore: useAuthStore(),
    };
  },
  props: {
    inCard: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: "",
    },
    hidden: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      local: {
        notes: this.notes,
        hidden: this.hidden,
      },
    };
  },
};
</script>

<style scoped></style>
