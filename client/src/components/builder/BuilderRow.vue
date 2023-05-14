<template>
  <div class="uk-width-1-1">
    <div class="uk-card uk-card-default">
      <div class="uk-position-top-right">
        <div
          class="uk-padding-small edit-div"
          @click="handleEditRowClicked(builderRow)"
        >
          <font-awesome-icon class="uk-preserve-width" :icon="['fas', 'cog']" />
        </div>
      </div>
      <div class="uk-card-header">
        <div>
          <span class="uk-text-large nxd-text-navy uk-text-light">{{
            builderRow.name ? builderRow.name : "Row"
          }}</span>
          <template v-if="builderRow.hidden">
            <font-awesome-icon
              v-if="builderRow.description"
              :icon="['fas', 'note-sticky']"
              class="uk-margin-left"
            />
            <div
              class="uk-card uk-padding-small uk-card-default uk-border-rounded"
              uk-drop
            >
              <span class="nxd-text-navy">Description:</span><br />
              <div class="uk-overflow-auto" style="max-height: 90px">
                {{ builderRow.description }}
              </div>
            </div>
          </template>
          <template v-if="builderRow.hidden">
            <font-awesome-icon
              v-if="builderRow.hidden"
              :icon="['fas', 'lock']"
              class="uk-margin-left"
            />
            <div
              class="uk-card uk-padding-small uk-card-default uk-border-rounded"
              uk-drop
            >
              <span class="nxd-text-navy">Hidden Note:</span><br />
              <div class="uk-overflow-auto" style="max-height: 90px">
                {{ builderRow.hidden }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="uk-card-body">
        <div class="slot-container uk-child-width-expand uk-grid-small" uk-grid>
          <template v-for="(slot, index) of slots" :key="index">
            <BuilderSlot
              :builderSlot="slot"
              :builderRow="builderRow"
              @editSlot="handleEditSlotClicked(slot)"
            />
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
                <div class="uk-text-small uk-width-auto uk-text-truncate">
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useBuilderItemStore } from "@/stores/builderItemStore";

export default {
  name: "BuilderRow",
  components: { FontAwesomeIcon, BuilderSlot },
  emits: ["edit-row", "edit-slot"],
  setup() {
    const builderItemStore = useBuilderItemStore();
    return { builderItemStore };
  },
  props: {
    builderRow: {
      type: Object,
      required: true,
    },
    builderCabinet: {
      type: Object,
      required: true,
    },
    slotCategoryId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      slots: [],
    };
  },
  mounted() {
    this.getSlots();
  },
  methods: {
    async getSlots() {
      console.log(this.builderRow.id, this.builderRow.category_id);
      this.slots = await this.builderItemStore.getChildItems(
        this.slotCategoryId,
        this.builderRow.id
      );
    },
    async handleAddSlotClicked(times) {
      if (isNaN(times)) {
        times = 1;
      }
      for (let i = 0; i < times; ) {
        console.log("addSlot", i);
        await this.addSlot(i);
        i++;
      }

      this.slots = await this.builderItemStore.getChildItems(
        this.slotCategoryId,
        this.builderRow.id
      );
    },
    async addSlot(loopIndex) {
      const name = this.slots.length + 1 + loopIndex;
      await this.builderItemStore.createItem(
        this.slotCategoryId,
        this.builderRow.id,
        name
      );
    },
    handleEditRowClicked() {
      this.$emit("edit-row", this.builderRow);
    },
    handleEditSlotClicked(slot) {
      this.$emit("edit-slot", slot);
    },
  },
};
</script>

<style scoped></style>
