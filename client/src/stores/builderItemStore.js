import {defineStore} from "pinia";
import {useToast} from "vue-toastification";
import BuilderItem from "@/models/BuilderItem";
import axios from "axios";

const toast = useToast();

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
    async loadItems(category_id) {
      if (category_id === null) return [];
      try {
        const result = await axios.get(
          `/api/admin/poolbuilder/items?category_id=${category_id}`
        );
        let items = result.data.map((location) => {
          const builderItem = new BuilderItem();
          builderItem.setData(location);
          return builderItem;
        });
        return items;
      } catch (e) {
        console.log(e);
      }
    },

    async getChildItems(category_id) {
      try {
        const response = await axios.get("/api/admin/poolbuilder/items", {
          params: {
            category_id,
            parent_id: this.item.id,
          },
        });
        return response.data;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async saveItem(item = null) {
      if (!item) item = this.item;
      try {
        await axios.post("/api/admin/poolbuilder/items", item);
        toast.success("Location added");
        return true;
      } catch (e) {
        toast.error("Something went wrong while adding location");
        console.log(e);
        return false;
      }
    },
    async updateItem(item = null) {
      if (!item) item = this.item;
      try {
        await axios.put(`/api/admin/poolbuilder/items/${item.id}`, item);
        toast.success("Location updated");
        return true;
      } catch (error) {
        toast.error("Something went wrong while updating location");
        console.log(error);
        return false;
      }
    },
    async deleteItem(id = null) {
      if (!id) id = this.item.id;
      try {
        await axios.delete(`/api/admin/poolbuilder/items/${id}`);
        toast.success("Location deleted");
        return true;
      } catch (error) {
        toast.error("Something went wrong while deleting location");
        console.log(error);
        return false;
      }
    },
    async updateSorting(items) {
      if (!items) return false;
      const sortingMap = items.map((item) => {
        return { id: item.id, sorting: item.sorting };
      });
      axios
        .post("/api/admin/poolbuilder/items/sort", sortingMap)
        .then(() => {
          toast.success("Sorting updated");
          return true;
        })
        .catch((error) => {
          toast.error("Something went wrong while storing new sorting");
          console.log(error);
          return false;
        });
    },
  },
});
