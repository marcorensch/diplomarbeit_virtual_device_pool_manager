<template>
  <div
    class="uk-section uk-section-small devices-search-view"
    uk-height-viewport="offset-top:true; offset-bottom: true"
  >
    <div class="uk-position-cover uk-flex uk-flex-center uk-flex-middle">
      <div
        class="uk-width-1-1 uk-width-large@s uk-width-2-3@m uk-padding-large"
      >
        <div class="uk-position-relative">
          <input type="search" id="nxd-device-search" v-model="searchString" />
          <div class="uk-position-center-right uk-padding">
            <font-awesome-icon
              :icon="['fas', 'search']"
              placeholder="Search Devices"
              class="fa-2x uk-text-muted nxd-cursor-pointer"
              @click="switchToDevicesList"
            />
          </div>
        </div>

        <div
          class="uk-margin-small-top uk-child-width-1-1 uk-child-width-auto@s uk-flex uk-flex-right@s uk-grid-small"
          uk-grid
        >
          <div>
            <button
              class="uk-button uk-button-primary uk-width-1-1"
              @click="switchToDevicesList(false)"
            >
              Devices List
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "SearchView",
  components: { FontAwesomeIcon },
  data() {
    return {
      searchString: "",
    };
  },
  mounted() {
    const search = document.getElementById("nxd-device-search");
    search.focus();
    search.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        this.switchToDevicesList(true);
      }
    });
  },
  methods: {
    switchToDevicesList(search = false) {
      const query = search ? { search: this.searchString } : null;
      this.$router.push({
        name: "devices",
        query,
      });
    },
  },
};
</script>

<style scoped></style>
