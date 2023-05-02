import { defineStore } from "pinia";
import Manufacturer from "@/models/Manufacturer";
import axios from "axios";
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
      try {
        if (this.manufacturer.id) {
          await this.update();
        } else {
          await this.create();
        }
        return true;
      } catch (e) {
        return false;
      }
    },
    async create() {
      const result = await axios.post("/api/manufacturers", this.manufacturer);
      this.manufacturer.id = result.data.id;
    },
    async update() {
      await axios.put("/api/manufacturers", this.manufacturer);
    },
    async delete() {
      await axios.delete(`/api/manufacturers/${this.manufacturer.id}`);
    },
    async load(id) {
      const response = await axios.get(`/api/manufacturers/${id}`);
      console.log(response.data);
      this.manufacturer = response.data;
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
