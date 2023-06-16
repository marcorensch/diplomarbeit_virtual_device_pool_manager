<template>
  <div v-if="device" id="device-details" uk-offcanvas="flip: true">
    <div class="uk-offcanvas-bar uk-padding-remove">
      <button class="uk-offcanvas-close" type="button" uk-close></button>
      <div id="offcanvas-content" v-if="device">
        <div class="uk-padding-small">
          <div
            class="uk-child-width-expand uk-grid-small uk-padding-small"
            uk-grid
          >
            <div class="uk-width-1-1 uk-width-1-3@m">
              <div id="device-image">
                <img v-if="device.image" :src="device.image" alt="" />
                <font-awesome-icon
                  v-else
                  :icon="['fas', device.device_type_icon]"
                />
              </div>
            </div>
            <div>
              <div
                class="uk-h2 nxd-text-navy uk-margin-top uk-margin-remove-bottom"
              >
                {{ device.manufacturer_name }}
              </div>
              <div class="uk-h2 nxd-text-navy uk-margin-remove uk-text-light">
                {{ device.name }}
              </div>
              <table class="uk-table uk-table-divider uk-table-small uk-table-middle uk-table-justify">
                <tbody>
                  <tr>
                    <th class="uk-table-shrink">
                      <span class="nxd-text-navy">Location:</span>
                    </th>
                    <td>
                      <span v-if="device.slot">{{ device.slot.label }}</span>
                      <span v-else>Virtual Device</span>
                    </td>
                  </tr>
                  <tr v-if="device.slot">
                    <th class="uk-table-middle">
                      <span class="nxd-text-navy">Availability:</span>
                    </th>
                    <td>
                      <div v-if="device.checked_out_by">
                        <template
                          v-if="device.checked_out_by === authStore.getUser?.id"
                        >
                          <span class="uk-text-meta">Checked out by you</span>
                          <button
                            class="uk-margin-small-left uk-button uk-button-small uk-button-secondary uk-display-inline-block uk-width-auto"
                            @click="showCheckInConfirm"
                          >
                            CheckIn
                          </button>
                        </template>
                        <template v-else>
                          <div class="nxd-no-select" :class="{'nxd-cursor-help': authStore.getUser}">
                            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="uk-preserve-width uk-text-warning" />
                            <span class="uk-margin-small-left uk-margin-small-right">
                              Checked out
                            </span>
                          </div>
                          <div v-if="authStore.getUser" uk-drop>
                            <div class="uk-card uk-card-default uk-card-body uk-card-small">
                              <div class="uk-text-bold nxd-text-navy">
                                Checked out by {{ checkedOutByString }}
                              </div>
                              <div>
                                {{ createDateTimeString(device.checkout_time) }} o'clock
                              </div>
                              <div class="uk-margin-small-top">
                                <div class="uk-text-bold nxd-text-navy">
                                  Notes:
                                </div>
                                <div class="uk-text-break nxd-max-height-small uk-overflow-auto">
                                  {{ device.checkout_notes }}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button v-if="canCheckIn" @click="showCheckInConfirm"
                            class="uk-button uk-button-small uk-button-secondary uk-display-inline-block uk-width-auto"
                          >
                            CheckIn
                          </button>
                        </template>
                      </div>
                      <div v-else>
                        <font-awesome-icon :icon="['fas', 'check-circle']" class="uk-preserve-width uk-text-success" />
                        <span class="uk-margin-small-left uk-margin-small-right">
                          Available
                        </span>
                        <button v-if="canSeeCheckoutOption()" @click="showCheckoutModal"
                          class="uk-button uk-button-small uk-button-secondary uk-display-inline-block uk-width-auto">
                          Checkout
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <span class="nxd-text-navy">Added: </span>
                    </th>
                    <td>
                      <span>{{ createDateString(device.added) }}</span>
                    </td>
                  </tr>
                  <tr v-if="imeis.length">
                    <th><span class="nxd-text-navy">IMEI:</span></th>
                    <td>
                      <div v-for="(imei, index) of imeis" :key="index">
                        {{ imei.imei }}
                      </div>
                    </td>
                  </tr>
                <tr v-if="device.msisdns?.length">
                  <th class="uk-table-shrink">
                    <span class="nxd-text-navy">MSISDN:</span>
                  </th>
                  <td>
                    <div v-for="msisdn of device.msisdns" :key="msisdn.id" :uk-tooltip="msisdn.sim_number">
                      <span>{{ msisdn.msisdn }}</span>
                      <font-awesome-icon @click="handleCopy(msisdn.sim_number)" uk-tooltip="Copy ICCID (SIM Number)" class="uk-margin-small-left uk-preserve-width nxd-text-navy nxd-cursor-pointer" :icon="['fas','sim-card']" />
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div id="device-details-inner" uk-height-viewport="expand: true">
            <div class="uk-margin">
              <h3>Documents</h3>
              <div v-if="device.documents.length === 0">
                <span>No documents</span>
              </div>
              <table v-else class="uk-table uk-table-divider uk-table-hover uk-table-small">
                <tbody>
                    <tr v-for="doc of device.documents" :key="doc.id" class="uk-position-relative">
                      <td class="uk-position-relative">
                        <a
                          :href="'public/' + doc.uri"
                          target="_blank"
                          class="uk-position-cover"
                          :title="doc.name"
                        ></a>
                        <font-awesome-icon
                          :icon="['fas', 'file']"
                          class="uk-margin-small-right"
                        />
                        {{ doc.name }}
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
            <div class="uk-margin">
              <h3>Links</h3>
              <table class="uk-table uk-table-divider uk-table-hover">
                <tbody>
                  <tr class="uk-position-relative" v-if="['Smartphone', 'Simple Phone', 'Tablet'].includes(device.device_type_name)">
                    <td class="uk-position-relative uk-width-expand">
                      <span uk-tooltip="Search Device on kimovil to see technical details">
                        Search Device on kimovil
                      </span>
                      <a target="_blank" :title="'Search ' + device.name + ' on kimovil'" class="uk-position-cover" :href="buildKimovilLink(device)"></a>
                    </td>
                    <td class="uk-position-relative uk-table-shrink">
                      <font-awesome-icon class="uk-preserve-width" :icon="['fas', 'arrow-up-right-from-square']" />
                      <a target="_blank" :title="'Search ' + device.name + ' on kimovil'" class="uk-position-cover" :href="buildKimovilLink(device)"></a>
                    </td>
                  </tr>
                  <template v-for="link of device.weblinks" :key="link.id">
                    <tr class="uk-position-relative">
                      <td class="uk-position-relative uk-width-expand">
                        <span :uk-tooltip="link.description">{{ link.name }}</span>
                        <a :href="link.uri" :title="link.uri" class="uk-position-cover" target="_blank"></a>
                      </td>
                      <td class="uk-position-relative uk-table-shrink">
                        <font-awesome-icon class="uk-preserve-width" :icon="['fas', 'arrow-up-right-from-square']" />
                        <a :href="link.uri" :title="link.uri" class="uk-position-cover" target="_blank"></a>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <div class="uk-position-relative uk-margin-small-top uk-flex uk-flex-right" v-if="authStore.hasPermission('canCreateLinks')">
                <a href="#" @click="showAddWeblinkModal(device)">
                  <font-awesome-icon :icon="['fas', 'plus']" /> Add Weblink
                </a>
              </div>
            </div>
            <div class="uk-margin">
              <h3>GuideMe</h3>
              <table class="uk-table uk-table-divider uk-table-hover uk-table-small">
                <tbody>
                <tr v-for="guide of device.guides" :key="guide.id" class="uk-position-relative">
                  <td class="uk-width-expand">{{guide.name}}</td>
                  <td class="uk-table-shrink">
                    <font-awesome-icon class="uk-preserve-width" :icon="['fas', 'arrow-up-right-from-square']" />
                    <router-link :to="{'name': 'guide-front', params:{id: guide.id}}" class="uk-position-cover" target="_blank" />
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="uk-margin" v-if="device.notes">
              <h3>Notes</h3>
              <div v-html="device.notes"></div>
            </div>
          </div>
          <div
            class="uk-position-fixed uk-position-bottom-right device-edit-container"
            v-if="showEditBtn"
          >
            <div
              class="nxd-background-horizon uk-padding-small uk-flex uk-flex-right"
              uk-scrollspy="cls: uk-animation-slide-bottom-small; repeat: true; delay:200"
            >
              <button
                class="uk-button uk-button-primary"
                @click="showDeviceEdit(device.id)"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="authStore.hasPermission('canCreateLinks')">
      <div id="add-weblink-modal" class="uk-flex-top" uk-modal="stack:true">
        <div class="uk-modal-dialog uk-margin-auto-vertical">
          <button
            class="uk-modal-close-default"
            type="button"
            uk-close
          ></button>
          <div class="uk-modal-header">
            <h3 class="uk-modal-title">Add Weblink</h3>
          </div>
          <div class="uk-modal-body">
            <div class="uk-form">
              <div class="uk-margin">
                <label for="name" class="uk-form-label"
                  >Label
                  <input
                    type="text"
                    ref="labelInput"
                    name="name"
                    id="name"
                    class="uk-input"
                    placeholder="Label"
                    v-model="linkForm.name"
                    @input="v$.linkForm.name.$touch()"
                    @blur="v$.linkForm.name.$touch()"
                  />
                </label>
                <div
                  v-for="error of v$.linkForm.name.$errors"
                  :key="error"
                  class="uk-text-danger"
                >
                  {{ error.$message }}
                </div>
              </div>
              <div class="uk-margin">
                <label for="uri" class="uk-form-label"
                  >URI
                  <input
                    type="url"
                    name="uri"
                    id="uri"
                    class="uk-input"
                    placeholder="https://www.website.tld"
                    v-model="linkForm.uri"
                    @input="v$.linkForm.uri.$touch()"
                    @blur="v$.linkForm.uri.$touch()"
                  />
                </label>
                <div
                  v-for="error of v$.linkForm.uri.$errors"
                  :key="error"
                  class="uk-text-danger"
                >
                  {{ error.$message }}
                </div>
              </div>
              <div class="uk-margin">
                <label for="description"
                  >Description
                  <textarea
                    name="description"
                    id="description"
                    class="uk-textarea"
                    placeholder="What can we find on this website?"
                    v-model="linkForm.description"
                  ></textarea>
                </label>
              </div>
            </div>
          </div>
          <div class="uk-modal-footer">
            <div class="uk-flex uk-flex-right@m uk-grid-small" uk-grid>
              <div class="uk-width-1-1 uk-width-auto@m">
                <button
                  class="uk-width-1-1 uk-button uk-button-secondary uk-modal-close"
                  type="button"
                >
                  Cancel
                </button>
              </div>
              <div class="uk-width-1-1 uk-width-auto@m">
                <button
                  class="uk-width-1-1 uk-button uk-button-primary"
                  type="button"
                  @click="handleSaveLinkClicked"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div :ref="'checkout-modal-' + device.id" uk-modal="stack:true">
      <div class="uk-modal-dialog">
        <div class="uk-modal-header">
          <h3 class="uk-modal-title">Device Checkout</h3>
        </div>
        <div class="uk-modal-body">
          <p>Are you sure you want to checkout this device?</p>
          <textarea
            name="checkout-notes"
            id="checkout-notes"
            cols="30"
            rows="10"
            placeholder="For longer checkout periods please leave more information here"
            class="uk-textarea"
          ></textarea>
        </div>
        <div class="uk-modal-footer">
          <div
            class="uk-grid-small uk-flex uk-flex-right@m uk-child-width-1-1 uk-child-width-auto@m"
            uk-grid
          >
            <div>
              <button
                class="uk-button uk-button-secondary uk-modal-close uk-width-1-1"
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                class="uk-button uk-button-primary uk-width-1-1"
                @click="handleConfirmCheckoutClicked"
              >
                Checkout
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
import { useAuthStore } from "@/stores/auth";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, url } from "@vuelidate/validators";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useToast} from "vue-toastification";

