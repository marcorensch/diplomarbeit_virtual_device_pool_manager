<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-header">
      <h3 class="uk-card-title">Basics</h3>
    </div>
    <div class="uk-card-body">
      <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
        <div>
          <label for="brand">Brand / Manufacturer</label>
          <select id="brand" class="uk-select" v-model="device.manufacturer_id">
            <option
              v-for="manufacturer of manufacturers"
              :value="manufacturer.id"
              :key="manufacturer.id"
            >
              {{ manufacturer.name }}
            </option>
          </select>
        </div>
        <div>
          <div class="uk-margin">
            <label for="model">Model / Name</label>
            <input type="text" class="uk-input" v-model="device.name" />
          </div>
        </div>
      </div>
      <div class="uk-margin uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
        <div>
          <div>
            <label>Device Type</label>
            <div
              class="uk-child-width-1-4 uk-grid-small uk-grid-match device-type-selector-container"
              uk-grid
            >
              <div v-for="type of deviceTypes" :key="type.id">
                <div
                  class="uk-padding-small uk-text-large uk-card-default uk-text-center device-type-selector-option"
                  :class="{
                    'uk-card-primary': type.id === device.device_type_id,
                  }"
                  @click="handleDeviceTypeClicked(type.id)"
                  :uk-tooltip="'title:' + type.name"
                >
                  <font-awesome-icon :icon="'fas fa-' + type.icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="uk-margin">
            <label for="model">IMEI's</label>
            <div
              :class="{ 'uk-margin-small-top': index > 0 }"
              v-for="(imei, index) of imeis"
              :key="imei.id"
            >
              <div class="uk-grid-small uk-grid-match" uk-grid>
                <div class="uk-width-expand">
                  <input type="text" class="uk-input" v-model="imei.imei" />
                </div>
                <div class="uk-width-auto uk-flex-middle">
                  <font-awesome-icon
                    icon="fas fa-trash"
                    @click="handleRemoveImeiClicked(index)"
                  />
                </div>
              </div>
            </div>
            <div class="uk-margin-small-top">
              <button
                class="uk-button uk-button-primary uk-button-small uk-width-1-1"
                @click="handleAddImeiClicked"
              >
                Add IMEI
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@m"
        uk-grid
      >
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useDeviceEditStore } from "@/stores/deviceEdit";

const deviceEditStore = useDeviceEditStore();

export default {
  name: "DeviceBasicsWidget",
  components: { FontAwesomeIcon },
  watch: {
    imeis: {
      handler: function (newVal) {
        deviceEditStore.setIMEIs(newVal);
      },
      deep: true,
    },
  },
  data() {
    return {
      device: deviceEditStore.getDevice,
      imeis: [],
      deviceTypes: [],
      manufacturers: [],
    };
  },
  mounted() {
    this.getDeviceTypes();
    this.getManufacturers();
    this.getAvailableMSISDNs();
  },
  methods: {
    async getAvailableMSISDNs() {
      await deviceEditStore.setAvailableMSISDNs();
      this.msisdns = await deviceEditStore.getAvailableMSISDNs;
    },
    async getManufacturers() {
      await deviceEditStore.setAvailableManufacturers();
      this.manufacturers = await deviceEditStore.getManufacturers;
      console.log(this.manufacturers);
    },
    async getDeviceTypes() {
      await deviceEditStore.setAvailableDeviceTypes();
      this.deviceTypes = await deviceEditStore.getDeviceTypes;
    },
    handleDeviceTypeClicked(id) {
      deviceEditStore.setDeviceType(id);
    },
    handleAddImeiClicked() {
      this.imeis.push({ imei: "" });
    },
    handleRemoveImeiClicked(index) {
      this.imeis.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.device-type-selector-container {
  div.device-type-selector-option {
    cursor: pointer;
  }
}
</style>
