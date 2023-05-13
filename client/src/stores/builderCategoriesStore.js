import {defineStore} from "pinia";
import axios from "axios";

export const useBuilderCategoriesStore = defineStore("builderCategories", {
  state: () => ({
    categories: [],
  }),
  getters: {
    getCategories: (state) => {
      return state.categories;
    },
  },
  actions: {
    async loadCategories() {
      if (this.categories.length > 0) return this.getCategories;
      try {
        const response = await axios.get("/api/admin/poolbuilder/categories");
        this.categories = response.data;
        return this.getCategories;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    findCategoryIdByName(name) {
      const category = this.categories.find(
        (category) => category.name === name
      );
      if (!category) return false;
      return category.id;
    },
  },
});
