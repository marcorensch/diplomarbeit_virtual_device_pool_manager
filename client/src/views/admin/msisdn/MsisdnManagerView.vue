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
      <div
        v-for="number of numbers"
        :key="number.id"
        class="uk-margin uk-card uk-card-default uk-card-small"
      >
        <div class="uk-position-relative" uk-grid>
          <div class="uk-width-expand">
            <div class="uk-card-header">
              <h3>{{ number.abonnement }}</h3>
              <span>SCN: {{ number.scn }}</span>
            </div>
            <div class="uk-card-body uk-position-relative">
              <div
                class="uk-child-width-1-1 uk-child-width-1-3@m uk-grid-small"
                uk-grid
              >
                <div>
                  <b>MSISDN:</b><br />
                  {{ number.msisdn }}
                </div>
                <div>
                  <div>
                    <b>SIM Card:</b>
                  </div>
                  <div>{{ number.sim_number }} ({{ number.simTypeName }})</div>
                </div>
                <div
                  class="uk-width-1-1 uk-margin"
                  v-if="number.multi_device.length"
                >
                  <div class="uk-text-bold">Multi Device:</div>
                  <ul
                    :class="'md_list_' + number.id"
                    class="uk-list uk-list-divider uk-text-small uk-margin-remove-top"
                  >
                    <li
                      v-for="md of number.multi_device"
                      class="multidevice-item"
                      :key="md.id"
                    >
                      <div
                        class="uk-flex uk-flex-middle uk-grid-small uk-position-relative"
                      >
                        <div class="uk-width-expand">
                          {{ md.sim_number }} ({{ md.simTypeName }})
                        </div>
                        <div>
                          <font-awesome-icon
                            class=""
                            :icon="['fas', 'chevron-right']"
                          />
                        </div>
                        <router-link
                          class="uk-position-cover uk-position-z-index"
                          :to="{ name: 'msisdn-edit', params: { id: md.id } }"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="uk-width-auto uk-flex uk-flex-middle">
            <div class="uk-padding-small">
              <font-awesome-icon
                class="uk-margin-small-right"
                :icon="['fas', 'chevron-right']"
                size="2x"
              />
            </div>
          </div>
          <router-link
            class="uk-position-cover"
            :to="{ name: 'msisdn-edit', params: { id: number.id } }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "MsisdnManagerView",
  components: { FontAwesomeIcon },
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
