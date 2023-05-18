<template>
  <div
    class="uk-section uk-section-small devices-list-view"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container">
      <h1>Pool Devices</h1>
      <div
        class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
      >
        <div class="uk-flex uk-flex-right">
          <div v-if="authStore.hasPermission('canCreateDevices')">
            <router-link
              :to="{ name: 'create-device' }"
              class="uk-button uk-button-primary uk-flex uk-flex-middle"
            >
              <div>
                <font-awesome-icon :icon="['fas', 'plus']" /> Add Device
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div class="uk-margin">
        <table
          id="devices-table"
          class="uk-table uk-table-divider uk-table-middle uk-table-hover uk-table-responsive"
        >
          <thead>
            <th></th>
            <th>Model</th>
            <th class="uk-text-center@m">Type</th>
            <th class="uk-text-center@m">Availability</th>
            <th class="uk-visible@m">Location</th>
            <th class="uk-visible@m"></th>
          </thead>
          <tbody>
            <tr
              v-for="device of devices"
              :key="device.id"
              class="uk-position-relative"
              @click.exact="handleDeviceSelected(device)"
            >
              <td class="uk-table-shrink">
                <img
                  v-if="device.manufacturer_logo"
                  class="uk-preserve-width uk-border-rounded"
                  width="32"
                  :src="device.manufacturer_logo"
                  :title="device.manufacturer_name"
                  :uk-tooltip="device.manufacturer_name"
                />
              </td>
              <td class="uk-width-1-2">
                <span>{{ device.name }}</span>
              </td>
              <td
                class="uk-text-center@m"
                :data-type="device.device_type_name"
                :uk-tooltip="device.device_type_name"
              >
                <font-awesome-icon
                  v-if="device.device_type_icon"
                  :icon="['fas', device.device_type_icon]"
                />
              </td>
              <td class="uk-text-center@m">
                <div
                  v-if="!device.checked_out_by && device.slot_id"
                  class="uk-text-success"
                  uk-tooltip="Available"
                >
                  <font-awesome-icon :icon="['fas', 'check']" />
                  <span class="uk-hidden@m">Available</span>
                </div>
                <div
                  class="uk-text-primary"
                  v-else-if="!device.slot_id"
                  uk-tooltip="Virtual Device"
                >
                  <font-awesome-icon :icon="['fas', 'cloud']" />
                  <span class="uk-hidden@m">Virtual Device</span>
                </div>
                <div v-else class="uk-text-danger" uk-tooltip="Unavailable">
                  <font-awesome-icon :icon="['fas', 'close']" />
                  <span class="uk-hidden@m">Unavailable</span>
                </div>
              </td>
              <td class="uk-visible@m">
                <span v-if="device.slot">
                  {{ device.slot.label }}
                </span>
              </td>
              <td>
                <font-awesome-icon
                  class="uk-preserve-width uk-visible@m"
                  :icon="['fas', 'chevron-right']"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <DeviceDetails device="device" ref="deviceDetailsOffcanvas" />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import DeviceHelper from "@/helpers/DeviceHelper.mjs";
import DeviceDetails from "@/components/DeviceDetails.vue";

export default {
  name: "ListView",
  components: { DeviceDetails, FontAwesomeIcon },
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  data() {
    return {
      devices: [],
    };
  },
  async mounted() {
    await this.getDevices(20, 0);
  },
  methods: {
    async getDevices(limit, offset) {
      this.devices = await DeviceHelper.getDevices(limit, offset);
    },
    handleDeviceSelected(device) {
      this.$refs.deviceDetailsOffcanvas.show(device);
    },
  },
};
</script>

<style scoped></style>
