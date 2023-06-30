<template>
  <div class="uk-section uk-section-small">
    <div class="uk-container">
      <h1>MSISDN Manager</h1>
      <div class="actions uk-background-muted uk-border-rounded uk-padding-small uk-margin-bottom">
        <div class="uk-flex uk-grid-small">
          <div class="uk-width-auto">
            <button
              class="uk-button uk-button-primary"
              style="min-width: 0"
              @click="handleAddMsisdnClicked"
            >
              <font-awesome-icon :icon="['fas', 'plus']" />
              <span class="uk-visible@m uk-margin-small-left">Add MSISDN</span>
            </button>
          </div>
          <div class="uk-width-expand uk-flex-middle">
            <div class="uk-flex uk-flex-right uk-flex-middle uk-grid-small">
              <div>
                <div class="uk-button-group">
                  <button
                    class="uk-button uk-button-default"
                    :class="{ 'uk-button-primary': layout === 'cards' }"
                    @click="handleLayoutChanged('cards')"
                  >
                    <font-awesome-icon
                      class="uk-preserve-width"
                      :icon="['fas', 'grip-lines']"
                    />
                  </button>
                  <button
                    class="uk-button uk-button-default"
                    :class="{ 'uk-button-primary': layout === 'table' }"
                    @click="handleLayoutChanged('table')"
                  >
                    <font-awesome-icon
                      class="uk-preserve-width"
                      :icon="['fas', 'table-list']"
                    />
                  </button>
                </div>
              </div>
              <div>
                <div
                  class="uk-width-auto uk-width-medium@m uk-position-relative"
                >
                  <input
                    type="text"
                    id="search_msisdn"
                    class="uk-input"
                    placeholder="Filter MSISDNs"
                    v-model="search_msisdn"
                    @keyup="filterMsisdnList"
                  />
                  <div
                    v-if="search_msisdn.length > 0"
                    class="uk-position-center-right clear-search-icon"
                    style="margin-right: 15px"
                    @click="handleClearSearchMsisdnClicked"
                    uk-tooltip="Clear search filter"
                  >
                    <font-awesome-icon :icon="['fas', 'xmark']" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="layout === 'cards'">
        <div v-for="number of numbers" :key="number.id">
          <MsisdnMgrCard :number="number" />
        </div>
      </div>
      <div class="uk-overflow-auto" v-else-if="layout === 'table'">
        <table class="uk-table uk-table-divider">
          <thead>
            <th>MSISDN</th>
            <th>Device</th>
            <th>ICCID</th>
            <th>Abo</th>
            <th class="uk-text-nowrap">Multi Device</th>
            <th></th>
          </thead>
          <tbody>
            <MsisdnMgrRow
              v-for="number of numbers"
              :number="number"
              :key="number.id"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import MsisdnMgrCard from "@/views/admin/msisdn/MsisdnMgrCard.vue";
import MsisdnMgrRow from "@/views/admin/msisdn/MsisdnMgrRow.vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

export default {
  name: "MsisdnManagerView",
  components: { MsisdnMgrRow, MsisdnMgrCard, FontAwesomeIcon },
  data() {
    return {
      toast: useToast(),
      auth: useAuthStore(),
      layout: null,
      search_msisdn: "",
      numbers: [],
    };
  },
  mounted() {
    this.getMsisdnList();
    this.layout = this.auth.getLocalStorageConfig("msisdn_layout", "cards");
  },
  methods: {
    handleLayoutChanged(layout) {
      this.layout = layout;
      this.auth.setLocalStorageConfig("msisdn_layout", layout);
    },
    getMsisdnList() {
      axios
        .get("/api/admin/msisdns")
        .then((response) => {
          response.data.map((number) => {
            number.visible = true;
          });
          this.numbers = response.data;
        })
        .catch((error) => {
          console.log(error.response.status + " " + error.response.statusText);
          this.toast.error("Error");
          if (error.response.status === 401) this.auth.logout();
          this.$router.push({ path: "/" });
        });
    },
    handleAddMsisdnClicked() {
      this.$router.push({ name: "msisdn-add" });
    },
    filterMsisdnList() {
      this.numbers.map((number) => {
        number.visible = this.filterMultiDevice(number) || this.filterChecks(number);
      });
    },
    filterChecks(number) {
      return (
        number.msisdn.includes(this.search_msisdn) ||
        number.abonnement?.toLowerCase().includes(this.search_msisdn.toLowerCase()) ||
        number.sim_number.includes(this.search_msisdn) ||
        number.scn?.includes(this.search_msisdn)
      );
    },
    filterMultiDevice(number) {
      if (number.multi_device.length) {
        return number.multi_device.some((md) => {
          return this.filterChecks(md);
        });
      }
      return false;
    },
    handleClearSearchMsisdnClicked() {
      this.search_msisdn = "";
      this.filterMsisdnList();
    },
    handleEditMsisdnClicked(id) {
      this.$router.push({ name: "msisdn-edit", params: { id } });
    },
    handleDeleteMsisdnClicked(id) {
      axios
        .delete("/api/admin/msisdns/" + id)
        .then(() => {
          this.getMsisdnList();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
