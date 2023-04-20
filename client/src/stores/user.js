import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    userPermissions: [],
  }),
  getters: {},
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post("/api/auth/login", {
          username,
          password,
        });
        console.log(response);
      } catch (e) {
        console.log(e.response);
      }
    },
    logout() {
      this.userPermissions = [];
      this.user = null;
    },
    setUserPermissions(permissions) {
      this.userPermissions = permissions;
    },
  },
});
