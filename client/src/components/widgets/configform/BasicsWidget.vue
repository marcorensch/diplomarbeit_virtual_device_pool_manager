<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-body">
      <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
        <div>
          <label for="brand">Brand / Manufacturer</label>
          <select id="brand" class="uk-select" v-model="device.manufacturer_id">
            <option value="samsung">Samsung</option>
            <option value="apple">Apple</option>
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
            <div class="uk-child-width-1-4 uk-grid-small uk-grid-match" uk-grid>
              <div v-for="type of device_types" :key="type.id">
                <div
                  class="uk-padding-small uk-text-large uk-card-default uk-text-center uk-cursor-pointer"
                  :class="{
                    'uk-card-primary': type.id === device.device_type_id,
                  }"
                  @click="handleDeviceTypeClicked(type.id)"
                  :uk-tooltip="'title:' + type.name"
                >
                  <font-awesome-icon :icon="'fas fa-' + type.icon" />
                </div>
              </div>
              <div>
                <div
                  class="uk-padding-small uk-text-large uk-card-default uk-text-center"
                ></div>
              </div>
            </div>
          </div>

          <div class="uk-margin">
            <label>MSISDN's</label>
            <ul class="uk-list uk-list-divider uk-list-small">
              <li
                :class="{ 'uk-margin-small-top': index > 0 }"
                v-for="(msisdn, index) of msisdns"
                :key="msisdn.id"
              >
                {{ msisdn.msisdn }}
              </li>
            </ul>
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
  name: "BasicsWidget",
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
      msisdns: [{ msisdn: "+41 79 244 12 35" }, { msisdn: "+41 79 244 12 35" }],
      imeis: [
        { imei: "123456789012345" },
        { imei: "23456789012346" },
        { imei: "3456789012347" },
        { imei: "456789012348" },
        { imei: "56789012349" },
      ],
      device_types: [
        { id: 1, name: "Smartphone", icon: "mobile-screen-button" },
        { id: 2, name: "Simple Phone", icon: "mobile-retro" },
        { id: 3, name: "Tablet", icon: "tablet-screen-button" },
        { id: 4, name: "Laptop", icon: "laptop" },
        { id: 5, name: "TV", icon: "tv" },
        { id: 6, name: "Camera", icon: "camera-retro" },
        { id: 7, name: "Smart Device", icon: "microchip" },
      ],
    };
  },
  methods: {
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

<style scoped></style>
