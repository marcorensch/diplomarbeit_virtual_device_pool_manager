import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import Device from "@/models/Device.mjs";
import axios from "axios";

const toast = useToast();

export const useDeviceEditStore = defineStore("deviceEdit", {
  state: () => ({
    device: new Device(),
    deviceTypes: [],
    manufacturers: [],
    availableMSISDNs: [],
  }),
  getters: {
    getDevice: (state) => {
      return state.device;
    },
    getDeviceTypes: (state) => {
      return state.deviceTypes;
    },
    getManufacturers: (state) => {
      return state.manufacturers;
    },
    getAvailableMSISDNs: (state) => {
      return state.availableMSISDNs;
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

    setAvailableMSISDNs() {
      return axios
        .get("/api/msisdns")
        .then((response) => {
          console.log(response.data);
          this.availableMSISDNs = response.data;
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error while loading MSISDNs");
          return [];
        });
    },
    setAvailableDeviceTypes() {
      return axios
        .get("/api/devicetypes")
        .then((response) => {
          console.log(response.data);
          this.deviceTypes = response.data;
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error while loading device types");
          return [];
        });
    },

    setAvailableManufacturers() {
      return axios
        .get("/api/manufacturers")
        .then((response) => {
          console.log(response.data);
          this.manufacturers = response.data;
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error while loading manufacturers");
          return [];
        });
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
