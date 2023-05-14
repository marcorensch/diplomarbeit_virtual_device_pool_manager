<template>
  <div class="uk-width-1-1">
    <div class="uk-card uk-card-default">
      <div class="uk-card-header">
        <span class="uk-text-large nxd-text-navy uk-text-light">{{
          builderRow.name ? builderRow.name : "Row"
        }}</span>
      </div>
      <div class="uk-card-body">
        <div class="slot-container uk-child-width-expand uk-grid-small" uk-grid>
          <template v-for="(slot, index) of slots" :key="index">
            <BuilderSlot :builderSlot="slot" :builderRow="builderRow" />
          </template>
          <div>
            <div
              class="nxd-no-select"
              uk-scrollspy="cls:uk-animation-fade;delay:200"
            >
              <div
                class="uk-card uk-card-body uk-padding-small nx-card-add uk-card-hover uk-flex uk-flex-center"
                @click="handleAddSlotClicked"
              >
                <div class="uk-text-small uk-width-auto">
                  <font-awesome-icon :icon="['fas', 'plus']" /> Add Slot
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BuilderSlot from "@/components/builder/BuilderSlot.vue";

export default {
  name: "BuilderRow",
  components: { BuilderSlot },
  props: {
    builderRow: {
      type: Object,
      required: true,
    },
    builderCabinet: {
      type: Object,
      required: true,
    },
  },
  mounted() {},
  methods: {
    handleAddSlotClicked() {},
  },
};
</script>

<style scoped></style>
