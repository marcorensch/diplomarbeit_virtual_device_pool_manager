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
              :builderCabinet="builderCabinet"
              @editSlot="handleEditSlotClicked(slot, locationIdentificator)"
            />
          </template>
          <div v-if="slots.length < maxSlots">
            <div
              class="nxd-no-select"
              uk-scrollspy="cls:uk-animation-fade;delay:200"
            >
              <div
                class="uk-card uk-card-body uk-padding-small nx-card-add uk-card-hover uk-flex uk-flex-center"
                @click.exact="handleAddSlotClicked"
                v-on:click.shift="
                  handleAddSlotClicked(Math.floor(maxSlots / 2))
                "
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
    <div
      :id="'slot-config-modal-' + builderRow.id"
      class="uk-flex-top"
      uk-modal
    >
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <template v-if="currentSelectedItem">
          <button
            class="uk-modal-close uk-modal-close-default"
            uk-close
            type="button"
          ></button>
          <div class="uk-modal-header">
            <h2 class="uk-modal-title">
              <font-awesome-icon
                :icon="['fas', 'cubes']"
                class="uk-margin-right"
              />
              Edit Slot {{ currentSelectedItem.name }}
            </h2>
          </div>
          <div class="uk-modal-body">
            <div class="uk-form" v-if="currentSelectedItem">
              <div class="uk-margin">
                <label for="name" class="uk-form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="uk-input"
                  v-model="currentSelectedItem.name"
                  placeholder="Cabinet Name"
                />
              </div>
              <div class="uk-margin">
                <label for="description" class="uk-form-label"
                  >Description</label
                >
                <textarea
                  id="description"
                  name="description"
                  type="textarea"
                  class="uk-textarea"
                  v-model="currentSelectedItem.description"
                  placeholder="Location Description"
                ></textarea>
              </div>
              <div class="uk-margin">
                <label for="hidden" class="uk-form-label">Description</label>
                <textarea
                  type="textarea"
                  id="hidden"
                  name="hidden"
                  class="uk-textarea"
                  v-model="currentSelectedItem.hidden"
                  placeholder="Hidden Information"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="uk-modal-footer">
            <div class="uk-grid-small" uk-grid>
              <div v-if="currentSelectedItem.id">
                <button
                  class="uk-button uk-button-danger"
                  @click="handleModalDeleteClicked"
                >
                  Delete
                </button>
              </div>
              <div class="uk-width-expand">
                <div class="uk-grid-small uk-flex uk-flex-right" uk-grid>
                  <div>
                    <button
                      class="uk-button uk-button-secondary uk-modal-close"
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      class="uk-button uk-button-primary"
                      :class="{ 'uk-disabled': !currentSelectedItem.name }"
                      @click="handleModalSaveClicked"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import BuilderSlot from "@/components/builder/BuilderSlot.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useBuilderItemStore } from "@/stores/builderItemStore";
import { useToast } from "vue-toastification";
import UIkit from "uikit";

export default {
  name: "BuilderRow",
  components: { FontAwesomeIcon, BuilderSlot },
  emits: ["edit-row"],
  setup() {
    const builderItemStore = useBuilderItemStore();
    const toast = useToast();
    return { builderItemStore, toast };
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
      maxSlots: parseInt(process.env.VUE_APP_MAX_SLOTS_PER_ROW),
      currentSelectedItem: null,
    };
  },
  mounted() {
    this.getSlots();
  },
  methods: {
    async getSlots() {
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
        if (!(await this.addSlot(i))) break;
        i++;
      }

      this.slots = await this.builderItemStore.getChildItems(
        this.slotCategoryId,
        this.builderRow.id
      );
    },
    async addSlot(loopIndex) {
      const counter = this.slots.length + 1 + loopIndex;
      if (counter > this.maxSlots) {
        this.toast.warning("Max slots count reached for this row");
        return false;
      }
      const name = this.slots.length + 1 + loopIndex;
      await this.builderItemStore.createItem(
        this.slotCategoryId,
        this.builderRow.id,
        name
      );
      return true;
    },
    handleEditRowClicked() {
      this.$emit("edit-row", this.builderRow);
    },
    handleEditSlotClicked(slot) {
      this.currentSelectedItem = slot;
      this.$nextTick(() => {
        UIkit.modal("#slot-config-modal-" + this.builderRow.id).show();
      });
    },
    async handleModalSaveClicked() {
      await this.builderItemStore.updateItem(this.currentSelectedItem);
      this.currentSelectedItem = null;
      UIkit.modal("#slot-config-modal-" + this.builderRow.id).hide();
      await this.getSlots();
    },
    async handleModalDeleteClicked() {
      await this.builderItemStore.deleteItem(this.currentSelectedItem);
      this.currentSelectedItem = null;
      UIkit.modal("#slot-config-modal-" + this.builderRow.id).hide();
      await this.getSlots();
    },
  },
};
</script>

<style scoped></style>
