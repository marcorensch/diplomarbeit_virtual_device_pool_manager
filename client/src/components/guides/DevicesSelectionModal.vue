<template>

  <div id="modal-device-selection" class="nxd-no-select uk-modal-container" ref="deviceSelectionModal" uk-modal>
    <div class="uk-modal-dialog">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title">Select Linked Devices</h2>
      </div>
      <div class="uk-modal-body">
        <DevicesActionbar
            :show-add-btn="false"
            :show-availability-filter="false"
            @search="handleNewSearchRequest"
        />
        <table class="uk-table uk-table-small uk-table-divider uk-table-middle uk-table-hover">
          <thead>
          <th>
            <font-awesome-icon class="uk-preserve-width" :icon="['fas','link']"/>
          </th>
          <th>Device Name</th>
          </thead>
          <tbody>
          <template v-for="device of devices" :key="device.id">
            <tr>
              <td class="uk-table-shrink">
                <input class="uk-checkbox" type="checkbox" :name="device.id" :id="device.id" @change="handleLink(device)" v-model="device.checked"></td>
              <td class="uk-width-expand">
                <label class="uk-display-block" :for="device.id">{{ device.name }}</label>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
        <PaginationWidget
            :total_count="total_count"
            :default_page_size="limit"
            :updateTrigger="updateTrigger"
            @pageChange="handlePageChange"
            @pageSizeChange="handlePageSizeChanged"
        />
      </div>
      <div class="uk-modal-footer uk-text-right">
        <button class="uk-button uk-button-secondary uk-modal-close" type="button">Close</button>
      </div>
    </div>
  </div>

</template>


<script>
import UIkit from 'uikit';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import axios from "axios";
import DevicesActionbar from "@/components/devices/devicesActionbar.vue";
import DeviceHelper from "@/helpers/DeviceHelper.mjs";
import PaginationWidget from "@/components/widgets/PaginationWidget.vue";

export default {
  name: "DevicesSelectionModal",
  components: {PaginationWidget, DevicesActionbar, FontAwesomeIcon},
  emits: ['update-linked-devices'],
  props: {
    linkedDeviceIds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      devices: [],
      total_count: 0,
      offset: 0,
      limit: 20,
      currentLinkedDeviceIds : [],
      filters: {
        search: '',
        availability: '',
        type: '',
      },
      updateTrigger: 0,
    }
  },
  mounted() {

  },
  methods: {
    handlePageChange(page) {
      this.offset = (page - 1) * this.limit;
      this.getDevices();
      this.updateTrigger++;
    },
    handlePageSizeChanged(pageSize) {
      this.offset = 0;
      this.limit = pageSize;
      this.getDevices();
      this.updateTrigger++;
    },
    async getDevices() {
      try {
        const response = await DeviceHelper.getDevices(
            this.limit,
            this.offset,
            this.filters
        );
        this.devices = response.devices;
        this.total_count = response.total_count;
        this.updateDevicesSelectionState();
      } catch (e) {
        console.log(e);
      }
    },

    handleNewSearchRequest(filters) {
      this.offset = 0;
      this.filters = filters;
      if (filters.search.trim().length && filters.search.trim().length < 3) {
        this.toast.warning("Search term should be at least 3 characters long");
        filters.search = "";
      }
      this.getDevices();
    },
    show() {
      this.currentLinkedDeviceIds = this.linkedDeviceIds;
      this.getDevices();
      UIkit.modal(this.$refs.deviceSelectionModal).show();
    },
    hide() {
      this.$refs.deviceSelectionModal.hide();
    },
    updateDevicesSelectionState() {
      for(let device of this.devices) {
        if(this.currentLinkedDeviceIds.includes(device.id)) {
          device.checked = true;
        }
      }
    },
    async handleLink(device) {
      if(device.checked) {
        await this.linkDevice(device);
      } else {
        await this.unlinkDevice(device);
      }
      this.$emit('update-linked-devices');
    },
    async linkDevice(device) {
      this.currentLinkedDeviceIds.push(device.id);
      try {
        return await axios.post(`/api/admin/guides/${this.$route.params.id}/devices/${device.id}`);
      } catch (e) {
        console.log(e);
      }
    },
    async unlinkDevice(device) {
      this.currentLinkedDeviceIds = this.currentLinkedDeviceIds.filter(id => id !== device.id);
      try {
        return await axios.delete(`/api/admin/guides/${this.$route.params.id}/devices/${device.id}`);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
</script>


<style scoped>

</style>