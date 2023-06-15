import { defineStore } from "pinia";
import Manufacturer from "@/models/Manufacturer";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();
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
        toast.error("Error saving manufacturer: " + e.response.data.message);
        return false;
      }
    },
    reset() {
      this.manufacturer = new Manufacturer();
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
      this.manufacturer = response.data;
    },
    async getUpdatedData(id) {
      const response = await axios.get(`/api/manufacturers/${id}`);
      return response.data;
    },
  },
});
