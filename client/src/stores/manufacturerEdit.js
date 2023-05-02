import { defineStore } from "pinia";
import Manufacturer from "@/models/Manufacturer";
export const useManufacturerEditStore = defineStore("manufacturerEdit", {
  state: () => ({
    manufacturer: new Manufacturer(),
  }),
  getters: {
    get: (state) => {
      return state.manufacturer;
    },
  },
  actions: {
    async save() {
      console.log("save Manufacturer", this.manufacturer);
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
