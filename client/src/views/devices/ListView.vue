<template>
  <div
    class="uk-section uk-section-small devices-list-view"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container">
      <h1>Pool Devices</h1>
      <DevicesActionbar
        @createDevice="handleCreateDeviceClicked"
        @search="handleNewSearchRequest"
      />

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
                  <span class="uk-hidden@m uk-margin-small-left"
                    >Available</span
                  >
                </div>
                <div
                  class="uk-text-primary"
                  v-else-if="!device.slot_id"
                  uk-tooltip="Virtual Device"
                >
                  <font-awesome-icon :icon="['fas', 'cloud']" />
                  <span class="uk-hidden@m uk-margin-small-left"
                    >Virtual Device</span
                  >
                </div>
                <div v-else class="uk-text-danger" uk-tooltip="Unavailable">
                  <font-awesome-icon :icon="['fas', 'close']" />
                  <span class="uk-hidden@m uk-margin-small-left"
                    >Unavailable</span
                  >
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
    <PaginationWidget
      :total_count="total_count"
      :default_page_size="limit"
      :updateTrigger="updateTrigger"
      @pageChange="handlePageChange"
      @pageSizeChange="handlePageSizeChanged"
    />
    <DeviceDetails device="device" ref="deviceDetailsOffcanvas" />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToast } from "vue-toastification";
import DeviceHelper from "@/helpers/DeviceHelper.mjs";
import DeviceDetails from "@/components/devices/DeviceDetails.vue";
import DevicesActionbar from "@/components/devices/devicesActionbar.vue";
import PaginationWidget from "@/components/widgets/PaginationWidget.vue";

export default {
  name: "ListView",
  components: {
    PaginationWidget,
    DevicesActionbar,
    DeviceDetails,
    FontAwesomeIcon,
  },
  setup() {
    const authStore = useAuthStore();
    const toast = useToast();
    return {
      authStore,
      toast,
    };
  },
  data() {
    return {
      devices: [],
      limit: 20,
      offset: 0,
      filters: {},
      total_count: 0,
      updateTrigger: 0,
    };
  },
  async mounted() {},
  methods: {
    handlePageChange(page) {
      this.offset = (page - 1) * this.limit;
      this.getDevices();
      this.updateTrigger++;
    },
    handlePageSizeChanged(pageSize) {
      this.offset = 0;
      this.limit = pageSize;
      this.getDevices();
      this.updateTrigger++;
    },
    async getDevices() {
      const data = await DeviceHelper.getDevices(
        this.limit,
        this.offset,
        this.filters
      );
      this.devices = data.devices;
      this.total_count = data.total_count;
      console.log(this.devices)
    },
    handleDeviceSelected(device) {
      this.$refs.deviceDetailsOffcanvas.show(device);
    },
    handleCreateDeviceClicked() {
      this.$router.push({ name: "create-device" });
    },
    async handleNewSearchRequest(filters) {
      this.offset = 0;
      if (filters.search.trim().length && filters.search.trim().length < 3) {
        this.toast.warning("Search term should be at least 3 characters long");
        filters.search = "";
      }
      this.filters = filters;

      await this.getDevices();
    },
  },
};
</script>

<style scoped></style>
