<template>
  <div
    class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
  >
    <div
      class="actions uk-grid-small uk-child-width-1-1 uk-child-width-auto@m"
      uk-grid
    >
      <div>
        <div class="uk-grid-small" uk-grid>
          <div class="uk-width-1-1 uk-width-medium@m">
            <form
              class="uk-search uk-search-default uk-width-1-1"
              @submit="handleSearchSubmit"
            >
              <span class="uk-search-icon-flip" uk-search-icon></span>
              <input
                class="uk-search-input uk-width-1-1 uk-border-rounded"
                type="search"
                placeholder="Search Devices"
                aria-label="Search Devices"
                ref="search"
                v-model="form.search"
                uk-tooltip="Search (ctrl + f)"
              />
            </form>
          </div>
          <div class="uk-width-1-1 uk-width-medium@m">
            <select
              name="type_selection"
              id="type_selection"
              class="uk-select uk-width-1-1 uk-border-rounded"
              ref="type"
              v-model="form.type"
              uk-tooltip="Type (ctrl + t)"
              @change="handleSearchSubmit"
            >
              <option value="">Type</option>
              <option
                v-for="deviceType in deviceTypes"
                :key="deviceType.id"
                :value="deviceType.id"
              >
                {{ deviceType.name }}
              </option>
            </select>
          </div>
          <div class="uk-width-1-1 uk-width-small@m">
            <select
              name="availability_selection"
              id="availability_selection"
              class="uk-select uk-width-1-1 uk-border-rounded"
              ref="availability"
              v-model="form.availability"
              uk-tooltip="Availability (ctrl + a)"
              @change="handleSearchSubmit"
            >
              <option value="" selected>Availability</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>
      </div>

      <div class="uk-width-expand">
        <div
          class="uk-flex uk-flex-right uk-grid-small uk-grid-divider"
          uk-grid
        >
          <div>
            <div class="uk-button-group">
              <button
                class="uk-button uk-button-default uk-flex uk-flex-middle"
                @click="handleClrFilterClicked"
                uk-tooltip="Clear Filter (ctrl + del)"
              >
                <font-awesome-icon :icon="['fas', 'rotate']" />
              </button>
              <button
                class="uk-button uk-button-default uk-flex uk-flex-middle"
                @click="handleSearchSubmit"
                uk-tooltip="Search (return)"
              >
                <font-awesome-icon :icon="['fas', 'search']" />
              </button>
            </div>
          </div>
          <div
            v-if="
              authStore.hasPermission('canCreateDevices') ||
              authStore.hasPermission('canCreateVirtualDevices')
            "
          >
            <button
              class="uk-button uk-button-primary uk-flex uk-flex-middle"
              @click="handleAddDeviceClicked"
              uk-tooltip="Add Device (ctrl + n)"
            >
              <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import DeviceHelper from "@/helpers/DeviceHelper.mjs";

export default {
  name: "devicesActionbar",
  components: { FontAwesomeIcon },
  emits: ["create-device", "search"],
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  data() {
    return {
      form: {
        type: "",
        availability: "",
        search: "",
      },
      deviceTypes: [],
    };
  },
  async mounted() {
    document.body.addEventListener("keydown", this.handleKeyDown);
    this.form.search = this.$route.query.search || "";
    this.$emit("search", this.form);
    await this.getDeviceTypes();
  },
  methods: {
    handleKeyDown(e) {
      if (e.key === "Backspace" || (e.key === "Delete" && e.ctrlKey)) {
        this.handleClrFilterClicked();
      }
      if (e.key === "Enter") {
        this.handleSearchSubmit(e);
      }
      if (e.key === "n" && e.ctrlKey) {
        this.handleAddDeviceClicked();
      }
      if (e.key === "f" && e.ctrlKey) {
        this.$refs.search.focus();
      }
      if (e.key === "t" && e.ctrlKey) {
        this.$refs.type.focus();
      }
      if (e.key === "a" && e.ctrlKey) {
        this.$refs.availability.focus();
      }
    },
    handleClrFilterClicked() {
      this.form.search = "";
      this.form.type = "";
      this.form.availability = "";
      this.$emit("search", this.form);
    },
    handleAddDeviceClicked() {
      this.$emit("create-device");
    },
    async handleSearchSubmit(e) {
      e.preventDefault();
      this.$emit("search", this.form);
    },
    async getDeviceTypes() {
      this.deviceTypes = await DeviceHelper.getDeviceTypes();
    },
  },
};
</script>

<style scoped></style>
