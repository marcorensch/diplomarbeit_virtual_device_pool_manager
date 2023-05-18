<template>
  <div class="uk-grid-small uk-margin-bottom" uk-grid>
    <div>
      <a href="#" class="go-back-link">
        <font-awesome-icon
          :icon="['fas', 'arrow-left']"
          class="uk-h2 uk-margin-remove"
          @click="this.$emit('showCabinets')"
        />
      </a>
    </div>
    <div>
      <h2 class="uk-margin-remove">
        {{ selectedLocation.name }}, Cabinet {{ selectedCabinet.name }}
      </h2>
      <h3 class="uk-margin-remove">Select Slot</h3>
    </div>
  </div>
  <template v-if="cabinet?.children">
    <div
      v-if="cabinet.children.length"
      id="cabinet-container"
      class="uk-padding-small"
    >
      <div v-for="row of cabinet.children" :key="row.id" class="row-container">
        <div class="uk-child-width-expand uk-grid-small" uk-grid>
          <div v-for="slot of row.children" :key="slot.id">
            <div
              class="uk-card uk-card-default uk-card-body uk-card-small uk-position-relative selectable-item"
              @click="
                this.$emit('slotSelected', {
                  label: buildSlotLabel(row, slot),
                  ...slot,
                })
              "
              :uk-tooltip="buildSlotLabel(row, slot)"
            >
              {{ slot.name }}
              <div class="uk-position-top-right">
                <font-awesome-icon
                  :icon="['fas', 'circle']"
                  class="slot-status-icon uk-preserve-width"
                  :class="slot.device_id ? 'uk-text-danger' : 'uk-text-success'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="uk-padding">
        <div class="uk-text-center uk-text-muted">
          <div class="uk-text-large">No Rows Found</div>
          <div v-if="authStore.hasPermission('canAccessPoolBuilder')">
            Note: You can manage Device Pools in the Admin area
          </div>
        </div>
      </div>
    </div>
  </template>
  <div v-else>
    <div class="uk-text-center uk-height-large">
      <div uk-spinner="ratio: 3"></div>
      <div class="uk-margin-top uk-text-muted">Loading Slots</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "selectorSlot",
  emits: ["showCabinets", "slotSelected"],
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  props: {
    selectedLocation: {
      type: Object,
      required: true,
    },
    selectedCabinet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cabinet: null,
    };
  },
  mounted() {
    this.getCabinet(this.selectedCabinet.id);
  },
  methods: {
    buildSlotLabel(row, slot) {
      let label = `${this.selectedLocation.name}, ${this.selectedCabinet.name}.${row.name}`;
      if (Number.isInteger(parseInt(slot.name))) {
        if (parseInt(slot.name) < 10) {
          label += `0`;
        }
        label += `${slot.name}`;
      }
      return label;
    },
    async getCabinet(id) {
      try {
        const response = await axios.get(
          `/api/devicepool/items/${id}?deep=true`
        );
        this.cabinet = response.data;
        console.log(this.cabinet);
      } catch (e) {
        console.log(e);
        this.cabinet = null;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/less/variables.less";
#cabinet-container {
  border-radius: @nxd-border-radius;
  border: 1px solid @color-grey-lighter;

  .row-container {
    border-radius: @nxd-border-radius;
    border: 1px solid @color-grey-light;
    padding: 10px;
    margin-bottom: 10px;

    .selectable-item {
      cursor: pointer;
      text-align: center;
      transition: all 0.2s ease-in-out;
      &:hover {
        background-color: @color-horizon;
        transition: all 0.2s ease-in-out;
      }

      .slot-status-icon {
        font-size: 0.4rem;
        padding: 6px;
      }
    }
  }
}
</style>
