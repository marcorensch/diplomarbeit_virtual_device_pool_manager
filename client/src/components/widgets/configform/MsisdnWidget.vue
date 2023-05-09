<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-header">
      <h3 class="uk-card-title">Linked MSISDN's</h3>
    </div>
    <div class="uk-card-body">
      <table
        v-if="selectedMsisdns"
        class="uk-table uk-table-divider uk-table-responsive"
      >
        <thead>
          <th>MSISDN</th>
          <th>Abonnement</th>
          <th class="uk-text-center">Notes</th>
          <th class="uk-text-center">Hidden</th>
        </thead>
        <tbody>
          <tr v-for="msisdn of selectedMsisdns" :key="msisdn.id">
            <td>
              <span class="uk-text-secondary">{{ msisdn.msisdn }}</span>
            </td>
            <td>
              <div v-if="msisdn.abonnement">{{ msisdn.abonnement }}</div>
              <div v-else-if="msisdn.mainAbonnement">
                <span>{{ msisdn.mainAbonnement }}</span>
                <br />
                <span class="uk-text-small"
                  >MultiDevice of {{ msisdn.mainMsisdn }}</span
                >
              </div>
            </td>
            <td class="uk-text-center@m">
              <font-awesome-icon
                v-if="msisdn.notes"
                :uk-tooltip="msisdn.notes"
                class="uk-preserve-width"
                :icon="['fas', 'note-sticky']"
              />
            </td>
            <td class="uk-text-center@m">
              <font-awesome-icon
                v-if="msisdn.hidden"
                :uk-tooltip="msisdn.hidden"
                class="uk-preserve-width"
                :icon="['fas', 'note-sticky']"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="uk-card-footer">
      <div class="uk-flex uk-flex-right@m">
        <button
          @click="showMsisdnModal"
          class="uk-button uk-button-primary uk-width-1-1 uk-width-auto@m"
        >
          Select
        </button>
      </div>
    </div>
    <div id="msisdn-modal" class="uk-flex-top" uk-modal>
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">Select MSISDN's</h2>
        </div>
        <div class="uk-modal-body">
          <div class="nxd-modal-msisdn-list-container">
            <table
              class="uk-table uk-table-divider uk-table-hover uk-table-responsive"
            >
              <thead>
                <th></th>
                <th>MSISDN</th>
                <th>Abonnement</th>
              </thead>
              <tbody>
                <template
                  v-for="msisdn in deviceEditStore.availableMSISDNs"
                  :key="msisdn.id"
                >
                  <tr @click="handleMsisdnClicked(msisdn)">
                    <td>
                      <input
                        type="checkbox"
                        class="uk-checkbox"
                        :checked="checkIfSelected(msisdn)"
                      />
                    </td>
                    <td>{{ msisdn.msisdn }}</td>
                    <td>{{ msisdn.abonnement }}</td>
                  </tr>
                  <template v-if="msisdn.multi_device.length">
                    <tr
                      class="multi-device-item"
                      v-for="md of msisdn.multi_device"
                      :key="md.id"
                      @click="handleMsisdnClicked(md)"
                    >
                      <td>
                        <input
                          type="checkbox"
                          class="uk-checkbox"
                          :checked="checkIfSelected(md)"
                        />
                      </td>
                      <td>
                        <span class="uk-text-small">{{ md.msisdn }}</span>
                      </td>
                      <td>
                        <span class="uk-text-muted uk-text-small"
                          >Multi Device SIM</span
                        >
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div class="uk-modal-footer">
          <div
            class="uk-child-width-1-1 uk-child-width-auto@s uk-flex uk-flex-right@s uk-grid-small"
            uk-grid
          >
            <div>
              <button
                class="uk-button uk-button-primary uk-width-1-1 uk-modal-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIkit from "uikit";
import { useDeviceEditStore } from "@/stores/deviceEdit";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "MsisdnWidget",
  components: { FontAwesomeIcon },
  data() {
    return {
      deviceEditStore: useDeviceEditStore(),
      selectedMsisdns: [],
    };
  },
  methods: {
    beforeMount() {
      this.updateMsisdns();
    },
    handleMsisdnClicked(msisdn) {
      msisdn.selected = !msisdn.selected;
      if (msisdn.selected) {
        this.deviceEditStore.addMSISDN(msisdn);
      } else {
        this.deviceEditStore.removeMSISDN(msisdn);
      }
      this.selectedMsisdns = this.deviceEditStore.getDevice.msisdns;
    },
    checkIfSelected(msisdn) {
      return this.selectedMsisdns.includes(msisdn);
    },
    showMsisdnModal() {
      UIkit.modal("#msisdn-modal").show();
    },
    async updateMsisdns() {
      await this.deviceEditStore.setAvailableMSISDNs();
    },
  },
};
</script>

<style lang="less" scoped>
.nxd-modal-msisdn-list-container {
  max-height: 400px;
  overflow-y: auto;
}
</style>
