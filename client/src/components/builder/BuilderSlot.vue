<template>
  <div>
    <div
      class="uk-card uk-card-default uk-padding-small"
      @click="handleEditSlotClicked"
    >
      <div class="uk-text-center">
        {{ builderSlot.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BuilderSlot",
  emits: ["edit-slot"],
  props: {
    builderSlot: {
      type: Object,
      required: true,
    },
    builderRow: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleEditSlotClicked() {
      this.$emit("edit-slot");
    },
  },
};
</script>

<style scoped></style>
