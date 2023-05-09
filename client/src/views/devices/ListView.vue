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
            class="uk-table uk-table-divider uk-table-middle uk-table-justify"
          >
            <thead>
              <th>Manufacturer</th>
              <th>Model</th>
              <th class="uk-text-center@m">Type</th>
              <th class="uk-text-center@m">Availability</th>
              <th>Added</th>
            </thead>
            <tbody>
              <tr v-for="d of devices" :key="d.id">
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
                <td class="uk-width-1-2">{{ d.name }}</td>
                <td
                  class="uk-text-center@m"
                  :data-type="d.device_type_name"
                  :uk-tooltip="d.device_type_name"
                >
                  <font-awesome-icon :icon="'fas fa-' + d.device_type_icon" />
                </td>
                <td class="uk-text-center@m">
                  <span
                    v-if="!d.checked_out_by && d.slot_id"
                    class="uk-text-success"
                    uk-tooltip="Available"
                  >
                    <font-awesome-icon :icon="['fas', 'check']" />
                  </span>
                  <span
                    class="uk-text-primary"
                    v-else-if="!d.slot_id"
                    uk-tooltip="Virtual Device"
                    ><font-awesome-icon :icon="['fas', 'cloud']"
                  /></span>
                  <span v-else class="uk-text-danger" uk-tooltip="Unavailable">
                    <font-awesome-icon :icon="['fas', 'times']" />
                  </span>
                </td>
                <td>
                  {{
                    new Date(d.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  }}
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
