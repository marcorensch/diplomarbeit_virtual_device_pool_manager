<template>
  <div v-if="device" id="device-details" uk-offcanvas="flip: true">
    <div class="uk-offcanvas-bar">
      <button class="uk-offcanvas-close" type="button" uk-close></button>
      <div id="offcanvas-content" v-if="device">
        <div class="uk-child-width-expand uk-grid-small" uk-grid>
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
            <table
              class="uk-table uk-table-divider uk-table-small uk-table-middle uk-table-justify uk-table-align-top"
            >
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
                          class="uk-button uk-button-small uk-button-secondary uk-display-inline-block uk-width-auto"
                          @click="showCheckInConfirm"
                        >
                          CheckIn
                        </button>
                      </template>
                      <template v-else>
                        <div
                          class="nxd-no-select"
                          :class="{
                            'nxd-cursor-help': authStore.getUser,
                          }"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'triangle-exclamation']"
                            class="uk-preserve-width uk-text-warning"
                          />
                          <span
                            class="uk-margin-small-left uk-margin-small-right"
                          >
                            Checked out</span
                          >
                        </div>
                        <div v-if="authStore.getUser" uk-drop>
                          <div
                            class="uk-card uk-card-default uk-card-body uk-card-small"
                          >
                            <div class="uk-text-bold nxd-text-navy">
                              Checked out by
                              {{
                                device.checkout_fullname ||
                                device.checkout_username
                              }}
                            </div>
                            <div>
                              {{ createDateTimeString(device.checkout_time) }}
                              o'clock
                            </div>
                            <div class="uk-margin-small-top">
                              <div class="uk-text-bold nxd-text-navy">
                                Notes:
                              </div>
                              <div
                                class="uk-text-break nxd-max-height-small uk-overflow-auto"
                              >
                                {{ device.checkout_notes }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          v-if="canCheckIn"
                          class="uk-button uk-button-small uk-button-secondary uk-display-inline-block uk-width-auto"
                          @click="showCheckInConfirm"
                        >
                          CheckIn
                        </button>
                      </template>
                    </div>
                    <div v-else>
                      <font-awesome-icon
                        :icon="['fas', 'check-circle']"
                        class="uk-preserve-width uk-text-success"
                      /><span class="uk-margin-small-left uk-margin-small-right"
                        >Available</span
                      >
                      <button
                        class="uk-button uk-button-small uk-button-secondary uk-display-inline-block uk-width-auto"
                        @click="showCheckoutModal"
                      >
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
                  <th><span class="nxd-text-navy">IMEI</span></th>
                  <td>
                    <div v-for="(imei, index) of imeis" :key="index">
                      {{ imei.imei }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="uk-margin">
          <h3>Documents</h3>
        </div>
        <div class="uk-margin">
          <h3>Links</h3>
          <ul class="uk-list uk-list-divider">
            <li
              v-if="
                ['Smartphone', 'Simple Phone', 'Tablet'].includes(
                  device.device_type_name
                )
              "
              uk-tooltip="Search Device on kimovil to see technical details"
            >
              <a
                target="_blank"
                :title="'Search ' + device.name + ' on kimovil'"
                :href="buildKimovilLink(device)"
              >
                <font-awesome-icon
                  :icon="['fas', 'arrow-up-right-from-square']"
                />
                Search Device on kimovil</a
              >
            </li>
            <li
              v-for="link of device.weblinks"
              :key="link.id"
              :uk-tooltip="link.description"
            >
              <a :href="link.uri" target="_blank"
                ><font-awesome-icon
                  :icon="['fas', 'arrow-up-right-from-square']"
                />
                {{ link.name }}</a
              >
            </li>
          </ul>
          <div
            class="uk-margin-small-top uk-flex uk-flex-right"
            v-if="authStore.hasPermission('canCreateLinks')"
          >
            <a href="#" @click="showAddWeblinkModal(device)"
              ><font-awesome-icon :icon="['fas', 'plus']" /> Add Weblink</a
            >
          </div>
        </div>
        <div class="uk-margin">
          <h3>GuideMe</h3>
        </div>
        <div class="uk-margin" v-if="device.notes">
          <h3>Notes</h3>
          <div>{{ device.notes }}</div>
        </div>
      </div>
      <div class="uk-position-bottom" v-if="showEditBtn">
        <div
          class="uk-padding-small device-controls uk-flex uk-flex-right"
          uk-scrollspy="cls: uk-animation-slide-bottom; delay: 200; repeat:true;"
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/auth";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, url } from "@vuelidate/validators";
import axios from "axios";

function linkAlreadySet(value) {
  return !this.device.weblinks.some((link) => link.uri === value);
}

function nameAlreadySet(value) {
  return !this.device.weblinks.some((link) => link.name === value);
}

export default {
  name: "DeviceDetails",
  components: { FontAwesomeIcon },
  setup() {
    const authStore = useAuthStore();
    const v$ = useVuelidate();
    return { authStore, v$ };
  },
  data() {
    return {
      device: null,
      imeis: [],
      showEditBtn: false,
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
    showCheckInConfirm() {
      UIkit.modal
        .confirm(
          "Please confirm that the device is back in the device pool & plugged in.",
          {
            labels: { ok: "Yes", cancel: "No" },
            stack: true,
          }
        )
        .then(() => {
          this.handleCheckInConfirmed();
        });
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
      return (
        (this.authStore.hasPermission("canUpdateDevices") &&
          this.device.slot_id) ||
        (this.authStore.hasPermission("canUpdateVirtualDevices") &&
          !this.device.slot_id)
      );
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
      this.imeis = [];
      this.device = device;
      this.showEditBtn = this.canEditDevice();
      try {
        this.imeis = JSON.parse(this.device.imei) || [];
      } catch (e) {
        console.log(e);
      }
      console.log(device);
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
      console.log(this.device.weblinks);
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
