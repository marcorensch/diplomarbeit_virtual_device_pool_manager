<template>
  <div
    class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
  >
    <div
      class="actions uk-grid-small uk-child-width-1-1 uk-child-width-1-2@m"
      uk-grid
    >
      <div>
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
            v-model="searchString"
          />
        </form>
      </div>

      <div>
        <div class="uk-flex uk-flex-right uk-grid-small" uk-grid>
          <div
            class="uk-button uk-button-primary uk-flex uk-flex-middle"
            @click="handleAddDeviceClicked"
            v-if="
              authStore.hasPermission('canCreateDevices') ||
              authStore.hasPermission('canCreateVirtualDevices')
            "
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { required, minLength } from "@vuelidate/validators";

export default {
  name: "devicesActionbar",
  emits: ["create-device", "search"],
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  validations() {
    return {
      searchString: {
        required,
        minLength: minLength(3),
      },
    };
  },
  data() {
    return {
      searchString: "",
    };
  },
  mounted() {
    this.searchString = this.$route.query.search || "";
  },
  methods: {
    handleAddDeviceClicked() {
      this.$emit("create-device");
    },
    async handleSearchSubmit(e) {
      e.preventDefault();
      this.$emit("search", this.searchString);
    },
  },
};
</script>

<style scoped></style>
