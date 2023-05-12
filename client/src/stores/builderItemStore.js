import {defineStore} from "pinia";
import BuilderItem from "@/models/BuilderItem";
import axios from "axios";

export const useBuilderItemStore = defineStore("builderItem", {
  state: () => ({
    item: new BuilderItem(),
  }),
  getters: {
    getItem: (state) => {
      return state.item;
    },
  },
  actions: {
    async loadItem(id) {
      try {
        const response = await axios.get("/api/admin/poolbuilder/items/" + id);
        this.item.setData(response.data);
        return this.getItem;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async getItems(category_id, parent_id) {
      try {
        const response = await axios.get("/api/admin/poolbuilder/items", {
          params: {
            category_id,
            parent_id,
          },
        });
        return response.data;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async getCategories() {
      try {
        const response = await axios.get("/api/admin/poolbuilder/categories");
        return response.data;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
});
