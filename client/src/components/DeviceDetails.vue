<template>
  <div id="device-details" uk-offcanvas="flip: true">
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
              class="uk-table uk-table-divider uk-table-small uk-table-middle uk-table-justify"
            >
              <tbody>
                <tr>
                  <th class="uk-table-shrink">
                    <span class="nxd-text-navy uk-display-inline-block"
                      >Location:</span
                    >
                  </th>
                  <td>
                    <span>{{ device.slot.label }}</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span class="nxd-text-navy uk-width-small">Since: </span>
                  </th>
                  <td>
                    <span>{{ createDateString(device.added) }}</span>
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
            >
              <a
                target="_blank"
                :title="'Search ' + device.name + ' on kimovil'"
                :href="buildKimovilLink(device)"
                >Search Device on kimovil</a
              >
            </li>
          </ul>
        </div>
        <div class="uk-margin">
          <h3>GuideMe</h3>
        </div>
      </div>
      <div class="uk-position-bottom">
        <div class="uk-padding-small device-controls uk-flex uk-flex-right">
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
</template>

<script>
import UIkit from "uikit";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "DeviceDetails",
  components: { FontAwesomeIcon },
  data() {
    return {
      device: null,
    };
  },
  methods: {
    createDateString(date) {
      return new Date(date).toLocaleDateString({
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    show(device) {
      this.device = device;
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
  },
};
</script>

<style lang="less">
@import "@/assets/less/buttons.less";
@import "@/assets/less/components/device-details-offcanvas.less";
</style>
