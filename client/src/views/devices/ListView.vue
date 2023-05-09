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
        <div class="uk-card uk-card-default uk-card-body">
          <table
            class="uk-table uk-table-divider uk-table-middle uk-table-justify uk-table-responsive"
          >
            <thead>
              <th>Manufacturer</th>
              <th>Model</th>
              <th class="uk-text-center@m">Type</th>
              <th class="uk-text-center@m">Availability</th>
              <th class="uk-visible@m">Added</th>
              <th class="uk-visible@m"></th>
            </thead>
            <tbody>
              <tr v-for="d of devices" :key="d.id" class="uk-position-relative">
                <td class="uk-width-small">
                  <img
                    v-if="d.manufacturer_logo"
                    class="uk-preserve-width uk-margin-right uk-border-circle"
                    width="32"
                    :src="d.manufacturer_logo"
                    :title="d.manufacturer_name"
                  />
                  <span>{{ d.manufacturer_name }}</span>
                </td>
                <td class="uk-width-1-2">
                  <span @click="showDeviceDetails(d)">{{ d.name }}</span>
                  <font-awesome-icon
                    :icon="['fas', 'pencil']"
                    v-if="authStore.hasPermission('canUpdateDevices')"
                    @click="showDeviceEdit(d.id)"
                  />
                </td>
                <td
                  class="uk-text-center@m"
                  :data-type="d.device_type_name"
                  :uk-tooltip="d.device_type_name"
                >
                  <font-awesome-icon
                    v-if="d.device_type_icon"
                    :icon="['fas', d.device_type_icon]"
                  />
                </td>
                <td class="uk-text-center@m">
                  <div
                    v-if="!d.checked_out_by && d.slot_id"
                    class="uk-text-success"
                    uk-tooltip="Available"
                  >
                    <font-awesome-icon :icon="['fas', 'check']" />
                    <span class="uk-hidden@m">Available</span>
                  </div>
                  <div
                    class="uk-text-primary"
                    v-else-if="!d.slot_id"
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
                  <span v-if="d.added">
                    {{
                      new Date(d.added).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    }}
                  </span>
                </td>
                <td @click="showDeviceDetails(d)">
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
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const toast = useToast();

export default {
  name: "ListView",
  components: { FontAwesomeIcon },
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
  mounted() {
    this.getDevices(20, 0);
  },
  methods: {
    showDeviceDetails(device) {
      this.$router.push({ name: "device-details", params: { id: device.id } });
    },
    showDeviceEdit(id) {
      this.$router.push({ name: "edit-device", params: { id: id } });
    },
    getDevices(limit, offset) {
      if (!limit) {
        limit = 20;
      }
      if (!offset) {
        offset = 0;
      }
      axios
        .get("/api/devices?limit=" + limit + "&offset=" + offset)
        .then((response) => {
          this.devices = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error getting devices");
        });
    },
  },
};
</script>

<style scoped></style>
