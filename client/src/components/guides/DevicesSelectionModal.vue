<template>

  <div id="modal-device-selection" class="nxd-no-select" ref="deviceSelectionModal" uk-modal>
    <div class="uk-modal-dialog">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title">Select Linked Devices</h2>
      </div>
      <div class="uk-modal-body">
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

export default {
  name: "DevicesSelectionModal",
  components: {FontAwesomeIcon},
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
      currentLinkedDeviceIds : []
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.currentLinkedDeviceIds = this.linkedDeviceIds;
      this.getDevices();
      UIkit.modal(this.$refs.deviceSelectionModal).show();
    },
    hide() {
      this.$refs.deviceSelectionModal.hide();
    },
    async getDevices() {
      try{
        const response = await axios.get('/api/devices');
        this.devices = response.data.devices;
        this.total_count = response.data.total_count;
        this.updateDevicesSelectionState();
      } catch (e) {
        console.log(e);
      }

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