function linkAlreadySet(value) {
  return !this.device.weblinks.some((link) => link.uri === value);
}

function nameAlreadySet(value) {
  return !this.device.weblinks.some((link) => link.name === value);
}

export default {
  name: "DeviceDetails",
  components: {FontAwesomeIcon},
  setup() {
    const authStore = useAuthStore();
    const toast = useToast();
    const v$ = useVuelidate();
    return { authStore, v$, toast };
  },
  data() {
    return {
      device: null,
      imeis: [],
      showEditBtn: false,
      checkedOutByString: "",
      linkForm: {
        name: "",
        uri: "",
        description: "",
      },
    };
  },
  validations() {
    return {
      linkForm: {
        name: {
          required,
          nameAlreadySet: helpers.withMessage(
            "Name already set",
            nameAlreadySet
          ),
        },
        uri: {
          required,
          url,
          alreadySet: helpers.withMessage("Link already set", linkAlreadySet),
        },
      },
    };
  },
  computed: {
    canCheckIn() {
      if (!this.authStore.getUser) return false;
      if (
        this.device.checked_out_by === this.authStore.getUser.id ||
        this.authStore.hasPermission("canForceCheckinDevices")
      )
        return true;
      return false;
    },
  },
  mounted() {},
  methods: {
    handleCopy(valueToCopy) {
      try {
        navigator.clipboard.writeText(valueToCopy);
        this.toast("Copied to clipboard");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    },
    canSeeCheckoutOption() {
      if (!this.authStore.getUser) return false;
      return !!this.authStore.hasPermission("canCheckoutInDevices");
    },
    showCheckInConfirm() {
      UIkit.modal.confirm(
          "Please confirm that the device is back in the device pool & plugged in.",
          {
            labels: { ok: "Yes", cancel: "No" },
            stack: true,
          }
        )
        .then(
          () => {
            this.handleCheckInConfirmed();
          },
          () => {
            //cancel confirmation
          }
        );
    },
    showCheckoutModal() {
      const modalRef = this.$refs[`checkout-modal-${this.device.id}`];
      UIkit.modal(modalRef).show();
    },

    async handleCheckInConfirmed() {
      const response = await axios.post(
        `/api/devices/${this.device.id}/checkin`
      );
      if (response.status === 200) {
        this.device.checked_out_by = null;
        this.device.checkout_time = null;
        this.device.checkout_notes = null;
      }
    },
    async handleConfirmCheckoutClicked() {
      const modalRef = this.$refs[`checkout-modal-${this.device.id}`];
      const notes = document.getElementById("checkout-notes").value;
      const response = await axios.post(
        `/api/devices/${this.device.id}/checkout`,
        {
          notes,
        }
      );
      if (response.status === 200) {
        this.device.checked_out_by = response.data.checked_out_by;
        this.device.checkout_time = response.data.checkout_time;
        this.device.checkout_notes = response.data.checkout_notes;
      }
      UIkit.modal(modalRef).hide();
    },
    canEditDevice() {
      if (this.device.slot_id) {
        return !!this.authStore.hasPermission("canUpdateDevices");
      } else {
        return !!this.authStore.hasPermission("canUpdateVirtualDevices");
      }
    },
    createDateString(date) {
      return new Date(date).toLocaleDateString(navigator.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    createDateTimeString(date) {
      return new Date(date).toLocaleDateString(navigator.language, {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
      });
    },
    show(device) {
      this.checkedOutByString = device.checkout_fullname?.trim().length > 0 ? device.checkout_fullname.trim() : device.checkout_username;
      this.imeis = [];
      this.device = device;
      this.showEditBtn = this.canEditDevice();
      try {
        this.imeis = JSON.parse(this.device.imei) || [];
      } catch (e) {
        console.log(e);
      }
      this.$nextTick(() => {
        UIkit.offcanvas("#device-details").show();
      });
    },
    showDeviceEdit(id) {
      this.$router.push({ name: "edit-device", params: { id: id } });
    },
    buildKimovilLink(device) {
      let url = "https://www.kimovil.com/en/";
      if (
        device.device_type_name === "Smartphone" ||
        device.device_type_name === "Simple Phone"
      ) {
        url += "compare-smartphones/";
      } else if (device.device_type_name === "Tablet") {
        url += "tablets/";
      }
      url += `name.${device.name.toLowerCase()}`;
      if (device.manufacturer_name)
        url += `,i_b+slug.${device.manufacturer_name.toLowerCase()}`;
      return url;
    },
    showAddWeblinkModal() {
      this.v$.$reset();
      UIkit.modal("#add-weblink-modal").show();
    },
    async handleSaveLinkClicked() {
      const formIsValid = await this.v$.$validate();
      if (!formIsValid) return;
      const storeWeblink = await axios.post(
        `/api/devices/${this.device.id}/weblinks`,
        this.linkForm
      );
      if (storeWeblink.data.success) {
        this.device.weblinks.push(this.linkForm);
        this.linkForm = {
          name: "",
          uri: "",
          description: "",
        };
        this.v$.$reset();
        UIkit.modal("#add-weblink-modal").hide();
      }
    },
  },
};
</script>

<style lang="less">
@import "@/assets/less/buttons.less";
@import "@/assets/less/components/device-details-offcanvas.less";
</style>
