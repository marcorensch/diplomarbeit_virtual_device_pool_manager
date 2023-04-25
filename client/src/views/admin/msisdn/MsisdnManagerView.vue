<template>
  <div class="uk-section uk-section-small">
    <div class="uk-container">
      <h1>MSISDN Manager</h1>
      <div
        class="actions uk-background-muted uk-border-rounded uk-padding-small"
      >
        <div class="uk-flex">
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
          <div class="uk-width-expand">
            <div class="uk-flex uk-flex-right uk-flex-middle uk-grid-small">
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
      <div class="uk-margin uk-card uk-card-default uk-card-small">
        <div class="uk-card-body uk-position-relative">
          <div class="uk-overflow-auto">
            <table class="uk-table uk-table-striped">
              <thead>
                <th>MSISDN</th>
                <th>
                  <span class="uk-hidden@m">Abo</span>
                  <span class="uk-visible@m">Abonnement</span>
                </th>
                <th class="uk-text-nowrap">
                  SIM <span class="uk-visible@m">Type</span>
                </th>
                <th class="uk-text-nowrap">In Use</th>
                <th class="uk-visible@m">Device</th>
                <th class="">Actions</th>
              </thead>
              <tbody v-if="numbers.length">
                <tr v-for="number of numbers" :key="number.id">
                  <td>{{ number.msisdn }}</td>
                  <td class="uk-text-nowrap">{{ number.abonnement }}</td>
                  <td>{{ number.simTypeName }}</td>
                  <td>
                    <span :uk-tooltip="number.deviceName">{{
                      number.in_use
                    }}</span>
                  </td>
                  <td class="uk-visible@m">{{ number.deviceName }}</td>
                  <td>
                    <div class="uk-button-group">
                      <button
                        class="uk-button uk-button-default uk-button-small"
                        style="min-width: 0"
                        @click="handleEditMsisdnClicked(number.id)"
                      >
                        <font-awesome-icon
                          class="uk-preserve-width"
                          :icon="['fas', 'pencil']"
                        />
                      </button>
                      <button
                        class="uk-button uk-button-default uk-button-small"
                        style="min-width: 0"
                        @click="handleDeleteMsisdnClicked(number.id)"
                      >
                        <font-awesome-icon
                          class="uk-preserve-width"
                          :icon="['fas', 'trash']"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MsisdnManagerView",
  data() {
    return {
      search_msisdn: "",
      numbers: [],
    };
  },
  mounted() {
    this.getMsisdnList();
  },
  methods: {
    getMsisdnList() {
      axios
        .get("/api/admin/numbers")
        .then((response) => {
          console.log(response.data);
          this.numbers = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleAddMsisdnClicked() {
      this.$router.push({ name: "msisdn-add" });
    },
    filterMsisdnList() {
      console.log("filtering msisdn list");
    },
    handleClearSearchMsisdnClicked() {
      this.search_msisdn = "";
    },
    handleEditMsisdnClicked(id) {
      this.$router.push({ name: "msisdn-edit", params: { id } });
    },
    handleDeleteMsisdnClicked(id) {
      axios
        .delete("/api/admin/numbers/" + id)
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
