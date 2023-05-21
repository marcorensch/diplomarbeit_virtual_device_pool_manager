<template>
  <div v-if="device" id="device-details" uk-offcanvas="flip: true">
    <div class="uk-offcanvas-bar">
      <button class="uk-offcanvas-close" type="button" uk-close></button>
      <div id="offcanvas-content" v-if="device">
        <div class="uk-child-width-expand uk-grid-small" uk-grid>
          <div class="uk-width-1-3">
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
                    <span class="nxd-text-navy uk-display-inline-block"
                      >Location:</span
                    >
                  </th>
                  <td>
                    <span v-if="device.slot">{{ device.slot.label }}</span>
                    <span v-else>Virtual Device</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span class="nxd-text-navy">Since: </span>
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
  mounted() {},
  methods: {
    canEditDevice() {
      return (
        (this.authStore.hasPermission("canUpdateDevices") &&
          this.device.slot_id) ||
        (this.authStore.hasPermission("canUpdateVirtualDevices") &&
          !this.device.slot_id)
      );
    },
    createDateString(date) {
      return new Date(date).toLocaleDateString({
        year: "numeric",
        month: "long",
        day: "numeric",
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
