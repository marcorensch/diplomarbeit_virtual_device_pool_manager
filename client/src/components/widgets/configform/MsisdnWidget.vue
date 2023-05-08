<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-header">
      <h3 class="uk-card-title">Linked MSISDN's</h3>
    </div>
    <div class="uk-card-body">
      <ul class="uk-list uk-list-divider uk-list-small">
        <template v-for="(msisdn, index) of msisdns" :key="msisdn.id">
          <li
            v-if="msisdnIsSelected(msisdn.id)"
            :class="{ 'uk-margin-small-top': index > 0 }"
          >
            {{ msisdn.msisdn }}
          </li>
        </template>
      </ul>
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
          <table class="uk-table uk-table-divider">
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
                      :checked="msisdn.selected"
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
                    @click="handleMsisdnClicked(msisdn, md)"
                  >
                    <td>
                      <input
                        type="checkbox"
                        class="uk-checkbox"
                        :checked="msisdn.selected"
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
        <div class="uk-modal-footer">
          <div class="uk-flex uk-flex-right@m uk-grid-small">
            <div>
              <button class="uk-button uk-button-secondary uk-modal-close">
                Cancel
              </button>
            </div>
            <div>
              <button class="uk-button uk-button-primary uk-modal-close">
                Select
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

export default {
  name: "MsisdnWidget",
  data() {
    return {
      deviceEditStore: useDeviceEditStore(),
      msisdns: [],
    };
  },
  methods: {
    handleMsisdnClicked(main, md = null) {
      console.log(main, md);
    },
    msisdnIsSelected(msisdnId) {
      return this.deviceEditStore.getDevice.msisdns.some(
        (msisdn) => msisdn.id === msisdnId
      );
    },
    showMsisdnModal() {
      UIkit.modal("#msisdn-modal").show();
      this.updateMsisdns();
    },
    async updateMsisdns() {
      await this.deviceEditStore.setAvailableMSISDNs();
      this.msisdns = this.deviceEditStore.availableMSISDNs.map((msisdn) => {
        msisdn.selected = this.msisdnIsSelected(msisdn.id);
        return msisdn;
      });
    },
  },
};
</script>

<style scoped></style>
