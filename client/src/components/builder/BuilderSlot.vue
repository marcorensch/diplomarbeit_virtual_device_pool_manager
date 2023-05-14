<template>
  <div>
    <div
      class="uk-card uk-card-default uk-padding-small"
      @click="handleEditSlotClicked"
    >
      <div class="uk-text-center" :uk-tooltip="slotIdentificator">
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
    builderCabinet: {
      type: Object,
      required: true,
    },
  },
  watch: {
    builderRow: {
      handler() {
        this.slotIdentificator = this.constructSlotIdentificator();
      },
      deep: true,
    },
    builderSlot: {
      handler() {
        this.slotIdentificator = this.constructSlotIdentificator();
      },
      deep: true,
    },
  },
  data() {
    return {
      slotIdentificator: this.constructSlotIdentificator(),
    };
  },
  methods: {
    constructSlotIdentificator() {
      const leadingZeroName =
        parseInt(this.builderSlot.name) > 9
          ? this.builderSlot.name
          : `0${this.builderSlot.name}`;
      return `${this.builderCabinet.name}.${this.builderRow.name}${leadingZeroName}`;
    },
    handleEditSlotClicked() {
      this.$emit("edit-slot");
    },
  },
};
</script>

<style scoped></style>
