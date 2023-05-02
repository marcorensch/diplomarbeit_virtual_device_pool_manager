import { defineStore } from "pinia";
import Device from "@/models/Device.mjs";

export const useDeviceEditStore = defineStore("deviceEdit", {
  state: () => ({
    device: new Device(),
  }),
  getters: {
    getDevice: (state) => {
      return state.device;
    },
  },
  actions: {
    setIMEIs(imeis) {
      console.log("setIMEIs", imeis);
      this.device.imei = imeis;
    },
    setDeviceType(deviceTypeId) {
      console.log("setDeviceType", deviceTypeId);
      this.device.device_type_id = deviceTypeId;
    },
    async saveDevice() {
      console.log("saveDevice", this.device);
    },
    // async getDevice(id) {
    //   try {
    //     const response = await axios.get(`/api/widgets/${id}`);
    //     this.device = response.data;
    //     return true;
    //   } catch (e) {
    //     return false;
    //   }
    // },
  },
});
