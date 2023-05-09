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

    addMSISDN(msisdn) {
      console.log("addMSISDN", msisdn);
      this.device.msisdns.push(msisdn);
    },

    removeMSISDN(msisdn) {
      console.log("removeMSISDN", msisdn);
      this.device.msisdns = this.device.msisdns.filter((m) => m !== msisdn);
    },

    setAvailableMSISDNs() {
      return axios
        .get("/api/msisdns")
        .then((response) => {
          console.log(response.data);
          this.availableMSISDNs = response.data;
          this.availableMSISDNs.forEach((msisdn) => {
            if (msisdn.multi_device) {
              for (const md of msisdn.multi_device) {
                md.mainMsisdn = msisdn.msisdn;
                md.mainAbonnement = msisdn.abonnement;
              }
            }
          });
          console.log(this.availableMSISDNs);
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
    setDevice(id) {
      return axios
        .get(`/api/devices/${id}`)
        .then((response) => {
          console.log(response.data);
          this.device = this.device.setData(response.data);
          console.log(this.device);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error while loading device");
          return [];
        });
    },
    saveDevice() {
      this.device.msisdns = this.device.msisdns.map((m) => m.id);
      if (this.device.imei) this.device.imei = JSON.stringify(this.device.imei);
      console.log(this.device);
      if (this.device.id) {
        return axios
          .put(`/api/devices/${this.device.id}`, this.device)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error while saving device");
            return [];
          });
      } else {
        return axios
          .post(`/api/devices`, this.device)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error while saving device");
            return [];
          });
      }
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
