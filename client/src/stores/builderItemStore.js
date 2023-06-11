import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import BuilderItem from "@/models/BuilderItem";
import { useBuilderCategoriesStore } from "@/stores/builderCategoriesStore";
import axios from "axios";

const toast = useToast();
const builderCategoriesStore = useBuilderCategoriesStore();

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

    async getChildItems(category_id, parent_id = null) {
      try {
        const response = await axios.get("/api/admin/poolbuilder/items", {
          params: {
            category_id,
            parent_id: parent_id || this.item.id,
          },
        });
        return response.data.map((item) => {
          const builderItem = new BuilderItem();
          builderItem.setData(item);
          return builderItem;
        });
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async saveItem(item = null) {
      if (!item) item = this.item;
      const itemCategoryName = builderCategoriesStore.findCategoryNameById(item.category_id) || "item";
      if(!item.params) delete item.params;
      try {
        await axios.post("/api/admin/poolbuilder/items", item);
        toast.success(`${itemCategoryName} added`);
        return true;
      } catch (e) {
        toast.error(`Something went wrong while adding ${itemCategoryName}`);
        console.log(e);
        return false;
      }
    },
    async updateItem(item = null) {
      if (!item) item = this.item;
      const itemCategoryName = builderCategoriesStore.findCategoryNameById(item.category_id) || "item";
      if(!item.params || !item.params.length) delete item.params;
      try {
        await axios.put(`/api/admin/poolbuilder/items/${item.id}`, item);
        toast.success(`${itemCategoryName} updated`);
        return true;
      } catch (error) {
        toast.error(`Something went wrong while updating ${itemCategoryName}`);
        console.log(error);
        return false;
      }
    },
    async deleteItem(item = null) {
      if (!item) item = this.item.id;
      const itemCategoryName =
        builderCategoriesStore.findCategoryNameById(item.category_id) || "item";
      try {
        await axios.delete(`/api/admin/poolbuilder/items/${item.id}`);
        toast.success(`${itemCategoryName} deleted`);
      } catch (error) {
        toast.error(
          `Something went wrong while deleting the ${itemCategoryName}`
        );
        console.log(error);
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
    async createItem(categoryId, parentId, name) {
      const item = new BuilderItem();
      item.category_id = categoryId;
      item.parent_id = parentId;
      item.sorting = 999;
      item.name = name;
      return await this.saveItem(item);
    },
  },
});
