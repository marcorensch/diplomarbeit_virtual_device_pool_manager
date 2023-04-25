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
    // async getDevice(id) {
    //   try {
    //     const response = await axios.get(`/api/devices/${id}`);
    //     this.device = response.data;
    //     return true;
    //   } catch (e) {
    //     return false;
    //   }
    // },
  },
});
