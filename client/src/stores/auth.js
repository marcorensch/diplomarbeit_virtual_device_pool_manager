import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    userPermissions: [],
  }),
  getters: {
    isLoggedIn: (state) => {
      return state.user !== null;
    },
    hasPermission: (state) => (permission) => {
      return state.userPermissions.includes(permission);
    },
    hasPermissions: (state) => (permissions) => {
      return permissions.every((permission) =>
        state.userPermissions.includes(permission)
      );
    },
  },
  actions: {
    checkAuth() {
      const user = localStorage.getItem("user");
      const permissions = localStorage.getItem("permissions");
      if (user && permissions) {
        this.user = JSON.parse(user);
        this.userPermissions = JSON.parse(permissions);
      }
    },
    async login(username, password) {
      try {
        const response = await axios.post("/api/auth/login", {
          username,
          password,
        });
        console.log(response);
        this.user = response.data.user;
        this.userPermissions = response.data.permissions;
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem(
          "permissions",
          JSON.stringify(this.userPermissions)
        );
        toast.success("Successfully logged in");
        this.router.push("/");
      } catch (e) {
        console.log(e.response);
        toast.error("Error while logging in, please try again");
      }
    },
    async updateProfile(data) {
      try {
        const response = await axios.put(`/api/accounts/${this.user.id}`, data);
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        toast.success("Successfully updated profile");
        return true;
      } catch (e) {
        return false;
      }
    },
    async logout() {
      this.userPermissions = [];
      this.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      try {
        const response = await axios.get("/api/auth/logout");
        if (response.status === 200) {
          toast.info("Successfully logged out");
          this.router.push("/");
        } else {
          toast.error("Error while logging out");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteAccount() {
      try {
        const response = await axios.delete(`/api/accounts/${this.user.id}`);
        if (response.status === 200) {
          toast.info("Successfully deleted account");
          await this.logout();
        } else {
          toast.error("Failed to delete account, Reason:\n" + response.text);
        }
      } catch (e) {
        console.log(e.response);
        toast.error(`Failed to delete account, Reason:\n${e.response.data}`);
      }
    },
  },
});
